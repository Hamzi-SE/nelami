import EmptyState from '@/components/shared/EmptyState'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useSocket } from '@/hooks/useSocket'
import customFetch from '@/lib/api'
import { useAppDispatch, useAppSelector } from '@/store/typedHooks'
import { formatDistanceToNow } from 'date-fns'
import Picker from 'emoji-picker-react'
import { ArrowLeft, Loader2, MessageCircle, Send, Smile, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

interface Friend {
  _id: string
  name: string
  role?: string
  avatar?: { url: string }
  lastActive?: string
}

interface ChatWindowProps {
  conversation: any
  friend: Friend | null
  onlineUsers: string[]
  typingStatuses: Record<string, boolean>
  onBack: () => void
}

const ChatWindow = ({ conversation, friend, onlineUsers, typingStatuses, onBack }: ChatWindowProps) => {
  const dispatch = useAppDispatch()
  const socket = useSocket()
  const { user } = useAppSelector((state) => state.user)
  const { userAvatars } = useAppSelector((state) => state.conversations)

  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showEmoji, setShowEmoji] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const isTypingRef = useRef(false)

  const friendId = conversation?.members.find((m: string) => m !== user?._id)
  const isOnline = onlineUsers.includes(friendId)
  const isFriendTyping = typingStatuses[conversation?._id] || false

  // Reset typing ref when conversation changes
  useEffect(() => {
    isTypingRef.current = false
  }, [conversation?._id])

  // Fetch messages when conversation changes
  useEffect(() => {
    if (!conversation) return

    const fetchMessages = async () => {
      setLoading(true)
      dispatch({ type: 'GET_MESSAGES_REQUEST' })
      try {
        const res = await customFetch(`/api/v1/messages/${conversation._id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
        const data = await res.json()
        if (res.status === 200) {
          dispatch({ type: 'GET_MESSAGES_SUCCESS', payload: data.messages })
          setMessages(data.messages)
        } else {
          dispatch({ type: 'GET_MESSAGES_FAIL', payload: data.message })
          toast.error(data.message)
        }
      } catch (error) {
        dispatch({ type: 'GET_MESSAGES_FAIL', payload: 'Something went wrong' })
        toast.error('Failed to load messages')
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [conversation, dispatch])

  // Listen for incoming messages
  useEffect(() => {
    if (!socket || !conversation) return

    const handleNewMessage = (data: any) => {
      if (data.conversationId === conversation._id) {
        setMessages((prev) => [
          ...prev,
          {
            sender: data.senderId,
            text: data.text,
            createdAt: Date.now(),
            conversationId: data.conversationId,
          },
        ])
      }
    }

    socket.on('getMessage', handleNewMessage)
    return () => {
      socket.off('getMessage', handleNewMessage)
    }
  }, [socket, conversation])

  // Emit typing events — only on transitions (empty→typing or typing→empty)
  useEffect(() => {
    if (!socket || !conversation || !friendId) return

    if (!newMessage.trim()) {
      // Textarea cleared — emit "not typing" only if we were previously typing
      if (isTypingRef.current) {
        socket.emit('typing', {
          conversationId: conversation._id,
          senderId: user?._id,
          receiverId: friendId,
          isTyping: false,
        })
        isTypingRef.current = false
      }
      return
    }

    // User is typing — emit "typing" only once until they stop
    if (!isTypingRef.current) {
      socket.emit('typing', {
        conversationId: conversation._id,
        senderId: user?._id,
        receiverId: friendId,
        isTyping: true,
      })
      isTypingRef.current = true
    }
  }, [newMessage, socket, conversation, friendId, user?._id])

  // Scroll to bottom on new messages
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !conversation || sending) return

    setSending(true)

    const messageData = {
      sender: user?._id,
      conversationId: conversation._id,
      text: newMessage.trim(),
    }

    // Emit via socket
    socket?.emit('sendMessage', {
      senderId: user?._id,
      receiverId: friendId,
      text: newMessage.trim(),
      conversationId: conversation._id,
    })

    try {
      const res = await customFetch('/api/v1/message/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      })
      const data = await res.json()
      if (res.status === 201) {
        setMessages((prev) => [...prev, data.savedMessage])
        dispatch({
          type: 'UPDATE_CONVERSATION_LAST_MESSAGE',
          payload: {
            conversationId: conversation._id,
            lastMessage: newMessage.trim(),
            lastMessageSender: user?._id,
          },
        })
        setNewMessage('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleEmojiClick = (emojiObject: any) => {
    setNewMessage((prev) => prev + emojiObject.emoji)
    setShowEmoji(false)
    inputRef.current?.focus()
  }

  const formatLastActive = (timestamp: string | undefined) => {
    if (!timestamp) return 'Unknown'
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  if (!friend) {
    return (
      <div className="flex items-center justify-center h-full text-neutral-500">
        <p>Friend data not available</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-3 border-b border-neutral-200 bg-white">
        <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="relative">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-neutral-100">
            {friend.avatar?.url ? (
              <img src={friend.avatar.url} alt={friend.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-sm font-medium text-neutral-500">
                {friend.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success-500 border-2 border-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-neutral-900 truncate">{friend.name}</h3>
          <p className="text-xs text-neutral-500">
            {isOnline ? 'Active Now' : `Last active: ${formatLastActive(friend.lastActive)}`}
          </p>
        </div>
        {friend.role === 'seller' && (
          <a
            href={`/user/${friendId}`}
            target="_blank"
            rel="noopener noreferrer"
            title="View Seller Profile"
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-md text-xs font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
          >
            <User className="h-3.5 w-3.5" />
            View Profile
          </a>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-3 space-y-1 bg-neutral-50">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <EmptyState
              icon={<MessageCircle className="h-8 w-8" />}
              title={`Start your conversation with ${friend.name}`}
            />
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={message._id || index}
              text={message.text}
              createdAt={message.createdAt}
              isOwn={message.sender === user?._id}
              senderAvatar={userAvatars[message.sender]}
              senderName={friend.name}
            />
          ))
        )}
        {isFriendTyping && <TypingIndicator name={friend.name} />}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-neutral-200 bg-white">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setShowEmoji(!showEmoji)}
            >
              <Smile className="h-5 w-5 text-neutral-500" />
            </Button>
            {showEmoji && (
              <div className="absolute bottom-12 left-0 z-50">
                <Picker onEmojiClick={handleEmojiClick} width={300} height={350} />
              </div>
            )}
          </div>
          <Input
            ref={inputRef}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1"
            disabled={sending}
          />
          <Button type="submit" size="icon" className="h-9 w-9" disabled={!newMessage.trim() || sending}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default ChatWindow
