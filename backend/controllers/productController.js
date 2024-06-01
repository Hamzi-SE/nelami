const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/userModel");
const Bid = require("../models/bidModel");
const Data = require("../models/dataModel");
const { cloudinary } = require("../utils/cloudinary");
const uploadImagetoCloudinary = require("../utils/uploadImagetoCloudinary");
const ApiFeatures = require("../utils/apiFeatures");
const agenda = require("../config/agendaConfig");
const moment = require("moment");

const dotenv = require("dotenv");

dotenv.config({ path: "./config/config.env" });



// Create Product  -- SELLER
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user._id;

  const { featuredImg, imageOne, imageTwo, imageThree } = req.body;

  // upload user products according to package
  const user = await User.findById(req.user._id);
  const packages = await Data.findById("62ea446ef91380cf34601403")

  let limitExceeded = false;
  packages.packages.map((pkg) => {
    if (pkg.name === user.userPackage) {
      if (user.productsPosted >= pkg.productsAllowed) {
        limitExceeded = true;
        return
      }
    }
  });

  if (limitExceeded) {
    return next(new ErrorHandler(`You have reached your limit of ${user.productsPosted} products. Please upgrade your package to post more products.`, 400));
  }

  // upload images to cloudinary
  if (!featuredImg) {
    return next(new ErrorHandler("Featured Image is required to post an AD", 401));
  }

  req.body.location = {
    province: req.body.province,
    city: req.body.city,
  };

  req.body.images = {}

  const uploadImages = async (image, key) => {
    if (image) {
      const result = await uploadImagetoCloudinary(image);
      req.body.images[key] = {
        public_id: result.public_id,
        url: result.secure_url,
      };
    }
  };

  await uploadImages(featuredImg, 'featuredImg');
  await uploadImages(imageOne, 'imageOne');
  await uploadImages(imageTwo, 'imageTwo');
  await uploadImages(imageThree, 'imageThree');


  const product = await Product.create(req.body);

  if (product) {
    user.productsPosted += 1;
    await user.save();
  }

  // Convert endDate to UTC before scheduling the job
  const endDateUTC = moment(product.endDate).utc().toDate();

  // Schedule job to expire the product and notify winner
  await agenda.schedule(endDateUTC, 'expire and notify winner', { productId: product._id });

  res.status(201).json({
    success: true,
    product,
  });
});






// Get All Products
exports.getAllProducts = catchAsyncErrors(async (req, res) => {

  const resultsPerPage = 12;

  const apiFeature = new ApiFeatures(Product.find({status: "Approved", bidStatus: "Live"}), req.query).search().filter().pagination(resultsPerPage);
  const products = await apiFeature.query.populate({
    path: "user", select: "name avatar.url"
  });
  let productsCount;
  if (!req.query.category && !req.query.keyword && !req.query.province && !req.query.city && !req.query.price) {
    productsCount = await Product.countDocuments({ status: "Approved", bidStatus: "Live" });
  } else {
    productsCount = products.length;
  }
  let filteredProductsCount = products.length;


  if (req.query.category) {
    productsCount = await Product.countDocuments({ category: req.query.category, status: "Approved", bidStatus: "Live" });
  }

  res.status(200).json({
    success: true,
    productsCount,
    products,
    filteredProductsCount,
    resultsPerPage
  });
});

// Get All Products --Admin
exports.getAllProductsAdmin = catchAsyncErrors(async (req, res) => {


  const apiFeature = new ApiFeatures(Product.find({ status: "Approved" }), req.query)
  const products = await apiFeature.query.populate({
    path: "user", select: "name avatar.url"
  }).sort({ createdAt: -1 });
  let productsCount = await Product.countDocuments();
  let filteredProductsCount = products.length;

  res.status(200).json({
    success: true,
    productsCount,
    products,
    filteredProductsCount,
  });
});

//Get Approval Products -- Seller
exports.getApprovalProductsSeller = catchAsyncErrors(async (req, res) => {

  const approvalProducts = await Product.find({ user: req.user._id, status: "Pending" });

  let approvalProductsCount = await Product.countDocuments({ user: req.user._id, status: "Pending" });

  res.status(200).json({
    success: true,
    approvalProductsCount,
    approvalProducts,
  });
});

//Get Approval Products -- Admin
exports.getApprovalProductsAdmin = catchAsyncErrors(async (req, res) => {


  const approvalProducts = await Product.find({ status: "Pending" }).populate({
    path: "user", select: "name avatar.url"
  });

  let approvalProductsCount = await Product.countDocuments({ status: "Pending" });

  res.status(200).json({
    success: true,
    approvalProductsCount,
    approvalProducts,
  });
});

//Approve Product -- Admin
exports.approveProduct = catchAsyncErrors(async (req, res) => {


  const product = await Product.findById(req.params.id);
  product.status = "Approved";
  await product.save();

  const productUser = await User.findById(product.user);
  const message = `Congratulations! Your product ${product.title} has been approved.\nLink:${process.env.FRONTEND_URL}/Product/${product._id}`
  try {
    await sendEmail({
      email: productUser.email,
      subject: "Congratulations! Product Approved",
      message,
    });
  } catch (err) {
    console.log("Error in sending Email:", err)
  }

  res.status(200).json({
    success: true,
    message: "Product Approved",
    product
  });
});




//Get All Products of Logged In User
exports.getUserAllProducts = catchAsyncErrors(async (req, res) => {

  const products = await Product.find({ user: req.user.id, status: "Approved" })
  const countProducts = products.length

  if (!products) {
    res.status(200).json({
      success: true,
      countProducts,
      products,
    });
  }

  res.status(200).json({
    success: true,
    countProducts,
    products,
  });
})





// GET Single Product
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("user", "name email phoneNo aboutInfo avatar userPackage");

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});






// Update a Product  --SELLER
exports.updateProduct = catchAsyncErrors(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }






  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});






// DELETE PRODUCT -- ADMIN,SELLER
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product Not Found", 404));
  }

  if (product.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
    return next(new ErrorHandler(`You are not allowed to delete this product`, 403));
  }

  if (product.status !== "Approved") {
    const user = await User.findById(product.user);
    user.productsPosted -= 1;
    await user.save();
  }

  // Delete all the bids of the product
  const bidDocument = await Bid.findOne({ bidItem: req.params.id });
  if (bidDocument) {
    await bidDocument.remove();
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
    product,
  });
});