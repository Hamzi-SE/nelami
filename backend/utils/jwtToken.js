const jwt = require('jsonwebtoken')

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken()

  // options for cookie
  const options = {
    expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    token,
  })
}

// Sign only the email + activation code. The plaintext password is never
// embedded in the token (stored server-side in PendingUser).
const createActivationToken = ({ email, activationCode }) => {
  return jwt.sign({ email, activationCode }, process.env.ACTIVATION_SECRET, {
    expiresIn: '15m',
  })
}

module.exports = { sendToken, createActivationToken }
