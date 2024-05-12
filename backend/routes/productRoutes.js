const express = require("express");
const { getAllProducts, getUserAllProducts, createProduct, updateProduct, deleteProduct,
    getSingleProduct, getAllProductsAdmin, getApprovalProductsAdmin, approveProduct, getApprovalProductsSeller } = require("../controllers/productController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();


router.route("/products").get(getAllProducts);
router.route("/productsAdmin").get(isAuthenticatedUser, authorizeRole("admin"), getAllProductsAdmin);
router.route("/approvalProductsAdmin").get(isAuthenticatedUser, authorizeRole("admin"), getApprovalProductsAdmin);
router.route("/approveProduct/:id").put(isAuthenticatedUser, authorizeRole("admin"), approveProduct);
router.route("/getApprovalProducts").get(isAuthenticatedUser, authorizeRole("seller"), getApprovalProductsSeller);

router.route("/products/me/all").get(isAuthenticatedUser, authorizeRole("seller"), getUserAllProducts)

router.route("/product/new").post(isAuthenticatedUser, authorizeRole("seller"), createProduct);

router.route("/product/:id").put(isAuthenticatedUser, authorizeRole("admin", "seller"), updateProduct)
    .delete(isAuthenticatedUser, authorizeRole("admin", "seller"), deleteProduct);

router.route("/products/:id").get(getSingleProduct);

module.exports = router;
