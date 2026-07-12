const express = require('express')
const errorMiddleware = require('./middleware/error')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const ErrorHandler = require('./utils/errorHandler')
require('./utils/cloudinary')
const dotenv = require('dotenv')
dotenv.config({ path: 'config/config.env' })

const app = express()

// raw data is required for stripe webhook — only accept JSON with a valid signature
app.use('/api/v1/payment/stripe/webhook', express.raw({ type: 'application/json' }))
app.use(cookieParser())

// Image-uploading routes receive inline base64 images, so they get a larger
// body limit via route-specific parsers that run BEFORE the small global default
// (body-parser skips a request once its body is already parsed).
app.use('/api/v1/product/new', express.json({ limit: '50mb' }))
app.use('/api/v1/product/new', express.urlencoded({ extended: true, limit: '50mb' }))
app.use('/api/v1/me/update', express.json({ limit: '10mb' }))
app.use('/api/v1/me/update', express.urlencoded({ extended: true, limit: '10mb' }))

// Default JSON body limit kept small to blunt large-payload abuse.
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  })
)

// ROUTE IMPORTS
const user = require('./routes/userRoutes')
const product = require('./routes/productRoutes')
const bid = require('./routes/bidRoutes')
const conversations = require('./routes/conversationRoutes')
const messages = require('./routes/messageRoutes')
const data = require('./routes/dataRoutes')
const stats = require('./routes/statRoutes')
const payment = require('./routes/paymentRoutes')
const notification = require('./routes/notificationRoutes')
const initializeSocket = require('./utils/socket')

app.use('/api/v1', user)
app.use('/api/v1', product)
app.use('/api/v1', bid)
app.use('/api/v1', conversations)
app.use('/api/v1', messages)
app.use('/api/v1', data)
app.use('/api/v1', stats)
app.use('/api/v1', payment)
app.use('/api/v1', notification)

// testing api
app.get('/health', (req, res, next) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
  })
})

// unknown route handler
app.all('*', (req, res, next) => {
  const error = new ErrorHandler(`Route ${req.originalUrl} not found`, 404)
  next(error)
})

// MIDDLEWARE FOR ERROR
app.use(errorMiddleware)

initializeSocket(app)

module.exports = app
