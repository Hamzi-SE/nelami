const express = require("express");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const { createServer } = require("http");
const User = require("./models/userModel");
require("./utils/cloudinary");
const dotenv = require("dotenv");
dotenv.config({ path: "config/config.env" });

const app = express();
const socketServer = createServer(app);

app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
}));

// ROUTE IMPORTS
const user = require("./routes/userRoutes");
const product = require("./routes/productRoutes");
const bid = require("./routes/bidRoutes");
const conversations = require("./routes/conversationRoutes");
const messages = require("./routes/messageRoutes");
const data = require("./routes/dataRoutes");
const stats = require("./routes/statRoutes");
const payment = require("./routes/paymentRoutes");

app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", bid);
app.use("/api/v1", conversations);
app.use("/api/v1", messages);
app.use("/api/v1", data);
app.use("/api/v1", stats);
app.use("/api/v1", payment);

// MIDDLEWARE FOR ERROR
app.use(errorMiddleware);

// Socket.IO Configuration
const io = new Server(socketServer, { 
    wssEngine: ['ws', 'wss'],
    transports: ['websocket', 'polling'],
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    },
    allowEIO3: true,
});

let users = [];

const addUser = async (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId })
    await User.findByIdAndUpdate(userId, { lastActive: Date.now() });
}

const removeUser = async (userId, socketId) => {
    let removedUserId = null;
    const currentTime = Date.now();

    if (socketId) {
        const user = users.find(user => user.socketId === socketId);
        if (user) {
            removedUserId = user.userId;
            await User.findByIdAndUpdate(removedUserId, { lastActive: Date.now() });
        }
        users = users.filter(user => user.socketId !== socketId);

    } else if (userId) {
        removedUserId = userId;
        await User.findByIdAndUpdate(removedUserId, { lastActive: Date.now() });
        users = users.filter(user => user.userId !== userId);
    }

    if (removedUserId) {
        io.emit('updateLastActive', {
            userId: removedUserId,
            lastActive: currentTime
        });
    }
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}

io.on("connection", (socket) => {
    socket.on("addUser",async (userId) => {
        if (userId) {
            await addUser(userId, socket.id)
            io.emit("getUsers", users)
        }
    })

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
            senderId, text
        })
    })

    socket.on("removeUserFromLiveUsers",async (userId) => {
        await removeUser(userId, null);
        io.emit('getUsers', users);
        // io.emit("removeUserFromLiveUsers", users)
    })

    socket.on("disconnect", async () => {
        await removeUser(null, socket.id)
        io.emit("getUsers", users)
    })
})

socketServer.listen(8080, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("Socket Server is running on port: 8080...");
    }
})

module.exports = app;
