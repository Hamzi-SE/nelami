const Bid = require('../models/bidModel')
const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const Notification = require('../models/notificationModel')
const eventEmitter = require('../utils/eventEmitter')

// Create new Bid
exports.newBid = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role === 'Seller') {
    return next(new ErrorHandler(`Role: ${req.user.role} cannot bid on this product`, 401))
  }

  const userId = req.user._id
  const productId = req.params.id
  const { price } = req.body

  if (price > 999999999) {
    return next(new ErrorHandler(`Price is way too high`, 401))
  }

  // Check if the product exists and is available for bidding
  const product = await Product.findById(productId)

  if (!product) {
    return next(new ErrorHandler(`Product not found with id: ${productId}`, 404))
  }

  if (product.endDate < Date.now()) {
    return next(new ErrorHandler(`Bidding has ended for this product`, 401))
  }

  // Check if a bid already exists for this product and user
  let bid = await Bid.findOne({ bidItem: productId })
  let outbidBidders = []

  if (bid) {
    // Determine the new highest bid
    const highestBid = Math.max(price, ...bid.bidders.map((b) => b.price))

    // Find bidders who are outbid (i.e., their bids are less than the new highest bid)
    outbidBidders = bid.bidders.filter(
      (bidder) => bidder.price < highestBid && bidder.user.toString() !== userId.toString()
    )

    // Check if the user has already placed a bid
    const userBid = bid.bidders.find((bidder) => bidder.user.toString() === userId.toString())

    if (userBid) {
      // Update the existing bid price
      userBid.price = price
    } else {
      // Add a new bid for the user
      bid.bidders.push({ user: userId, price })
    }

    await bid.save()

    res.status(201).json({
      success: true,
      newPresentBid: bid,
    })
  } else {
    // Create a new bid document if no existing bid was found
    const newBid = await Bid.create({
      bidItem: productId,
      bidders: {
        user: userId,
        price,
      },
    })

    res.status(201).json({
      success: true,
      newPresentBid: newBid,
    })
  }

  // Create and emit notifications for outbid bidders asynchronously
  process.nextTick(async () => {
    const notificationPromises = outbidBidders.map(async (outbidder) => {
      const notification = new Notification({
        userId: outbidder.user,
        message: `${req.user.name.split(' ')[0]} has outbid you on the product: ${product.title.substring(0, 20)}...`,
        link: `/product/${productId}`,
      })
      await notification.save()
      eventEmitter.emit('notificationCreated', notification)
    })

    await Promise.all(notificationPromises)
  })
})

//Get Single Product Bids
exports.singleProductBids = catchAsyncErrors(async (req, res, next) => {
  const bids = await Bid.find({ bidItem: req.params.id }).populate({
    path: 'bidders.user',
    select: '_id name email avatar phoneNo',
  })
  res.status(200).json({
    success: true,
    bids,
  })
})

//Get User Bids
exports.getUserBids = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role == 'Seller') {
    return next(new ErrorHandler(`Role: ${req.user.role} can not bid`, 401))
  }

  const user = req.user._id

  const bids = await Bid.find({ 'bidders.user': user }).populate({
    path: 'bidItem',
    select: 'title price images bidStatus',
  })

  res.status(200).json({
    success: true,
    user,
    bids,
  })
})
