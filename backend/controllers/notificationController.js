const Notification = require('../models/notificationModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

exports.createNotification = catchAsyncErrors(async (req, res, next) => {
  const { userId, message, link } = req.body
  const notification = new Notification({
    userId,
    message,
    link,
  })
  await notification.save()

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
  const notification = await Notification.findById(req.params.id)

  if (!notification) {
    return next(new ErrorHandler('Notification not found', 404))
  }

  notification.read = true

  await notification.save()

  res.status(200).json({
    success: true,
    notification,
  })
})
