const Bid = require('../models/bidModel')
const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const Notification = require('../models/notificationModel')
const eventEmitter = require('../utils/eventEmitter')
const sendNotification = require('../utils/sendNotification')

// Create new Bid
exports.newBid = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role !== 'buyer') {
    return next(new ErrorHandler(`Role: ${req.user.role} cannot bid on products`, 401))
  }

  const userId = req.user._id
  const productId = req.params.id
  const { price } = req.body

  // check if price is valid
  if (isNaN(price) || price <= 0) {
    return next(new ErrorHandler(`Please enter a valid price`, 401))
  }

  // Check if the product exists and is available for bidding
  const product = await Product.findById(productId)

  if (!product) {
    return next(new ErrorHandler(`Product not found with id: ${productId}`, 404))
  }

  if (product.bidStatus === 'Expired' || product.status !== 'Approved') {
    return next(new ErrorHandler(`Product is not available for bidding`, 400))
  }

  if (price <= product.price) {
    return next(new ErrorHandler(`Minimum bid amount should be greater than the product's price`, 400))
  }

  // Check if a bid already exists for this product and user
  let bid = await Bid.findOne({ bidItem: productId })

  let highestBid = product.price // Start bidding from the product's initial price

  if (bid && bid.bidders.length > 0) {
    // Find the current highest bid
    highestBid = Math.max(...bid.bidders.map((b) => b.price))
  }

  // Calculate the dynamic maximum bid (50% higher than the highest bid)
  const dynamicMaxBid = Math.round(highestBid * 1.5) // 50% increase over the current highest bid

  if (price > dynamicMaxBid) {
    return next(
      new ErrorHandler(
        `Your bid is too high. The maximum allowed bid is Rs. ${dynamicMaxBid} right now. (50% higher than the current highest bid)`,
        400
      )
    )
  }

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

      await sendNotification({
        userId: userId,
        message: `Your bid has been updated successfully on the product: ${product.title.substring(0, 20)}...`,
        link: `/product/${productId}`,
      })
    } else {
      // Add a new bid for the user
      bid.bidders.push({ user: userId, price })

      await sendNotification({
        userId: userId,
        message: `Your bid has been placed successfully on the product: ${product.title.substring(0, 20)}...`,
        link: `/product/${productId}`,
      })
    }

    await bid.save()

    await sendNotification({
      userId: product.user,
      message: `${req.user.name.split(' ')[0]} has bid on your product: ${product.title.substring(0, 20)}...`,
      link: `/product/${productId}`,
    })

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

    await sendNotification({
      userId: product.user,
      message: `${req.user.name.split(' ')[0]} has bid on your product: ${product.title.substring(0, 20)}...`,
      link: `/product/${productId}`,
    })

    await sendNotification({
      userId: userId,
      message: `Your bid has been placed successfully on the product: ${product.title.substring(0, 20)}...`,
      link: `/product/${productId}`,
    })

    res.status(201).json({
      success: true,
      newPresentBid: newBid,
    })
  }

  // Create and emit notifications for outbid bidders asynchronously
  process.nextTick(async () => {
    const notificationPromises = outbidBidders.map(async (outbidder) => {
      await sendNotification({
        userId: outbidder.user,
        message: `${req.user.name.split(' ')[0]} has outbid you on the product: ${product.title.substring(0, 20)}...`,
        link: `/product/${productId}`,
      })
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

// Retract Bid
exports.retractBid = catchAsyncErrors(async (req, res, next) => {
  const productId = req.params.id
  const userId = req.user._id

  const product = await Product.findById(productId)

  if (!product) {
    return next(new ErrorHandler(`Product not found with id: ${productId}`, 404))
  }

  if (product.bidStatus === 'Expired' || product.status !== 'Approved') {
    return next(new ErrorHandler(`Product is not available for bidding`, 400))
  }

  const bid = await Bid.findOne({ bidItem: productId })

  if (!bid) {
    return next(new ErrorHandler(`No bids found for this product`, 404))
  }

  const bidderIndex = bid.bidders.findIndex((bidder) => bidder.user.toString() === userId.toString())

  if (bidderIndex === -1) {
    return next(new ErrorHandler(`User has not placed a bid`, 400))
  }

  bid.bidders.splice(bidderIndex, 1)

  await bid.save()

  await sendNotification({
    userId,
    message: `Your bid on product ${product.title.substring(0, 20)}... has been retracted.`,
    link: `/product/${productId}`,
  })

  res.status(200).json({
    success: true,
    message: 'Bid retracted successfully',
  })
})
