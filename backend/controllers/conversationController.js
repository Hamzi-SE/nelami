const Conversation = require('../models/conversationModel');

exports.createConversation = async (req, res, next) => {
    const { senderId, receiverId } = req.body;

    if (senderId === receiverId) {
        res.status(400).json({
            message: "You can't send message to yourself"
        });
        return;
    }

    const presentConversation = await Conversation.findOne({
        members: { $eq: [senderId, receiverId] }
    });

    if (presentConversation) {
        res.status(200).json({
            message: "Conversation already exists",
            conversation: presentConversation,
        });
        return;
    }
    const conversation = new Conversation({
        members: [senderId, receiverId],
    });
    try {


        const savedConversation = await conversation.save();
        res.status(201).json({
            message: "Conversation created successfully",
            savedConversation,
        });
    } catch (err) {
        res.status(500).json({
            message: err.stack
        });
    }

}




exports.getUserConversation = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const conversations = await Conversation.find({
            members: { $in: [req.params.userId] }
        }).sort({ lastMessage: -1 });

        res.status(200).json({
            message: "Conversations fetched successfully",
            conversations,
            userId,
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
}


