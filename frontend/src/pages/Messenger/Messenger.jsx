import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import './Messenger.css'
import Conversations from '../../Components/conversations/Conversations'
import Message from '../../Components/message/Message'
import Picker from 'emoji-picker-react'
import { ClipLoader, PulseLoader } from 'react-spinners'
import MetaData from '../../utils/MetaData'
import { useSelector, useDispatch } from 'react-redux'
import Loader from '../../Components/Loader/Loader'
import customFetch from '../../utils/api'
import { useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { IoMdArrowRoundBack } from 'react-icons/io'
import { useSocket } from '../../hooks/useSocket'

const Messenger = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const socket = useSocket()
  const { user, loading: userLoading, isAuthenticated } = useSelector((state) => state.user)
  const { loading, conversations } = useSelector((state) => state.conversations)
  const messagesLoading = useSelector((state) => state.messages.loading)
  const [showPicker, setShowPicker] = useState(false)
  const [currentChat, setCurrentChat] = useState(null)
  const [currentFriendName, setCurrentFriendName] = useState('')
  const [currentFriendActiveTime, setCurrentFriendActiveTime] = useState(null)
  const [currentFriendPicture, setCurrentFriendPicture] = useState('')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [liveUsers, setLiveUsers] = useState([])
  const [lastActive, setLastActive] = useState(null) // State to track last active time
  const [, forceUpdate] = useState(0) // Dummy state to trigger re-render
  const [msgSending, setMsgSending] = useState(false)
  const [typingStatuses, setTypingStatuses] = useState({})
  const [userAvatars, setUserAvatars] = useState({})
  const [friendsData, setFriendsData] = useState({})
  const [isMobileView, setIsMobileView] = useState(false) // State for mobile view
  const scrollRef = useRef()
  const chatEmojiRef = useRef()

  useEffect(() => {
    // Check if the device is mobile
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768)
    }

    handleResize() // Check initially
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    socket.on('getMessage', (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
        conversationId: data.conversationId,
      })
    })

    return () => socket.off('getMessage')
  }, [socket])

  useEffect(() => {
    socket.on('isTyping', ({ senderId, isTyping, conversationId }) => {
      setTypingStatuses((prev) => ({
        ...prev,
        [conversationId]: isTyping,
      }))
    })

    return () => socket.off('isTyping')
  }, [socket])

  useEffect(() => {
    if (newMessage.trim() !== '') {
      socket.emit('typing', {
        conversationId: currentChat?._id,
        senderId: user?._id,
        receiverId: currentChat?.members.find((m) => m !== user?._id),
        isTyping: true,
      })
    } else if (newMessage?.trim() === '') {
      socket.emit('typing', {
        conversationId: currentChat?._id,
        senderId: user?._id,
        receiverId: currentChat?.members.find((m) => m !== user?._id),
        isTyping: false,
      })

      setTypingStatuses((prev) => ({
        ...prev,
        [currentChat?._id]: false,
      }))
    }
  }, [newMessage, currentChat, user?._id, socket])

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]) &&
      dispatch({
        type: 'UPDATE_CONVERSATION_LAST_MESSAGE',
        payload: {
          conversationId: currentChat._id,
          lastMessage: arrivalMessage.text,
          lastMessageSender: arrivalMessage.sender,
        },
      })
  }, [arrivalMessage, currentChat, dispatch])

  useEffect(() => {
    socket.emit('addUser', user?._id)
    socket.on('getUsers', (users) => {
      setLiveUsers(users)
    })

    return () => socket.off('getUsers')
  }, [user, socket])

  const onEmojiClick = (event, emojiObject) => {
    setNewMessage((prevInput) => prevInput + emojiObject.emoji)
    setShowPicker(false)
  }

  useEffect(() => {
    const getConversations = async () => {
      dispatch({ type: 'GET_ALL_CONVERSATIONS_REQUEST' })
      const res = await customFetch(`/api/v1/conversations/${user?._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()

      if (res.status !== 200) {
        dispatch({ type: 'GET_ALL_CONVERSATIONS_FAIL', payload: data.message })
        toast.error(data.message)
      } else {
        dispatch({
          type: 'GET_ALL_CONVERSATIONS_SUCCESS',
          payload: data.conversations,
        })
        // Fetch avatars and friends data
        const avatars = {}
        const friends = {}
        for (const conversation of data.conversations) {
          const friendId = conversation.members.find((m) => m !== user?._id)
          if (!friends[friendId]) {
            const res = await customFetch(`/api/v1/user/${friendId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            })
            const friendData = await res.json()
            if (res.status === 200) {
              avatars[friendId] = friendData.user?.avatar.url
              friends[friendId] = friendData.user
            }
          }
        }
        setUserAvatars(avatars)
        setFriendsData(friends)
        setUserAvatars((prevAvatars) => ({
          ...prevAvatars,
          [user?._id]: user?.avatar.url,
        }))
      }
    }
    getConversations()
  }, [user?._id, dispatch, user?.avatar.url])

  useEffect(() => {
    const getMessages = async () => {
      dispatch({ type: 'GET_MESSAGES_REQUEST' })
      try {
        const res = await customFetch(`/api/v1/messages/${currentChat?._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        const data = await res.json()

        if (res.status !== 200) {
          dispatch({ type: 'GET_MESSAGES_FAIL', payload: data.message })
          toast.error(data.message)
        } else {
          dispatch({ type: 'GET_MESSAGES_SUCCESS', payload: data.messages })
          setMessages(data.messages)
        }
      } catch (error) {
        dispatch({ type: 'GET_MESSAGES_FAIL', payload: error })
      }
    }
    if (currentChat) {
      const friendId = currentChat.members.find((m) => m !== user?._id)
      setCurrentFriendName(friendsData[friendId]?.name || '')
      setCurrentFriendActiveTime(friendsData[friendId]?.lastActive || null)
      setCurrentFriendPicture(friendsData[friendId]?.avatar?.url || '')
      getMessages()
    }
  }, [currentChat, dispatch, friendsData, user?._id])

  const sendMessage = async (e) => {
    e.preventDefault()

    if (newMessage.trim() === '') {
      return
    }

    setMsgSending(true)

    const receiverId = currentChat.members.find((member) => member !== user?._id)

    const message = {
      sender: user?._id,
      conversationId: currentChat._id,
      text: newMessage.trim(),
    }

    socket.emit('sendMessage', {
      senderId: user?._id,
      receiverId,
      text: newMessage,
      conversationId: currentChat._id,
    })

    const res = await customFetch('/api/v1/message/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
    const data = await res.json()
    if (res.status !== 201) {
      toast.error(data.message)
    } else {
      setMessages([...messages, data.savedMessage])
      dispatch({
        type: 'UPDATE_CONVERSATION_LAST_MESSAGE',
        payload: {
          conversationId: currentChat._id,
          lastMessage: newMessage,
          lastMessageSender: user._id,
        },
      })
      setNewMessage('')
    }

    setMsgSending(false)
  }

  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: 'smooth',
    })
  }, [messages])

  const addActiveClass = (e) => {
    if (isMobileView) return

    const allConversations = document.querySelectorAll('.conversation')
    allConversations.forEach((conversation) => {
      conversation.classList.remove('active')
    })

    e.currentTarget.children[0].classList.add('active')
  }

  const checkOnlineStatus = (members) => {
    const friendId = members.find((m) => m !== user?._id)
    return !!liveUsers.find((user) => user.userId === friendId)
  }

  useEffect(() => {
    const handleUpdateLastActive = ({ userId, lastActive }) => {
      if (currentChat?.members.includes(userId)) {
        setLastActive(lastActive)
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
  }, [currentChat, currentChat?.members, lastActive, socket])

  const handleBackToConversations = () => {
    setCurrentChat(null)
  }

  if (userLoading) {
    return <Loader />
  } else if (!userLoading && !isAuthenticated) {
    toast.error('Login to access messenger')
    return navigate('/login', { replace: true })
  }

  return (
    <>
      <MetaData title="Messenger - Nelami" />
      <div className="messenger">
        <div className="chatMenu" style={{ display: isMobileView && currentChat ? 'none' : '' }}>
          <div className="chatMenuWrapper">
            <h3 className="chatMenuInput">{user?.role === 'buyer' ? 'Sellers' : 'Buyers'}</h3>
            {loading ? (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '80%',
                  width: '100%',
                }}
              >
                <ClipLoader size={50} color={'#1877f2'} />
              </div>
            ) : conversations?.length > 0 ? (
              conversations?.map((c) => (
                <div
                  key={c._id}
                  className="conversation-wrapper"
                  onClick={(e) => {
                    setCurrentChat(c)
                    addActiveClass(e)
                  }}
                >
                  <Conversations
                    conversation={c}
                    currentUser={user}
                    friendsData={friendsData}
                    onlineStatus={checkOnlineStatus(c.members)}
                    lastActive={lastActive}
                    typingStatuses={typingStatuses}
                  />
                </div>
              ))
            ) : (
              <h4 className="d-flex w-100 h-75 justify-content-center align-items-center">
                You don't have any conversations
              </h4>
            )}
          </div>
        </div>
        <div className="chatBox" style={{ display: isMobileView && !currentChat ? 'none' : '' }}>
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div
                  className="chatBoxTopHeader w-100 d-flex justify-content-start align-items-center position-relative p-1"
                  style={{ borderBottom: '1px solid #d5d5d5' }}
                >
                  {isMobileView && (
                    <IoMdArrowRoundBack size={20} className="mx-2" onClick={handleBackToConversations} />
                  )}
                  <img
                    src={currentFriendPicture}
                    alt={currentFriendName}
                    width={50}
                    height={50}
                    style={{ borderRadius: '50%' }}
                  />
                  <div className="d-flex flex-column ml-2">
                    <p className="m-0 font-weight-bold">{currentFriendName}</p>
                    <p
                      className="m-0"
                      style={{
                        right: '10px',
                        fontSize: '13px',
                        top: '35px',
                      }}
                    >
                      {checkOnlineStatus(currentChat.members)
                        ? 'Active Now'
                        : `Last active: ${formatDistanceToNow(new Date(lastActive || currentFriendActiveTime), { addSuffix: true })}`}
                    </p>
                  </div>
                </div>
                <div className="chatBoxTop">
                  {messagesLoading ? (
                    <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                      <ClipLoader size={100} color={'#1877f2'} />
                    </div>
                  ) : messages.length > 0 ? (
                    messages.map((m) => (
                      <div key={m._id}>
                        <Message message={m} own={m.sender === user?._id} userAvatars={userAvatars} />
                      </div>
                    ))
                  ) : (
                    <span className="noMessages">Start your conversation with {currentFriendName}</span>
                  )}
                  <div ref={scrollRef}></div>
                </div>
                {typingStatuses[currentChat?._id] && (
                  <p className="m-0 pl-3">{currentFriendName.split(' ')[0]} is typing...</p>
                )}
                <div className="chatBoxBottom" style={{ position: 'relative' }}>
                  <img
                    className="emoji-icon"
                    ref={chatEmojiRef}
                    src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                    alt="emoji"
                    onClick={() => setShowPicker((val) => !val)}
                  />
                  {showPicker && <Picker onEmojiClick={onEmojiClick} />}
                  <textarea
                    className="chatMessageInput"
                    placeholder="Type a message"
                    name="newMessage"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  ></textarea>
                  <button
                    className={`chatSubmitButton d-flex justify-content-center align-items-center ${
                      msgSending && 'pe-none disabled'
                    }`}
                    onClick={sendMessage}
                  >
                    {msgSending ? <PulseLoader size={5} color="white" /> : 'Send'}
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">Open a Conversation to Start a Chat</span>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Messenger
