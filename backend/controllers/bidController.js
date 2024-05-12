const Bid = require("../models/bidModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// Create new Bid
exports.newBid = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role == "Seller") {
    return next(new ErrorHandler(`Role: ${req.user.role} can not bid on this product`, 401));
  }

  const user = req.user._id;
  const product = req.params.id;
  const { price } = req.body;

  if (price > 999999999) {
    return next(new ErrorHandler(`Price is way too high`, 401));
  }


  //If bid product is already present in schmea, it will only push the new Bid of user
  const bidDocument = await Bid.findOne({ bidItem: product });
  if (bidDocument) {

    //Removing the old bid of the user if found
    const alreadyPresentBid = await Bid.findOneAndUpdate({
      bidItem: product, user
    }, {
      $pull: {
        bidders: { user }
      }
    }, {
      new: true,

    }
    )
    alreadyPresentBid.save();

    //Pushing the new bid of the user
    const newPresentBid = await Bid.findOneAndUpdate({
      bidItem: product, user
    }, {
      $push: {
        bidders: { user, price }
      }
    }, {
      new: true,

    }
    )
    newPresentBid.save();

    // const newBid = await bidDocument.createBid(user, price);
    // console.log("newBid ", newBid)
    await bidDocument.save();
    res.status(201).json({
      success: true,
      newPresentBid
    });
    return;
  }

  const bid = await Bid.create({
    bidItem: product,
    bidders: {
      user,
      price,
    },
  });

  res.status(201).json({
    success: true,
    bid,
  });
});



//Get Single Product Bids
exports.singleProductBids = catchAsyncErrors(async (req, res, next) => {
  const bids = await Bid.find({ bidItem: req.params.id }).populate({
    path: "bidders.user", select: "_id name email avatar phoneNo"
  });
  res.status(200).json({
    success: true,
    bids
  })
})


//Get User Bids
exports.getUserBids = catchAsyncErrors(async (req, res, next) => {
  if (req.user.role == "Seller") {
    return next(new ErrorHandler(`Role: ${req.user.role} can not bid`, 401));
  }

  const user = req.user._id;

  const bids = await Bid.find({ "bidders.user": user }).populate({
    path: "bidItem", select: "title price images"
  });

  res.status(200).json({
    success: true,
    user,
    bids
  })
})

