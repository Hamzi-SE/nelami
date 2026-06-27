import { useAppSelector } from '@/store/typedHooks'
import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface SocketUser {
  _id: string
}

interface RootState {
  user: {
    user: SocketUser | null
    isAuthenticated: boolean
    loading: boolean
  }
}

const SocketContext = createContext<Socket | null>(null)

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const { user, isAuthenticated, loading } = useAppSelector((state: RootState) => state.user)

  useEffect(() => {
    if (!loading && isAuthenticated) {
      const socketInstance = io(process.env.REACT_APP_SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 2000,
      })

      setSocket(socketInstance)

      socketInstance.on('connect', () => {
        socketInstance.emit('addUser', user?._id)
      })

      return () => {
        socketInstance.disconnect()
      }
    }
  }, [isAuthenticated, loading, user?._id])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export const useSocket = () => {
  return useContext(SocketContext)
}
