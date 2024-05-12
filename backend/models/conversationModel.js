const mongoose = require("mongoose");

const ConversationSchema = new mongoose.Schema(
    {
        members: {
            type: Array,
        },
        lastMessage: {
            type: String,
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Conversation", ConversationSchema);