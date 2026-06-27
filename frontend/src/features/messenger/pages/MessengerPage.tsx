import { useSocket } from '@/hooks/useSocket'
import customFetch from '@/lib/api'
import MetaData from '@/lib/MetaData'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { Loader2, MessageCircle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ChatWindow from '../components/ChatWindow'
import ConversationList from '../components/ConversationList'

interface Friend {
  _id: string
  name: string
  avatar?: { url: string }
  lastActive?: string
}

interface Conversation {
  _id: string
  members: string[]
  lastMessage?: string
  lastMessageSender?: string
  updatedAt: string
}

const MessengerPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const socket = useSocket()
  const { user, loading: userLoading, isAuthenticated } = useAppSelector((state) => state.user)
  const { conversations, loading } = useAppSelector((state) => state.conversations)

  const [currentChat, setCurrentChat] = useState<Conversation | null>(null)
  const [friendsData, setFriendsData] = useState<Record<string, Friend>>({})
  const [onlineUsers, setOnlineUsers] = useState<string[]>([])
  const [typingStatuses, setTypingStatuses] = useState<Record<string, boolean>>({})
  const [dataLoading, setDataLoading] = useState(true)

  // Fetch conversations
  useEffect(() => {
    if (!user?._id) return

    const fetchConversations = async () => {
      setDataLoading(true)
      dispatch({ type: 'GET_ALL_CONVERSATIONS_REQUEST' })
      try {
        const res = await customFetch(`/api/v1/conversations/${user._id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()

        if (res.status === 200) {
          dispatch({ type: 'GET_ALL_CONVERSATIONS_SUCCESS', payload: data.conversations })

          // Fetch friend data for each conversation
          const avatars: Record<string, string> = {}
          const friends: Record<string, Friend> = {}
          const uniqueFriendIds = new Set<string>()

          data.conversations.forEach((c: Conversation) => {
            const friendId = c.members.find((m) => m !== user._id)
            if (friendId) uniqueFriendIds.add(friendId)
          })

          await Promise.all(
            Array.from(uniqueFriendIds).map(async (friendId) => {
              try {
                const res = await customFetch(`/api/v1/user/${friendId}`, {
                  method: 'GET',
                  headers: { 'Content-Type': 'application/json' },
                })
                const friendData = await res.json()
                if (res.status === 200) {
                  avatars[friendId] = friendData.user?.avatar?.url
                  friends[friendId] = friendData.user
                }
              } catch {
                // ignore individual fetch errors
              }
            })
          )

          setFriendsData(friends)
          dispatch({ type: 'SET_USER_AVATARS', payload: { ...avatars, [user._id]: user.avatar?.url } })
        } else {
          dispatch({ type: 'GET_ALL_CONVERSATIONS_FAIL', payload: data.message })
        }
      } catch (error) {
        dispatch({ type: 'GET_ALL_CONVERSATIONS_FAIL', payload: 'Something went wrong' })
      } finally {
        setDataLoading(false)
      }
    }
    fetchConversations()
  }, [user?._id, dispatch, user?.avatar?.url])

  // Socket events
  useEffect(() => {
    if (!socket || !user?._id) return

    socket.emit('addUser', user._id)

    const handleGetUsers = (users: any[]) => {
      setOnlineUsers(users.map((u) => u.userId))
    }

    const handleUpdateLastActive = ({ userId, lastActive }: { userId: string; lastActive: string }) => {
      setFriendsData((prev) => {
        const updated = { ...prev }
        if (updated[userId]) {
          updated[userId] = { ...updated[userId], lastActive }
        }
        return updated
      })
    }

    socket.on('getUsers', handleGetUsers)
    socket.on('updateLastActive', handleUpdateLastActive)
    return () => {
      socket.off('getUsers', handleGetUsers)
      socket.off('updateLastActive', handleUpdateLastActive)
    }
  }, [socket, user?._id])

  // Listen for typing events — updates sidebar "typing..." indicator
  useEffect(() => {
    if (!socket) return

    const handleTyping = ({ conversationId, isTyping }: { conversationId: string; isTyping: boolean }) => {
      setTypingStatuses((prev) => ({
        ...prev,
        [conversationId]: isTyping,
      }))
    }

    socket.on('isTyping', handleTyping)
    return () => {
      socket.off('isTyping', handleTyping)
    }
  }, [socket])

  // Listen for conversation last message updates
  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (data: any) => {
      dispatch({
        type: 'UPDATE_CONVERSATION_LAST_MESSAGE',
        payload: {
          conversationId: data.conversationId,
          lastMessage: data.text,
          lastMessageSender: data.senderId,
        },
      })
    }

    socket.on('getMessage', handleNewMessage)
    return () => {
      socket.off('getMessage', handleNewMessage)
    }
  }, [socket, dispatch])

  const handleSelectConversation = useCallback((conversation: Conversation) => {
    setCurrentChat(conversation)
  }, [])

  const handleBack = useCallback(() => {
    setCurrentChat(null)
  }, [])

  if (userLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!isAuthenticated) {
    toast.error('Login to access messenger')
    navigate('/login', { replace: true })
    return null
  }

  const friend = currentChat
    ? (() => {
        const friendId = currentChat.members.find((m) => m !== user?._id)
        return friendId ? friendsData[friendId] || null : null
      })()
    : null

  return (
    <>
      <MetaData title="Messenger - Nelami" />
      <div className="bg-neutral-50 min-h-[calc(100vh-64px)]">
        <div className="max-w-6xl mx-auto p-4 lg:p-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden h-[calc(100vh-120px)] flex">
            {/* Conversation List */}
            <div
              className={`w-full md:w-80 lg:w-96 border-r border-neutral-200 shrink-0 ${
                currentChat ? 'hidden md:block' : 'block'
              }`}
            >
              <div className="p-4 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary-500" />
                  <h2 className="text-lg font-semibold text-neutral-900">Messages</h2>
                </div>
              </div>
              <div className="h-[calc(100%-65px)]">
                <ConversationList
                  conversations={conversations || []}
                  friendsData={friendsData}
                  currentUserId={user?._id || ''}
                  currentChatId={currentChat?._id || null}
                  onlineUsers={onlineUsers}
                  typingStatuses={typingStatuses}
                  loading={loading || dataLoading}
                  onSelectConversation={handleSelectConversation}
                />
              </div>
            </div>

            {/* Chat Window */}
            <div className={`flex-1 ${currentChat ? 'block' : 'hidden md:flex md:items-center md:justify-center'}`}>
              {currentChat ? (
                <ChatWindow
                  conversation={currentChat}
                  friend={friend}
                  onlineUsers={onlineUsers}
                  typingStatuses={typingStatuses}
                  onBack={handleBack}
                />
              ) : (
                <div className="text-center p-6 hidden md:block">
                  <MessageCircle className="h-16 w-16 text-neutral-200 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-neutral-900 mb-2">Your Messages</h3>
                  <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                    Select a conversation to start chatting with buyers and sellers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default MessengerPage
