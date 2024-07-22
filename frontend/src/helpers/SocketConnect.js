import io from "socket.io-client";

// Socket Connection
export const socket = io.connect(process.env.REACT_APP_SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
});