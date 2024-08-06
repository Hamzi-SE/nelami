const express = require('express')
const { processPayment, sendStripeApiKey, stripeWebhook, getSession } = require('../controllers/paymentController')
const router = express.Router()
const { isAuthenticatedUser } = require('../middleware/auth')

router.route('/payment/process').post(isAuthenticatedUser, processPayment)

router.route('/stripeapikey').get(sendStripeApiKey)

router.route('/payment/stripe/webhook').post(stripeWebhook)

router.route('/payment/stripe/session').get(isAuthenticatedUser, getSession)

module.exports = router
