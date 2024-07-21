import { useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import "./Messenger.css";
import Conversations from "../../Components/conversations/Conversations";
import Message from "../../Components/message/Message";
import Picker from 'emoji-picker-react';
import { ClipLoader, PulseLoader } from 'react-spinners';
import io from "socket.io-client";
import MetaData from "../../utils/MetaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../Components/Loader/Loader";
import customFetch from "../../utils/api";
import { useNavigate } from "react-router-dom";

// Socket Connection
const socket = io.connect(process.env.REACT_APP_SOCKET_URL, {
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
});

const Messenger = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { user, loading: userLoading, isAuthenticated } = useSelector(state => state.user);
    const { loading, conversations } = useSelector(state => state.conversations);
    const messagesLoading = useSelector(state => state.messages.loading);
    const [showPicker, setShowPicker] = useState(false);
    const [currentChat, setCurrentChat] = useState(null);
    const [currentFriendName, setCurrentFriendName] = useState("");
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [msgSending, setMsgSending] = useState(false);
    const [userAvatars, setUserAvatars] = useState({});
    const [friendsData, setFriendsData] = useState({});
    const scrollRef = useRef();
    const chatEmojiRef = useRef();

    useEffect(() => {
        socket.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });
    });

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    useEffect(() => {
        socket.emit("addUser", user?._id);
    }, [user]);

    const onEmojiClick = (event, emojiObject) => {
        setNewMessage(prevInput => prevInput + emojiObject.emoji);
        setShowPicker(false);
    };

    useEffect(() => {
        const getConversations = async () => {
            dispatch({ type: "GET_ALL_CONVERSATIONS_REQUEST" });
            const res = await customFetch(`/api/v1/conversations/${user?._id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await res.json();
    
            if (res.status !== 200) {
                dispatch({ type: "GET_ALL_CONVERSATIONS_FAIL", payload: data.message });
                toast.error(data.message);
            } else {
                dispatch({ type: "GET_ALL_CONVERSATIONS_SUCCESS", payload: data.conversations });
                // Fetch avatars and friends data
                const avatars = {};
                const friends = {};
                for (const conversation of data.conversations) {
                    const friendId = conversation.members.find(m => m !== user?._id);
                    if (!friends[friendId]) {
                        const res = await customFetch(`/api/v1/user/${friendId}`, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        });
                        const friendData = await res.json();
                        if (res.status === 200) {
                            avatars[friendId] = friendData.user?.avatar.url;
                            friends[friendId] = friendData.user;
                        }
                    }
                }
                setUserAvatars(avatars);
                setFriendsData(friends);
                setUserAvatars(prevAvatars =>({...prevAvatars, [user?._id]: user?.avatar.url}))
            }
        };
        getConversations();
    }, [user?._id, dispatch, user?.avatar.url]);

    useEffect(() => {
        const getMessages = async () => {
            dispatch({ type: "GET_MESSAGES_REQUEST" });
            try {
                const res = await customFetch(`/api/v1/messages/${currentChat?._id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await res.json();
    
                if (res.status !== 200) {
                    dispatch({ type: "GET_MESSAGES_FAIL", payload: data.message });
                    toast.error(data.message);
                } else {
                    dispatch({ type: "GET_MESSAGES_SUCCESS", payload: data.messages });
                    setMessages(data.messages);
                }
            } catch (error) {
                dispatch({ type: "GET_MESSAGES_FAIL", payload: error });
            }
        };
        if (currentChat) {
            const friendId = currentChat.members.find(m => m !== user?._id);
            setCurrentFriendName(friendsData[friendId]?.name || "");
            getMessages();
        }
    }, [currentChat, dispatch, friendsData, user?._id]);

    const sendMessage = async (e) => {
        e.preventDefault();
        setMsgSending(true);

        const receiverId = currentChat.members.find(
            (member) => member !== user?._id
        );

        const message = {
            sender: user?._id,
            conversationId: currentChat._id,
            text: newMessage,
        };

        if (newMessage.length === 0) {
            setMsgSending(false);
            return;
        }

        socket.emit("sendMessage", {
            senderId: user?._id,
            receiverId,
            text: newMessage,
        });

        const res = await customFetch(`/api/v1/message/new`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
        });
        const data = await res.json();
        if (res.status !== 201) {
            toast.error(data.message);
        } else {
            setMessages([...messages, data.savedMessage]);
            setNewMessage("");
        }

        setMsgSending(false);
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const addActiveClass = (e) => {
        const allConversations = document.querySelectorAll(".conversation");
        allConversations.forEach((conversation) => {
            conversation.classList.remove("active");
        });

        e.currentTarget.children[0].classList.add("active");
    };


    if (loading || userLoading) {
        return <Loader />;
    } else if (!userLoading && !isAuthenticated) {
        return navigate("/login", { replace: true })
    }

    return (
        <>
            <MetaData title="Messenger - Nelami" />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <h3 className="chatMenuInput">Sellers</h3>
                        {conversations?.map(c => (
                            <div key={c._id} className="conversation-wrapper" onClick={(e) => { setCurrentChat(c); addActiveClass(e) }}>
                                <Conversations conversation={c} currentUser={user} friendsData={friendsData} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                <div className="chatFriendName">
                                    <h3>{currentFriendName}</h3>
                                </div>
                                <div className="chatBoxTop">
                                    {messagesLoading ? (
                                        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                                            <ClipLoader size={100} color={"#1877f2"} />
                                        </div>) : messages.map(m => (
                                        <div key={m._id}>
                                            <Message message={m} own={m.sender === user?._id} userAvatars={userAvatars} />
                                        </div>
                                    ))}
                                    <div ref={scrollRef}></div>
                                </div>
                                <div className="chatBoxBottom" style={{ position: "relative" }}>
                                    <img
                                        className="emoji-icon" ref={chatEmojiRef}
                                        src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                                        alt="emoji"
                                        onClick={() => setShowPicker(val => !val)} />
                                    {showPicker && <Picker onEmojiClick={onEmojiClick} />}
                                    <textarea className="chatMessageInput" placeholder="Type a message" name="newMessage" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}></textarea>
                                    <button className={`chatSubmitButton d-flex justify-content-center align-items-center ${msgSending && 'pe-none disabled'}`} onClick={sendMessage}>
                                        {msgSending ? <PulseLoader size={5} color="white" /> : "Send"}
                                    </button>
                                </div>
                            </>) : <span className="noConversationText">Open a Conversation to Start a Chat</span>
                        }
                    </div>
                </div>
            </div>
        </>
    );
};

export default Messenger;
