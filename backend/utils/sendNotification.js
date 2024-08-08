const Notification = require('../models/notificationModel')
const eventEmitter = require('./eventEmitter')

const sendNotification = async ({ userId, message, link }) => {
  const notification = new Notification({
    userId,
    message,
    link,
  })
  await notification.save()
  eventEmitter.emit('notificationCreated', notification)
}

module.exports = sendNotification
