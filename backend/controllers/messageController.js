const Conversation = require('../models/conversationModel')
const Message = require('../models/messageModel')
const sendEmail = require('../utils/sendEmail')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors')

// Add
exports.createMessage = catchAsyncErrors(async (req, res, next) => {
  const messageObj = new Message(req.body)

  try {
    const savedMessage = await messageObj.save()
    if (savedMessage) {
      const { conversationId } = req.body
      const conversation = await Conversation.findById(conversationId)
      if (conversation) {
        conversation.lastMessage = savedMessage.text
        conversation.lastMessageTime = savedMessage.createdAt
        conversation.lastMessageSender = savedMessage.sender
        await conversation.save()
      }
    }
    res.status(201).json({
      message: 'Message created successfully',
      savedMessage,
    })
  } catch (err) {
    return next(new ErrorHandler(err.message, 500))
  }
})

// Get all messages
exports.getAllMessages = catchAsyncErrors(async (req, res, next) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    })

    res.status(200).json({
      message: 'Messages fetched successfully',
      messages,
    })
  } catch (err) {
    return next(new ErrorHandler(err.message, 500))
  }
})

//Send Mail to Admin (Contact Page)
exports.sendMailToAdmin = catchAsyncErrors(async (req, res, next) => {
  const { name, email, message } = req.body

  const emailData = { name, email, message }
  try {
    await sendEmail({
      email: process.env.SMTP_MAIL,
      subject: 'Nelami query from ' + name,
      template: 'contact-mail',
      data: emailData,
    })
    res.status(200).json({
      message: 'Email sent successfully. We will get back to you soon.',
    })
  } catch (err) {
    return next(new ErrorHandler(err.message, 500))
  }
})
