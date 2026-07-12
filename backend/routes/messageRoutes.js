const express = require('express')
const router = express.Router()
const { createMessage, getAllMessages, sendMailToAdmin } = require('../controllers/messageController')
const { isAuthenticatedUser } = require('../middleware/auth')

router.route('/message/new').post(isAuthenticatedUser, createMessage)

router.route('/messages/:conversationId').get(isAuthenticatedUser, getAllMessages)

router.route('/message/toAdmin').post(sendMailToAdmin)

module.exports = router
