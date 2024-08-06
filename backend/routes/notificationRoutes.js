const express = require('express')

const router = express.Router()

const { createNotification, getNotifications, markAsRead } = require('../controllers/notificationController')
const { isAuthenticatedUser } = require('../middleware/auth')

router.route('/notification/new').post(createNotification)
router.route('/notification/all').get(isAuthenticatedUser, getNotifications)
router.route('/notification/mark-as-read').put(isAuthenticatedUser, markAsRead)

module.exports = router
