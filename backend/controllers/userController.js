const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const {sendToken, createActivationToken} = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// const { cloudinary } = require("../utils/cloudinary");
const cloudinaryy = require("cloudinary");
const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const Product = require("../models/productModel");
const Bid = require("../models/bidModel");
const Conversation = require("../models/conversationModel");


// Register User
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, confirmPassword, role, address, phoneNo, city, store, aboutInfo } = req.body;

  if (!name || !email || !password || !confirmPassword || !role || !phoneNo || !city) {
    return next(new ErrorHandler("Please Fill All Required Fields", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }

  if (role === "seller" && !store) {
    return next(new ErrorHandler("Seller must enter store name", 400));
  }

  let productsPosted;
  let userPackage;
  if (role === "seller") {
    productsPosted = 0;
    userPackage = "Free"
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new ErrorHandler("Email is already registered", 400));
  }
  
  const user = {
    userPackage,
    name,
    email,
    password,
    role,
    address,
    phoneNo,
    city,
    store,
    aboutInfo,
    productsPosted,
  }

  const activationToken = createActivationToken(user);

  const activationCode = activationToken.activationCode;


  // // Add URL 
  const url = `${process.env.FRONTEND_URL}/user/validate?email=${email}`;

  // // Send URL and OTP to the email
  const message = `Your OTP is :- \n\n${activationCode}\n\n Please click on the link below to verify your email. The link will expire in 15 minutes. \n\n${url}\n\n If you have not requested this email, then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Nelami Website OTP Confirmation",
      message,
    });

  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }

  res.status(201).json({
    success: true,
    message: `Please check your email: ${user.email} to activate your account`,
    activationToken: activationToken.token,
  });

});



// OTP Validation
exports.OTPValidation = catchAsyncErrors(async (req, res, next) => {

  const { email, otp, token } = req.body;

  if (!email || !otp) {
    return next(new ErrorHandler("Please enter Email & OTP both", 400));
  }

  if (!token) {
    return next(new ErrorHandler("Something went wrong while activating your account. Please try again.", 400));
  }

  const newUser = jwt.verify(token, process.env.ACTIVATION_SECRET)

  if (!newUser) {
    return next(new ErrorHandler("Invalid Token or Token has been expired", 400));
  }

  if (newUser.activationCode !== otp) {
    return next(new ErrorHandler("Invalid activation code", 400));
  }

  const user = newUser.user;

  // check if email already exists
  const emailExists = await User.findOne({ email });

  if (emailExists) {
    return next(new ErrorHandler("Email is already registered", 400));
  }

  // create user
  const createdUser = await User.create(user);

  sendToken(createdUser, 200, res);
});




// LOGIN USER
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password, person } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter Email & Password both", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  
  if (!user) {
    return next(new ErrorHandler("Incorrect Email or Password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Email or Password", 400));
  }

  if (person && user.role !== person) {
    return next(new ErrorHandler("Only Admin Can Login Here", 401));
  }

  

  sendToken(user, 200, res);
});






// Logout User
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
});





//Forgot Password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User Not Found", 404));
  }

  // Get Reset Password Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/user/password/reset/${resetToken}`;

  const message = `Your password reset token is :- \n\n${resetPasswordUrl}\n\n If you have not requested this email, then please ignore it`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Nelami Website Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});






// Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // creating token hash
  const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Reset Password Token is invalid or has been expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not password", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});






// Get User Details (Dashboard)
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user,
  });
});

// Get Seller Details
exports.getSellerDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("-wishlist");

  //Getting all products of the seller
  const products = await Product.find({ user: req.params.id });


  res.status(200).json({
    success: true,
    user,
    products,
  });
});





// update User password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 400));
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("password does not match", 400));
  }

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});



// update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const { name, address, phoneNo, city, store, aboutInfo } = req.body;
  // console.log(req.body);
  if (!name || !address || !phoneNo || !city) {
    return next(new ErrorHandler("Please Fill All Required Fields", 400));
  }
  let newUserData = {};

  if (req.user.role === "buyer") {
    newUserData = {
      name,
      address,
      phoneNo,
      city,
      aboutInfo,
    };
  } else if (req.user.role === "seller") {
    newUserData = {
      name,
      address,
      phoneNo,
      city,
      store,
      aboutInfo,
    };
  }

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinaryy.v2.uploader.destroy(imageId);

    const myCloud = await cloudinaryy.v2.uploader.upload(
      req.body.avatar,
      {
        upload_preset: "ml_default",
        width: 300,
        height: 300,
        crop: "scale",
      },
      (err, result) => {
        console.log(err);
      }
    );

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});




// Get all users(admin)
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ role: { $ne: "admin" } }).sort({ createdAt: -1 });
  const totalUsers = await User.countDocuments();

  res.status(200).json({
    success: true,
    totalUsers,
    users,
  });
});




// Get single user
exports.getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`));
  }

  res.status(200).json({
    success: true,
    user,
  });
});



//Add Product To Wishlist
exports.addProductToWishlist = catchAsyncErrors(async (req, res, next) => {
  if (!req.user.id) {
    return next(new ErrorHandler('Please Login to Add Items to Wishlist', 401));
  }
  const user = await User.findById(req.user.id);
  
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }
  
  const { productId } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler(`Product does not exist with Id: ${productId}`, 404));
  }

  const index = user.wishlist.indexOf(productId);
  if (index !== -1) {
    user.wishlist.splice(index, 1);
    await user.save();
    res.status(200).json({
      success: true,
      message: "Product removed from Wishlist",
    });
  } else {
    user.wishlist.push(productId);
    await user.save();
    res.status(201).json({
      success: true,
      message: "Product added to Wishlist",
    });
  }
});


//Get Wishlist Items
exports.getWishlistItems = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler(`Please Login to View Wishlist`));
  }

  const products = await Product.find({ _id: { $in: user.wishlist } }).populate(
    "title images.featuredImg price category _id");

  res.status(200).json({
    success: true,
    products,
  });
}
);


//Upgrade User Package
exports.upgradeUserPackage = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new ErrorHandler(`Please Login to Upgrade Package`));
  }

  const newPlan = req.body.userPlan;

  user.userPackage = newPlan;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Package is upgraded",
  });

})





// Delete User --Admin
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHandler(`User does not exist with Id: ${req.params.id}`, 400));
  }

  //Removing from Conversations Model
  const conversations = await Conversation.find({ members: { $in: req.params.id } });
  if (conversations.length > 0) {
    conversations.forEach(async (conversation) => {
      await conversation.remove();
    }
    );
  }

  //remove from product model
  const products = await Product.find({ user: req.params.id });
  if (products.length > 0) {
    products.forEach(async (product) => {
      console.log(product)


      //Removing all bids of the product
      const bidDocument = await Bid.findOne({ bidItem: product._id });
      if (bidDocument) {
        await bidDocument.remove();
      }


      if (product?.images?.featuredImg) {
        await cloudinaryy.v2.uploader.destroy(product?.images?.featuredImg?.public_id);
      }
      if (product?.images?.imageOne) {
        await cloudinaryy.v2.uploader.destroy(product?.images?.imageOne?.public_id);
      }
      if (product?.images?.imageTwo) {
        await cloudinaryy.v2.uploader.destroy(product?.images?.imageTwo?.public_id);
      }
      if (product?.images?.imageThree) {
        await cloudinaryy.v2.uploader.destroy(product?.images?.imageThree?.public_id);
      }
      await product.remove();
    }
    );
  }



  // const imageId = user.avatar.public_id;

  // await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});
