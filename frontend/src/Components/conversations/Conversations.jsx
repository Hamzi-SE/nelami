import { formatDistanceToNow } from 'date-fns'
import './conversations.css'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useSocket } from '../../hooks/useSocket'

const Conversations = ({ currentUser, conversation, friendsData, onlineStatus, lastActive, typingStatuses }) => {
  const friendId = conversation.members.find((m) => m !== currentUser._id)
  const friend = friendsData[friendId]
  const dispatch = useDispatch()
  const socket = useSocket()

  const [lastActiveState, setLastActiveState] = useState(friend?.lastActive || null)
  const [, forceUpdate] = useState(0) // Dummy state to trigger re-render

  useEffect(() => {
    socket.on('getMessage', (data) => {
      dispatch({
        type: 'UPDATE_CONVERSATION_LAST_MESSAGE',
        payload: {
          conversationId: data.conversationId,
          lastMessage: data.text,
          lastMessageSender: data.senderId,
        },
      })
    })
  })

  useEffect(() => {
    if (friend?.lastActive) {
      setLastActiveState(friend.lastActive)
    }
  }, [friend?.lastActive])

  useEffect(() => {
    if (lastActive && friendId === currentUser._id) {
      setLastActiveState(lastActive)
    }
  }, [lastActive, friendId, currentUser._id])

  const formatTimestamp = (timestamp) => {
    if (timestamp) {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
    }
    return null
  }

  useEffect(() => {
    const handleUpdateLastActive = ({ userId, lastActive }) => {
      if (conversation?.members.includes(userId)) {
        setLastActiveState(lastActive)
      }
    }

    socket.on('updateLastActive', handleUpdateLastActive)

    // Set up interval to force re-render
    const intervalId = setInterval(() => {
      forceUpdate((prev) => prev + 1) // Increment dummy state
    }, 60000) // Update every minute

    // Cleanup listener and interval on unmount
    return () => {
      socket.off('updateLastActive', handleUpdateLastActive)
      clearInterval(intervalId)
    }
  }, [friendId, friend?.lastActive, conversation?.members, socket])

  return (
    friend && (
      <div className="conversation">
        <div className="img-group position-relative conversation-img-wrapper">
          <img src={friend?.avatar.url} alt={friend?.name} className="conversation-img" />
          {onlineStatus && <div className="user-online"></div>}
        </div>
        <div className="conversation-user-details">
          <span className="d-md-flex conversation-name">{friend?.name}</span>
          <p className="m-0 conversation-last-message">
            {typingStatuses[conversation._id] ? (
              `${friend?.name?.split(' ')[0]} is typing...`
            ) : conversation?.lastMessage ? (
              <>
                {conversation.lastMessageSender === currentUser._id ? (
                  <span className="font-weight-bold">You: </span>
                ) : (
                  <span className="font-weight-bold">{friend?.name?.split(' ')[0]}: </span>
                )}
                {conversation.lastMessage}
              </>
            ) : (
              'No message'
            )}
          </p>
          <p className={`m-0 conversation-last-time ${onlineStatus ? 'conversation-active-now' : ''}`}>
            {onlineStatus ? 'Active Now' : `Last active: ${formatTimestamp(lastActiveState)}`}
          </p>
        </div>
      </div>
    )
  )
}

export default Conversations
