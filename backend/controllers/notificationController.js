const Notification = require('../models/notificationModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const eventEmitter = require('../utils/eventEmitter')

exports.createNotification = catchAsyncErrors(async (req, res, next) => {
  const { userId, message, link } = req.body
  const notification = new Notification({
    userId,
    message,
    link,
  })
  await notification.save()

  // Emitting an internal event after saving the notification
  eventEmitter.emit('notificationCreated', notification)

  res.status(201).json({
    success: true,
    notification,
  })
})

exports.getNotifications = catchAsyncErrors(async (req, res, next) => {
  const notifications = await Notification.find({ userId: req.user.id }).sort({
    createdAt: -1,
  })
  res.status(200).json({
    success: true,
    notifications,
  })
})

exports.markAsRead = catchAsyncErrors(async (req, res, next) => {
  const { notificationId } = req.body

  const notification = await Notification.findById(notificationId)

  if (!notification) {
    return next(new ErrorHandler('Notification not found', 404))
  }

  // check if this notification belongs to this user
  if (notification.userId.toString() !== req.user.id) {
    return next(new ErrorHandler('You are not authorized to mark this notification as read', 401))
  }

  notification.read = true

  await notification.save()

  res.status(200).json({
    success: true,
    notification,
  })
})
