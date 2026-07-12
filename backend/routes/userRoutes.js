const express = require('express')
const {
  registerUser,
  OTPValidation,
  loginUser,
  logout,
  forgotPassword,
  resetPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUser,
  getSingleUser,
  deleteUser,
  addProductToWishlist,
  getWishlistItems,
  getSellerDetails,
} = require('../controllers/userController')
const { isAuthenticatedUser, authorizeRole } = require('../middleware/auth')
const rateLimit = require('express-rate-limit')

const router = express.Router()

// Throttle authentication endpoints to blunt brute-force / abuse.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts, please try again later.' },
})

router.route('/register').post(authLimiter, registerUser)

router.route('/OTPValidation').post(authLimiter, OTPValidation)

router.route('/login').post(authLimiter, loginUser)

router.route('/logout').get(logout)

router.route('/password/forgot').post(authLimiter, forgotPassword)

router.route('/password/reset/:token').put(authLimiter, resetPassword)

router.route('/me').get(isAuthenticatedUser, getUserDetails)
router.route('/seller/:id').get(getSellerDetails)

router.route('/password/update').put(isAuthenticatedUser, updatePassword)

router.route('/me/update').put(isAuthenticatedUser, updateProfile)

router.route('/addToWishlist').post(isAuthenticatedUser, addProductToWishlist)
router.route('/getWishlist').get(isAuthenticatedUser, getWishlistItems)

router.route('/admin/users').get(isAuthenticatedUser, authorizeRole('admin'), getAllUser)

router.route('/user/:id').get(isAuthenticatedUser, getSingleUser)
// .put(isAuthenticatedUser, authorizeRole("admin"), updateUserRole)

router.route('/admin/user/:id').delete(isAuthenticatedUser, authorizeRole('admin'), deleteUser)

module.exports = router
