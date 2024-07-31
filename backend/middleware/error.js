const ErrorHandler = require('../utils/errorHandler')

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.message = err.message || 'Internal Server Error'

  if (err.name === 'CastError') {
    const message = `Resource Not Found. Invalid ${err.path}`
    err = new ErrorHandler(message, 400)
  }

  //Duplicate Error
  if (err.code == 11000) {
    const message = `${Object.keys(err.keyValue)} is already registered`
    err = new ErrorHandler(message, 400)
  }

  // Wrong JWT error
  if (err.name === 'JsonWebTokenError') {
    const message = `Json Web Token is invalid, Try again `
    err = new ErrorHandler(message, 400)
  }

  // JWT EXPIRE error
  if (err.name === 'TokenExpiredError') {
    const message = `Json Web Token is Expired, Try again `
    err = new ErrorHandler(message, 400)
  }

  // Handling Mongoose Validation Error
  if (err.name == 'ValidationError') {
    const missingFields = Object.keys(err.errors)
      .map((field) => `${field}`)
      .join(', ')
    const message = `Missing or invalid fields: ${missingFields}`
    err = new ErrorHandler(message, 400)
  }

  res.status(err.statusCode).json({
    success: false,
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    message: err.message,
  })
}
