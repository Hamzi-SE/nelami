// src/contexts/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useSelector } from 'react-redux'

// Create a context for the socket
const SocketContext = createContext()

// Provider component
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const { user, isAuthenticated, loading } = useSelector((state) => state.user)

  useEffect(() => {
    // Initialize the socket connection
    const socketInstance = io.connect(process.env.REACT_APP_SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
    })

    // Set the socket instance
    setSocket(socketInstance)

    socketInstance.on('connect', () => {
      if (isAuthenticated && !loading) {
        socketInstance.emit('addUser', user?._id)
      }
    })

    // Clean up on component unmount
    return () => {
      socketInstance.disconnect()
    }
  }, [isAuthenticated, loading, user?._id])

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  )
}

// Custom hook to use the socket
export const useSocket = () => {
  return useContext(SocketContext)
}
