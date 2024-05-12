const express = require("express");
const { newBid, singleProductBids, getUserBids } = require("../controllers/bidController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/bid/product/new/:id").post(isAuthenticatedUser, authorizeRole("buyer"), newBid);
router.route("/bid/product/:id").get(singleProductBids);
router.route("/bids/user").get(isAuthenticatedUser, authorizeRole("buyer"), getUserBids);

module.exports = router;
