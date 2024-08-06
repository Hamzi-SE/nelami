const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const dotenv = require('dotenv')
const Data = require('../models/dataModel')
const User = require('../models/userModel')
const Notification = require('../models/notificationModel')
const ErrorHandler = require('../utils/errorHandler')
const eventEmitter = require('../utils/eventEmitter')
dotenv.config({ path: 'config/config.env' })
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const endpointSecret =
  process.env.NODE_ENV === 'production' ? process.env.STRIPE_WEBHOOK_SECRET_PROD : process.env.STRIPE_WEBHOOK_SECRET_DEV

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
    return next(new ErrorHandler(`You already have ${user.userPackage} package`, 400))
  }

  try {
    // Search for an existing customer by email
    const customers = await stripe.customers.list({
      email: req.user.email,
      limit: 1, // Since we're only looking for one customer
    })

    let customer = customers.data[0]

    if (!customer) {
      customer = await stripe.customers.create({
        email: req.user.email,
        name: req.user.name,
        description: `Payment for ${packageName} plan`,
        metadata: {
          userId: req.user.id,
          package: packageName,
          price: packagePrice,
          currency: 'pkr',
        },
      })
    }

    const line_items = [
      {
        price_data: {
          currency: 'pkr',
          product_data: {
            name: packageName,
            description: `Payment for ${packageName}`,
            images: [`https://i.postimg.cc/YCKytpK3/Nelami-Logo.png`],
            metadata: {
              id: id,
              userId: req.user.id,
              package: packageName,
              price: packagePrice,
              currency: 'pkr',
            },
          },
          unit_amount: packagePrice,
        },
        quantity: 1,
      },
    ]

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      customer: customer.id,
      success_url: `${process.env.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment-fail`,
      metadata: { userId: req.user.id, package: packageName },
    })
    res.status(200).json({ success: true, sessionUrl: session.url })
  } catch (error) {
    return next(new ErrorHandler(`Payment processing failed: ${error.message}`, 500))
  }
})

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY })
})

exports.stripeWebhook = catchAsyncErrors(async (req, res, next) => {
  const sig = req.headers['stripe-signature']

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`)
    return
  }

  if (event.type === 'checkout.session.completed') {
    const checkoutSessionCompleted = event.data.object

    const userId = checkoutSessionCompleted.metadata.userId
    const packageName = checkoutSessionCompleted.metadata.package
    const packageId = checkoutSessionCompleted.metadata.id
    const price = checkoutSessionCompleted.amount_total

    const user = await User.findById(userId)
    if (!user) {
      return next(new ErrorHandler('User not found', 404))
    }
    user.userPackage = packageName
    user.packageId = packageId

    const newPayment = {
      sessionId: checkoutSessionCompleted.id,
      customerId: checkoutSessionCompleted.customer,
      paymentStatus: 'paid',
      paymentDate: Date.now(),
      price: price / 100,
      paymentId: checkoutSessionCompleted.payment_intent,
    }

    user.paymentDetails.push(newPayment)

    await user.save()

    const notification = new Notification({
      userId: user._id,
      message: `Congratulations! Your package has been upgraded to ${packageName}.`,
    })

    await notification.save()

    eventEmitter.emit('notificationCreated', notification)

    const data = await Data.findById(DATA_ID)
    if (!data) {
      return next(new ErrorHandler('Data not found', 404))
    }
    data.totalRevenue += price / 100
    await data.save()
  }

  // Return a 200 response to acknowledge receipt of the event
  res.status(200).json({ success: true })
})

exports.getSession = catchAsyncErrors(async (req, res, next) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id)

    res.status(200).json({
      success: true,
      session,
    })
  } catch (error) {
    return next(new ErrorHandler(`Invalid session ID`, 500))
  }
})
