const express = require('express')
const {
  processPayment,
  sendStripeApiKey,
} = require('../controllers/paymentController')
const router = express.Router()
const { isAuthenticatedUser } = require('../middleware/auth')

router.route('/payment/process').post(isAuthenticatedUser, processPayment)

router.route('/stripeapikey').get(sendStripeApiKey)

module.exports = router
