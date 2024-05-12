const express = require("express");
const router = express.Router();
const { createMessage, getAllMessages, sendMailToAdmin } = require("../controllers/messageController");


router.route("/message/new").post(createMessage);

router.route("/messages/:conversationId").get(getAllMessages);

router.route("/message/toAdmin").post(sendMailToAdmin);


module.exports = router;