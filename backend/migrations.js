const User = require('./models/userModel') // Adjust the path as needed
const connectDatabase = require('./config/database')
const dotenv = require('dotenv')
dotenv.config({ path: 'config/config.env' })

// Connect to MongoDB
connectDatabase()

// Update all users to add the `paymentDetails` field
const updateUsers = async () => {
  try {
    await User.updateMany(
      { paymentDetails: { $exists: false } }, // Only update documents that don't have `paymentDetails`
      { $set: { paymentDetails: [] } } // Initialize `paymentDetails` as an empty array
    )

    console.log('Users updated successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error updating users:', error)
    process.exit(1)
  }
}

updateUsers()
