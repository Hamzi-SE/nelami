const Conversation = require('../models/conversationModel')

exports.createConversation = async (req, res, next) => {
  const { senderId, receiverId } = req.body

  if (senderId === receiverId) {
    return res.status(400).json({
      message: "You can't send a message to yourself",
    })
  }

  const presentConversation = await Conversation.findOne({
    members: { $all: [senderId, receiverId] },
  })

  if (presentConversation) {
    return res.status(200).json({
      message: 'Conversation already exists',
      conversation: presentConversation,
    })
  }

  const conversation = new Conversation({
    members: [senderId, receiverId],
  })

  const savedConversation = await conversation.save()
  res.status(201).json({
    message: 'Conversation created successfully',
    savedConversation,
  })
}

exports.getUserConversation = async (req, res, next) => {
  const { userId } = req.params
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.params.userId] },
    }).sort({ lastMessageTime: -1 })

    res.status(200).json({
      message: 'Conversations fetched successfully',
      conversations,
      userId,
    })
  } catch (err) {
    res.status(500).json({
      message: err.message,
    })
  }
}
