const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  userPackage: {
    type: String,
    enum: ["Free", "Gold", "Platinum"],
  },
  name: {
    type: String,
    required: [true, "Please Enter Your Name"],
    maxLength: [30, "Name cannot exceed 30 characters"],
    minLength: [4, "Name should have more than 4 characters"],
  },
  email: {
    type: String,
    required: [true, "Please Enter Your Email"],
    unique: [true, "Email is already registered"],
    validate: [validator.isEmail, "Please Enter a valid Email"],
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, "Please Enter Your Password"],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },
  avatar: {
    public_id: {
      type: String,
      required: true,
      default: "skfjaldjflljalfjlajf",
    },
    url: {
      type: String,
      required: true,
      default: "https://i.postimg.cc/mD9SJc41/149071.png",
    },
  },
  role: {
    type: String,
    default: "buyer",
    enum: ["buyer", "seller", "admin"],
  },
  address: {
    type: String,
  },
  phoneNo: {
    type: String,
  },
  city: {
    type: String,
  },
  store: {
    type: String,
  },
  aboutInfo: {
    type: String,
  },
  productsPosted: {
    type: Number,
  },
  wishlist: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],

  otp: String,
  otpExpiresIn: Date,

  resetPasswordToken: String,
  resetPasswordExpire: Date,
},
  { timestamps: true }
);

// Create OTP
userSchema.methods.createOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000);

  this.otp = otp;
  this.otpExpiresIn = Date.now() + 15 * 60 * 1000;

  return otp;
};

// Hashing the Password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare Password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  //Hashing and adding reset Password token to userSchema
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  return resetToken;
};



module.exports = mongoose.model("User", userSchema);
