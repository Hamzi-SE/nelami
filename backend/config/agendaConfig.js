const Agenda = require('agenda')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Notification = require('../models/notificationModel')
const Bid = require('../models/bidModel')
const dotenv = require('dotenv')
const moment = require('moment')
const sendEmail = require('../utils/sendEmail')
const eventEmitter = require('../utils/eventEmitter')

dotenv.config({ path: './config/config.env' })

const mongoConnectionString = process.env.DB_URI

const agenda = new Agenda({ db: { address: mongoConnectionString } })

agenda.define('expire and notify winner', async (job) => {
  const { productId } = job.attrs.data
  const product = await Product.findById(productId).populate({
    path: 'user',
    select: 'name email avatar.url',
  })
  if (moment().isAfter(moment(product.endDate).utc())) {
    product.bidStatus = 'Expired'
    await product.save()
    console.log(`Expired product: ${product.id}`)

    const bidProduct = await Bid.findOne({ bidItem: product._id })

    // Check if there are any bidders
    if (!bidProduct || bidProduct?.bidders?.length === 0) {
      console.log(`No bidders found for product: ${product.title}`)
      return // Exit if no bidders
    }

    const highestBid = bidProduct.bidders.reduce((prev, current) => (prev.price > current.price ? prev : current), 0)
    const highestBidUserId = String(highestBid.user)
    const highestBidUser = await User.findById(highestBidUserId)

    const emailData = {
      user: { name: highestBidUser.name },
      product: {
        title: product.title,
        _id: product._id,
        sellerName: product.user.name,
        sellerEmail: product.user.email,
        sellerAvatar: product.user.avatar.url,
      },
      frontendUrl: process.env.FRONTEND_URL,
    }

    // Send notification
    const notification = new Notification({
      userId: highestBidUser._id,
      message: `Congratulations! You have won the auction for ${product.title}.`,
      link: `/product/${product._id}`,
    })
    await notification.save()
    eventEmitter.emit('notificationCreated', notification)

    try {
      await sendEmail({
        email: highestBidUser.email,
        subject: 'Congratulations! You have won an auction',
        template: 'auction-won-mail',
        data: emailData,
      })
    } catch (err) {
      console.log('Error in sending Email:', err)
    }
  }
})

module.exports = agenda
