const Bid = require("../models/bidModel");
const Product = require("../models/productModel");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");


// Get Stats -- Admin
exports.adminStats = catchAsyncErrors(async (req, res, next) => {
    const totalUsers = await User.find({ role: { $ne: "admin" } }).countDocuments();
    const totalBuyers = await User.find({ role: "buyer" }).countDocuments();
    const totalSellers = await User.find({ role: "seller" }).countDocuments();
    const activeBids = await Product.find({ status: "Approved", bidStatus: "Live" }).countDocuments();
    const endedBids = await Product.find({ status: "Approved", bidStatus: "Expired" }).countDocuments();
    const totalProducts = await Product.find({ status: "Approved" }).countDocuments();
    const totalVehicles = await Product.find({ status: "Approved", category: "Vehicles" }).countDocuments();
    const totalProperties = await Product.find({ status: "Approved", category: "Property" }).countDocuments();
    const totalMiscProducts = await Product.find({ status: "Approved", category: "MiscProducts" }).countDocuments();

    res.status(200).json({
        totalUsers,
        totalBuyers,
        totalSellers,
        activeBids,
        endedBids,
        totalProducts,
        totalVehicles,
        totalProperties,
        totalMiscProducts
    });
})


//Get Stats -- User
exports.userStats = catchAsyncErrors(async (req, res, next) => {
    const totalBids = await Bid.find({ "bidders.user": req.user.id }).countDocuments();
    const totalProducts = await Product.find({ user: req.user.id }).countDocuments();
    const totalEndedBids = await Product.find({ endDate: { $lt: Date.now() }, status: "Approved", user: req.user.id }).countDocuments();
    const totalOngoingBids = await Product.find({ endDate: { $gt: Date.now() }, status: "Approved", user: req.user.id }).countDocuments();
    const totalVehicles = await Product.find({ user: req.user.id, category: "Vehicles" }).countDocuments();
    const totalProperties = await Product.find({ user: req.user.id, category: "Property" }).countDocuments();
    const totalMiscProducts = await Product.find({ user: req.user.id, category: "MiscProducts" }).countDocuments();

    res.status(200).json({
        totalBids,
        totalProducts,
        totalEndedBids,
        totalOngoingBids,
        totalVehicles,
        totalProperties,
        totalMiscProducts
    });
})