const express = require("express");
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Server } = require("socket.io");
const { createServer } = require("http");
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

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) && users.push({ userId, socketId })
}

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find((user) => user.userId === userId)
}

io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`)

    socket.on("addUser", (userId) => {
        if (userId) {
            addUser(userId, socket.id)
            io.emit("getUsers", users)
        }
    })

    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
            senderId, text
        })
    })

    socket.on("disconnect", () => {
        console.log("User Disconnected")
        removeUser(socket.id)
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
