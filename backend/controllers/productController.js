const Product = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendEmail = require('../utils/sendEmail')
const User = require('../models/userModel')
const Bid = require('../models/bidModel')
const Data = require('../models/dataModel')
const { cloudinary } = require('../utils/cloudinary')
const uploadImagetoCloudinary = require('../utils/uploadImagetoCloudinary')
const ApiFeatures = require('../utils/apiFeatures')
const agenda = require('../config/agendaConfig')
const moment = require('moment')

const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

// Create Product  -- SELLER
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  const { featuredImg, imageOne, imageTwo, imageThree, endDate } = req.body

  // upload user products according to package
  const user = await User.findById(req.user._id)
  const packages = await Data.findById('62ea446ef91380cf34601403')

  let limitExceeded = false
  packages.packages.map((pkg) => {
    if (pkg.name === user.userPackage) {
      if (user.productsPosted >= pkg.productsAllowed) {
        limitExceeded = true
        return
      }
    }
  })

  if (limitExceeded) {
    return next(
      new ErrorHandler(
        `You have reached your limit of ${user.productsPosted} products. Please upgrade your package to post more products.`,
        400
      )
    )
  }

  // Build the product document from an explicit allow-list; never trust client-supplied status / tag / bidStatus / user (mass assignment).
  const productData = {
    user: req.user._id,
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    subCategory: req.body.subCategory,
    price: req.body.price,
    bidTime: req.body.bidTime,
    status: 'Pending',
    bidStatus: 'Live',
    tag: 'Normal',
    location: {
      province: req.body.province,
      city: req.body.city,
    },
    images: {},
  }

  // Optional category-specific fields (only if provided by the client)
  const optionalFields = [
    'furnished', 'bedrooms', 'bathrooms', 'noOfStoreys', 'constructionState',
    'type', 'features', 'make', 'model', 'year', 'kmsDriven', 'fuelType',
    'floorLevel', 'areaUnit', 'area',
  ]
  for (const field of optionalFields) {
    if (req.body[field] !== undefined) {
      productData[field] = req.body[field]
    }
  }

  // upload images to cloudinary
  if (!featuredImg) {
    return next(new ErrorHandler('Featured Image is required to post an AD', 401))
  }

  const uploadImages = async (image, key) => {
    if (image) {
      const result = await uploadImagetoCloudinary(image)
      productData.images[key] = {
        public_id: result.public_id,
        url: result.secure_url,
      }
    }
  }

  await uploadImages(featuredImg, 'featuredImg')
  await uploadImages(imageOne, 'imageOne')
  await uploadImages(imageTwo, 'imageTwo')
  await uploadImages(imageThree, 'imageThree')

  // Converting endDate to UTC for storing in the database
  productData.endDate = moment(endDate).utc().toDate()

  const product = await Product.create(productData)

  if (product) {
    user.productsPosted += 1
    await user.save()
  }

  // Schedule job to expire the product and notify winner
  await agenda.schedule(product.endDate, 'expire and notify winner', {
    productId: product._id,
  })

  res.status(201).json({
    success: true,
    product,
  })
})

// Get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {
  const resultsPerPage = 12

  const apiFeature = new ApiFeatures(Product.find({ status: 'Approved', bidStatus: 'Live' }), req.query)
    .search()
    .filter()
    .sort()
    .pagination(resultsPerPage)

  // Apply filters to get the count of all matching products
  const baseQuery = Product.find({ status: 'Approved', bidStatus: 'Live' })
  const countQuery = new ApiFeatures(baseQuery, req.query).search().filter()

  // Count all products matching the initial filters
  const productsCount = await countQuery.query.countDocuments()

  // Fetch the products with pagination
  const products = await apiFeature.query.populate({
    path: 'user',
    select: 'name avatar.url',
  })

  // The number of products returned after pagination
  const filteredProductsCount = products.length

  res.status(200).json({
    success: true,
    productsCount,
    products,
    filteredProductsCount,
    resultsPerPage,
  })
})

// Get Hot Products (With most bids)
exports.getHotProducts = catchAsyncErrors(async (req, res) => {
  const products = await Bid.aggregate([
    {
      $project: {
        bidItem: 1,
        biddersCount: { $size: '$bidders' },
      },
    },
    { $sort: { biddersCount: -1 } },
    { $limit: 12 },
    {
      $lookup: {
        from: 'products',
        let: { bidItemId: '$bidItem' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$_id', '$$bidItemId'] },
                  { $eq: ['$status', 'Approved'] },
                  { $eq: ['$bidStatus', 'Live'] },
                ],
              },
            },
          },
        ],
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $lookup: {
        from: 'users',
        localField: 'product.user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    {
      $project: {
        _id: '$product._id',
        title: '$product.title',
        price: '$product.price',
        bidStatus: '$product.bidStatus',
        endDate: '$product.endDate',
        category: '$product.category',
        location: '$product.location',
        'images.featuredImg.url': '$product.images.featuredImg.url',
        biddersCount: 1,
        'user._id': '$user._id',
        'user.name': '$user.name',
        'user.avatar.url': '$user.avatar.url',
      },
    },
  ])

  res.status(200).json({
    success: true,
    products,
  })
})

// Get Products Bidding Ending Soon
exports.getBidsEndingSoon = catchAsyncErrors(async (req, res) => {
  const products = await Product.find({
    status: 'Approved',
    bidStatus: 'Live',
  })
    .populate({
      path: 'user',
      select: 'name avatar.url',
    })
    .sort({ endDate: 1 })
    .limit(12)

  res.status(200).json({
    success: true,
    products,
  })
})

// Get Latest Products
exports.getLatestProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find({ status: 'Approved', bidStatus: 'Live' })
    .populate({
      path: 'user',
      select: 'name avatar.url',
    })
    .sort({ createdAt: -1 })
    .limit(12)

  res.status(200).json({
    success: true,
    products,
  })
})

// Get All Products --Admin
exports.getAllProductsAdmin = catchAsyncErrors(async (req, res) => {
  const apiFeature = new ApiFeatures(Product.find({ status: 'Approved' }), req.query)
  const products = await apiFeature.query
    .populate({
      path: 'user',
      select: 'name avatar.url',
    })
    .sort({ createdAt: -1 })
  let productsCount = await Product.countDocuments()
  let filteredProductsCount = products.length

  res.status(200).json({
    success: true,
    productsCount,
    products,
    filteredProductsCount,
  })
})

//Get Approval Products -- Seller
exports.getApprovalProductsSeller = catchAsyncErrors(async (req, res) => {
  const approvalProducts = await Product.find({
    user: req.user._id,
    status: 'Pending',
  })

  let approvalProductsCount = await Product.countDocuments({
    user: req.user._id,
    status: 'Pending',
  })

  res.status(200).json({
    success: true,
    approvalProductsCount,
    approvalProducts,
  })
})

//Get Approval Products -- Admin
exports.getApprovalProductsAdmin = catchAsyncErrors(async (req, res) => {
  const approvalProducts = await Product.find({ status: 'Pending' }).populate({
    path: 'user',
    select: 'name avatar.url',
  })

  let approvalProductsCount = await Product.countDocuments({
    status: 'Pending',
  })

  res.status(200).json({
    success: true,
    approvalProductsCount,
    approvalProducts,
  })
})

//Approve Product -- Admin
exports.approveProduct = catchAsyncErrors(async (req, res) => {
  const product = await Product.findById(req.params.id)
  product.status = 'Approved'
  await product.save()

  const productUser = await User.findById(product.user)

  const emailData = {
    user: { name: productUser.name },
    product: { title: product.title, _id: product._id },
    frontendUrl: process.env.FRONTEND_URL,
  }
  try {
    await sendEmail({
      email: productUser.email,
      subject: 'Congratulations! Your Product has been Approved',
      template: 'product-approved-mail',
      data: emailData,
    })
  } catch (err) {
    console.log('Error in sending Email:', err)
  }

  res.status(200).json({
    success: true,
    message: 'Product Approved',
    product,
  })
})

//Get All Products of Logged In User
exports.getUserAllProducts = catchAsyncErrors(async (req, res) => {
  const products = await Product.find({ user: req.user.id, status: 'Approved' })
  const countProducts = products.length

  if (!products) {
    res.status(200).json({
      success: true,
      countProducts,
      products,
    })
  }

  res.status(200).json({
    success: true,
    countProducts,
    products,
  })
})

// GET Single Product
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    'user',
    'name email phoneNo aboutInfo avatar userPackage'
  )

  if (!product) {
    return next(new ErrorHandler('Product Not Found', 404))
  }

  res.status(200).json({
    success: true,
    product,
  })
})

// Update a Product  --SELLER / ADMIN
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandler('Product Not Found', 404))
  }

  // A seller may only update their own product; admins may update any.
  if (req.user.role !== 'admin' && product.user.toString() !== req.user.id.toString()) {
    return next(new ErrorHandler('You are not allowed to update this product', 403))
  }

  // Apply an explicit allow-list; never let the client set user / status / tag / bidStatus (mass assignment).
  const updatableFields = [
    'title', 'description', 'price', 'bidTime',
    'furnished', 'bedrooms', 'bathrooms', 'noOfStoreys', 'constructionState',
    'type', 'features', 'make', 'model', 'year', 'kmsDriven', 'fuelType',
    'floorLevel', 'areaUnit', 'area',
    'category', 'subCategory',
  ]
  const updateData = {}
  for (const field of updatableFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field]
    }
  }

  // Map province/city into the nested location object if provided
  if (req.body.province !== undefined || req.body.city !== undefined) {
    updateData.location = {
      province: req.body.province ?? product.location?.province,
      city: req.body.city ?? product.location?.city,
    }
  }

  // Images are uploaded client-side to Cloudinary; pass them through if present.
  if (req.body.images !== undefined) {
    updateData.images = req.body.images
  }

  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    product: updatedProduct,
  })
})

// DELETE PRODUCT -- ADMIN,SELLER
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    return next(new ErrorHandler('Product Not Found', 404))
  }

  if (product.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
    return next(new ErrorHandler(`You are not allowed to delete this product`, 403))
  }

  if (product.status !== 'Approved') {
    const user = await User.findById(product.user)
    user.productsPosted -= 1
    await user.save()
  }

  // Delete all the bids of the product
  const bidDocument = await Bid.findOne({ bidItem: req.params.id })
  if (bidDocument) {
    await bidDocument.deleteOne()
  }

  await product.deleteOne()

  res.status(200).json({
    success: true,
    message: 'Product Deleted Successfully',
    product,
  })
})
