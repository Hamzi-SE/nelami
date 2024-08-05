const { cloudinary } = require('./cloudinary')
const ErrorHandler = require('./errorHandler')

const uploadImagetoCloudinary = async (image) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(image, {
      upload_preset: 'bdwebproducts',
      format: 'webp',
      quality: 70,
    })
    return uploadedResponse
  } catch (err) {
    return next(new ErrorHandler(`Error uploading image: ${err?.message}`, 500))
  }
}

module.exports = uploadImagetoCloudinary
