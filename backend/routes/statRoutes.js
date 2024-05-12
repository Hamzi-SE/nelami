const express = require("express");
const { adminStats, userStats } = require("../controllers/statsController");
const { isAuthenticatedUser, authorizeRole } = require("../middleware/auth");

const router = express.Router();

router.route("/adminStats").get(isAuthenticatedUser, authorizeRole("admin"), adminStats);
router.route("/userStats").get(isAuthenticatedUser, userStats);

module.exports = router;

