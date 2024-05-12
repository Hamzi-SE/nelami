const express = require("express");
const { getData, addEntry, removeEntry, updatePackage } = require("../controllers/dataController");
const { authorizeRole, isAuthenticatedUser } = require("../middleware/auth");
const router = express.Router();

router.route("/getData/all").get(getData);
router.route("/data/newEntry").put(isAuthenticatedUser, authorizeRole("admin"), addEntry);
router.route("/data/removeEntry").delete(isAuthenticatedUser, authorizeRole("admin"), removeEntry);
router.route("/data/updatePackage").put(isAuthenticatedUser, authorizeRole("admin"), updatePackage);

module.exports = router;