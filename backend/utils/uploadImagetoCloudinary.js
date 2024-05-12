const { cloudinary } = require("./cloudinary");



const uploadImagetoCloudinary = async (image) => {
    const uploadedResponse = await cloudinary.uploader.upload(
        image,
        {
            upload_preset: "bdwebproducts",
            format: "webp",
            quality: 70
        },
        (err, result) => {
            if (err) {
                return next(new ErrorHandler("Error uploading image", 500));
            }
            return result;
        }
    );

    return uploadedResponse;
}


module.exports = uploadImagetoCloudinary;