import EmptyState from '@/components/shared/EmptyState'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { format, formatDistanceToNow } from 'date-fns'
import { Loader2, MessageCircle } from 'lucide-react'

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

interface ConversationListProps {
  conversations: Conversation[]
  friendsData: Record<string, Friend>
  currentUserId: string
  currentChatId: string | null
  onlineUsers: string[]
  typingStatuses: Record<string, boolean>
  loading: boolean
  onSelectConversation: (conversation: Conversation) => void
}

const ConversationList = ({
  conversations,
  friendsData,
  currentUserId,
  currentChatId,
  onlineUsers,
  typingStatuses,
  loading,
  onSelectConversation,
}: ConversationListProps) => {
  const getFriend = (conversation: Conversation): Friend | null => {
    const friendId = conversation.members.find((m) => m !== currentUserId)
    return friendId ? friendsData[friendId] || null : null
  }

  const isOnline = (conversation: Conversation): boolean => {
    const friendId = conversation.members.find((m) => m !== currentUserId)
    return !!friendId && onlineUsers.includes(friendId)
  }

  const formatTimestamp = (timestamp: string | undefined) => {
    if (!timestamp) return null
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (conversations.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <EmptyState
          icon={<MessageCircle className="h-12 w-12" />}
          title="No Conversations"
          description="Start a conversation from a product page to chat with sellers/buyers."
        />
      </div>
    )
  }

  return (
    <TooltipProvider delay={300}>
      <div className="overflow-y-auto h-full">
        {conversations.map((conversation) => {
          const friend = getFriend(conversation)
          const online = isOnline(conversation)
          const isTyping = typingStatuses[conversation._id]
          const isActive = currentChatId === conversation._id

          if (!friend) return null

          return (
            <button
              key={conversation._id}
              type="button"
              onClick={() => onSelectConversation(conversation)}
              className={cn(
                'w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-neutral-50 border-b border-neutral-100',
                isActive && 'bg-primary-50 hover:bg-primary-50'
              )}
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-11 w-11 rounded-full overflow-hidden bg-neutral-100">
                  {friend.avatar?.url ? (
                    <img src={friend.avatar.url} alt={friend.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-sm font-medium text-neutral-500">
                      {friend.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                {online && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-success-500 border-2 border-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                {/* Top row: Name + Last seen label */}
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-neutral-900 truncate">{friend.name}</h4>
                  {!online && <span className="text-xs text-neutral-400 shrink-0">Last seen</span>}
                </div>
                {/* Bottom row: Last seen time + message preview */}
                <div className="flex items-center justify-between gap-2 mt-0.5">
                  <p
                    className={cn(
                      'text-xs truncate flex-1',
                      isTyping ? 'text-primary-600 font-medium' : 'text-neutral-500'
                    )}
                  >
                    {isTyping ? (
                      `${friend.name.split(' ')[0]} is typing...`
                    ) : conversation.lastMessage ? (
                      <>
                        {conversation.lastMessageSender === currentUserId ? (
                          <span className="font-medium">You: </span>
                        ) : (
                          <span className="font-medium">{friend.name.split(' ')[0]}: </span>
                        )}
                        {conversation.lastMessage}
                      </>
                    ) : (
                      'No messages yet'
                    )}
                  </p>
                  <Tooltip>
                    <TooltipTrigger>
                      <span
                        className={cn(
                          'text-xs font-medium cursor-help shrink-0',
                          online ? 'text-success-600' : 'text-neutral-500'
                        )}
                      >
                        {online ? 'Active Now' : formatTimestamp(friend.lastActive)}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="text-xs">
                      {online
                        ? 'Currently online'
                        : friend.lastActive
                          ? format(new Date(friend.lastActive), 'MMM d, yyyy h:mm a')
                          : 'Unknown'}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </TooltipProvider>
  )
}

export default ConversationList
