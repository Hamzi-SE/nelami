import './message.css'
import { formatDistanceToNow } from 'date-fns'

const Message = ({ message, own, userAvatars }) => {
  const formatTimestamp = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true })
  }

  const getAvatar = (senderId) => {
    return userAvatars[senderId] || ''
  }

  return (
    <div className={own ? 'message own' : 'message'}>
      <div className="messageTop">
        <img className="messageImg" src={getAvatar(message.sender)} alt="user" />
        <p className="messageText m-0">{message.text}</p>
      </div>
      <div className="messageBottom m-0">{formatTimestamp(message.createdAt)}</div>
    </div>
  )
}

export default Message
