const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const dotenv = require("dotenv");
const Data = require("../models/dataModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
dotenv.config({ path: "config/config.env" });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.body.paymentData
    let packagePrice = 0;
    let packageName = "";

    const user = await User.findById(req.user.id);

    const plans = {
        "Free": 0,
        "Gold": 1,
        "Platinum": 2,
    }

    const data = await Data.findById("62ea446ef91380cf34601403");

    if (id === 2) {
        packagePrice = data.packages[1].price * 100;
        packageName = data.packages[1].name;
        if (plans[user.userPackage] > plans[packageName]) {
            return next(new ErrorHandler(`You can't downgrade to ${packageName} Package`, 400));
        }
    } else if (id === 3) {
        packagePrice = data.packages[2].price * 100;
        packageName = data.packages[2].name;
        if (plans[user.userPackage] > plans[packageName]) {
            return next(new ErrorHandler(`You can't downgrade to ${packageName} Package`, 400));
        }
    }

    const myPayment = await stripe.paymentIntents.create({
        amount: packagePrice,
        currency: "pkr",
        metadata: {
            company: "Nelami",
            package: packageName,
        },
    });

    res.status(200).json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {

    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});