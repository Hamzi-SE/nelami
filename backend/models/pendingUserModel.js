const mongoose = require('mongoose')

// Holds a registration that has not yet been activated via OTP.
// The plaintext password lives here only transiently (TTL 15 min)
// instead of being embedded in a JWT returned to the client.
const pendingUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
    },
    role: {
      type: String,
      enum: ['buyer', 'seller'],
      default: 'buyer',
    },
    activationCode: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: '1h' },
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model('PendingUser', pendingUserSchema)
