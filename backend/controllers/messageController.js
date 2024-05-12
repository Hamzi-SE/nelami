const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const sendEmail = require("../utils/sendEmail");

// Add 
exports.createMessage = async (req, res, next) => {
    const messageObj = new Message(req.body);

    try {
        const savedMessage = await messageObj.save();
        if (savedMessage) {
            const { conversationId } = req.body;
            const conversation = await Conversation.findById(conversationId);
            if (conversation) {
                conversation.lastMessage = savedMessage.createdAt;
                await conversation.save();
            }
        }
        res.status(201).json({
            message: "Message created successfully",
            savedMessage,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}


// Get all messages
exports.getAllMessages = async (req, res, next) => {
    try {
        const messages = await Message.find({
            conversationId: req.params.conversationId,
        });

        res.status(200).json({
            message: "Messages fetched successfully",
            messages,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}



//Send Mail to Admin (Contact Page)
exports.sendMailToAdmin = async (req, res, next) => {
    const { name, email, message } = req.body;
    const mailOptions = {
        email: process.env.SMTP_MAIL,
        subject: "Query from " + name,
        message: message + " \n- From: " + email
    }
    try {
        await sendEmail(mailOptions);
        res.status(200).json({
            message: "Mail sent successfully"
        });
    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}
