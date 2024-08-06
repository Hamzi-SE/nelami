const { Server } = require('socket.io')
const { createServer } = require('http')
const User = require('../models/userModel')
const eventEmitter = require('./eventEmitter')

const initializeSocket = (app) => {
  const socketServer = createServer(app)

  const io = new Server(socketServer, {
    wssEngine: ['ws', 'wss'],
    transports: ['websocket', 'polling'],
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
    allowEIO3: true,
  })

  let users = []

  const addUser = async (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId })
    await User.findByIdAndUpdate(userId, { lastActive: Date.now() })
  }

  const removeUser = async (userId, socketId) => {
    let removedUserId = null
    const currentTime = Date.now()

    if (socketId) {
      const user = users.find((user) => user.socketId === socketId)
      if (user) {
        removedUserId = user.userId
        await User.findByIdAndUpdate(removedUserId, { lastActive: Date.now() })
      }
      users = users.filter((user) => user.socketId !== socketId)
    } else if (userId) {
      removedUserId = userId
      await User.findByIdAndUpdate(removedUserId, { lastActive: Date.now() })
      users = users.filter((user) => user.userId !== userId)
    }

    if (removedUserId) {
      io.emit('updateLastActive', {
        userId: removedUserId,
        lastActive: currentTime,
      })
    }
  }

  const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
  }

  eventEmitter.on('notificationCreated', (notification) => {
    const user = getUser(notification.userId.toString())
    if (user) {
      io.to(user.socketId).emit('getNotification', notification)
    }
  })

  io.on('connection', (socket) => {
    socket.on('addUser', async (userId) => {
      if (userId) {
        await addUser(userId, socket.id)
        io.emit('getUsers', users)
      }
    })

    socket.on('sendMessage', ({ senderId, receiverId, text, conversationId }) => {
      const user = getUser(receiverId)
      io.to(user?.socketId).emit('getMessage', {
        senderId,
        text,
        conversationId,
      })
    })

    socket.on('removeUserFromLiveUsers', async (userId) => {
      await removeUser(userId, null)
      io.emit('getUsers', users)
      // io.emit("removeUserFromLiveUsers", users)
    })

    socket.on('typing', ({ senderId, receiverId, isTyping, conversationId }) => {
      const user = getUser(receiverId)
      io.to(user?.socketId).emit('isTyping', {
        senderId,
        isTyping,
        conversationId,
      })
    })

    socket.on('disconnect', async () => {
      await removeUser(null, socket.id)
      io.emit('getUsers', users)
    })
  })

  socketServer.listen(8080, (err) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Socket Server is running on port: 8080...')
    }
  })

  return socketServer
}

module.exports = initializeSocket
