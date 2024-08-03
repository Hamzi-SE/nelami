const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const dotenv = require('dotenv')
const Data = require('../models/dataModel')
const User = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler')
dotenv.config({ path: 'config/config.env' })
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

// Constants for package IDs
const GOLD_PACKAGE_ID = 2
const PLATINUM_PACKAGE_ID = 3
// DB 'data' document ID
const DATA_ID = '62ea446ef91380cf34601403'

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.body.paymentData

  // Validate the package ID
  if (![GOLD_PACKAGE_ID, PLATINUM_PACKAGE_ID].includes(id)) {
    return next(new ErrorHandler('Invalid package selection', 400))
  }

  let packagePrice = 0
  let packageName = ''

  const user = await User.findById(req.user.id)
  if (!user) {
    return next(new ErrorHandler('User not found', 404))
  }

  const plans = {
    Free: 0,
    Gold: 1,
    Platinum: 2,
  }

  // Fetch data for packages from the DB
  const data = await Data.findById(DATA_ID)
  if (!data) {
    return next(new ErrorHandler('Data not found', 404))
  }

  // Map package IDs to actual packages
  const packageMapping = {
    [GOLD_PACKAGE_ID]: data.packages[1],
    [PLATINUM_PACKAGE_ID]: data.packages[2],
  }

  const selectedPackage = packageMapping[id]

  if (!selectedPackage) {
    return next(new ErrorHandler('Invalid package selection', 400))
  }

  packagePrice = selectedPackage.price * 100
  packageName = selectedPackage.name

  // Prevent downgrading or selecting the same package
  if (plans[user.userPackage] >= plans[packageName]) {
    return next(
      new ErrorHandler(`You already have ${user.userPackage} package`, 400)
    )
  }

  try {
    // Create Stripe payment intent
    const myPayment = await stripe.paymentIntents.create({
      amount: packagePrice,
      currency: 'pkr',
      metadata: {
        company: 'Nelami',
        package: packageName,
      },
    })

    res
      .status(200)
      .json({ success: true, client_secret: myPayment.client_secret })
  } catch (error) {
    return next(
      new ErrorHandler(`Payment processing failed: ${error.message}`, 500)
    )
  }
})

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY })
})
