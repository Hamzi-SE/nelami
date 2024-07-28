const jwt = require('jsonwebtoken')

const sendToken = (user, statusCode, res) => {
  const token = user.getJWTToken()

  // options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    user,
    token,
  })
}

const createActivationToken = (user) => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString() // 4 digit number

  const token = jwt.sign(
    { user, activationCode },
    process.env.ACTIVATION_SECRET,
    {
      expiresIn: '15m',
    }
  )

  return { token, activationCode }
}

module.exports = { sendToken, createActivationToken }
