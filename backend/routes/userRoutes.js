const express = require("express");
const { registerUser, OTPValidation, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword,
    updateProfile, getAllUser, getSingleUser, deleteUser, addProductToWishlist, getWishlistItems, getSellerDetails, upgradeUserPackage } = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/OTPValidation").post(OTPValidation);

router.route("/login").post(loginUser);

router.route("/logout").get(logout);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/me").get(isAuthenticatedUser, getUserDetails);
router.route("/seller/:id").get(getSellerDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router.route("/addToWishlist").post(isAuthenticatedUser, addProductToWishlist);
router.route("/getWishlist").get(isAuthenticatedUser, getWishlistItems);

router.route("/upgradePlan").put(isAuthenticatedUser, upgradeUserPackage);

router.route("/admin/users").get(isAuthenticatedUser, authorizeRole("admin"), getAllUser);

router.route("/user/:id").get(isAuthenticatedUser, getSingleUser);
// .put(isAuthenticatedUser, authorizeRole("admin"), updateUserRole)

router.route("/admin/user/:id").delete(isAuthenticatedUser, authorizeRole("admin"), deleteUser);

module.exports = router;
