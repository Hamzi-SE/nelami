import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "./Messanger.css"
// import ChatOnline from "../components/chatOnline/ChatOnline"
import Conversations from "../../Components/conversations/Conversations"
import Message from "../../Components/message/Message"
import Picker from 'emoji-picker-react';
import { ClipLoader, PulseLoader } from 'react-spinners'
import io from "socket.io-client"
import MetaData from "../../utils/MetaData";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../../Components/Loader/Loader";
import customFetch from "../../utils/api";


// Socket Connection
const socket = io.connect(process.env.REACT_APP_SOCKET_URL)


const Messanger = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.user);
    const { loading, conversations } = useSelector(state => state.conversations);
    const messagesLoading = useSelector(state => state.messages.loading);
    const [showPicker, setShowPicker] = useState(false);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [msgSending, setMsgSending] = useState(false);
    const scrollRef = useRef();
    const chatEmojiRef = useRef();

    // useEffect(() => {
    //     //scroll to top
    //     window.scrollTo(0, 0);

    // }, [])


    useEffect(() => {
        socket.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data.senderId,
                text: data.text,
                createdAt: Date.now(),
            });
        });


        // //Hide footer only on Messagner page
        // const footer = document.querySelector(".footer");
        // if (footer) {
        //     footer.style.display = "none";
        // }

        // //Hide form container only on Messagner page
        // const formContainer = document.querySelector(".mc__form-container");
        // if (formContainer) {
        //     formContainer.style.display = "none";
        // }

    }, [])

    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);


    // Add User to the live users upon connection
    useEffect(() => {
        socket.emit("addUser", user?._id)
        // socket.on("getUsers", (users) => {
        //     console.log(users)
        // })
    }, [user])


    const onEmojiClick = (event, emojiObject) => {
        setNewMessage(prevInput => prevInput + emojiObject.emoji);
        setShowPicker(false);
    };


    const getConversations = async () => {
        dispatch({ type: "GET_ALL_CONVERSATIONS_REQUEST" })
        const res = await customFetch(`/api/v1/conversations/${user?._id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await res.json();


        if (res.status !== 200) {
            dispatch({ type: "GET_ALL_CONVERSATIONS_FAIL", payload: data.message });
            toast.error(data.message)
        } else {
            dispatch({ type: "GET_ALL_CONVERSATIONS_SUCCESS", payload: data.conversations })
        }
    };

    useEffect(() => {
        getConversations();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id])


    const getMessages = async () => {
        dispatch({ type: "GET_MESSAGES_REQUEST" })
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
                toast.error(data.message)
            } else {
                dispatch({ type: "GET_MESSAGES_SUCCESS", payload: data.messages })
                setMessages(data.messages)
            }
        } catch (error) {
            dispatch({ type: "GET_MESSAGES_FAIL", payload: error });
        }

    }

    useEffect(() => {
        getMessages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentChat])


    const sendMessage = async (e) => {
        e.preventDefault();
        setMsgSending(true)

        const receiverId = currentChat.members.find(
            (member) => member !== user._id
        );

        const message = {
            sender: user._id,
            conversationId: currentChat._id,
            text: newMessage,
        }

        // If message is empty, don't send it
        if (newMessage.length === 0) {
            setMsgSending(false)
            return
        }

        socket.emit("sendMessage", {
            senderId: user._id,
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
            toast.error(data.message)
        } else {
            setMessages([...messages, data.savedMessage])
            setNewMessage("")
        }

        setMsgSending(false)
    }



    useEffect(() => {
        //scroll to bottom
        scrollRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages])

    // add active class to child component
    const addActiveClass = (e) => {
        const allConversations = document.querySelectorAll(".conversation");
        allConversations.forEach((conversation) => {
            conversation.classList.remove("active");
        });

        e.currentTarget.children[0].classList.add("active");
    };





    if (loading) {
        return <Loader />
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
                                <Conversations conversation={c} currentUser={user} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {currentChat ? (
                            <>
                                <div className="chatBoxTop" >
                                    {messagesLoading ? (
                                        <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                                            <ClipLoader size={100} color={"#1877f2"} />
                                        </div>) : messages.map(m => (
                                        <div key={m._id}>
                                            <Message message={m} own={m.sender === user._id} />
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
                                    {showPicker && <Picker
                                        onEmojiClick={onEmojiClick}
                                    />}
                                    <textarea className="chatMessageInput" placeholder="Type a message" name="newMessage" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} ></textarea>

                                    <button className={`chatSubmitButton d-flex justify-content-center align-items-center ${msgSending && 'pe-none disabled'}`} onClick={sendMessage}>
                                        {msgSending ? <PulseLoader size={5} color="white" /> : "Send"}</button>
                                </div>
                            </>) : <span className="noConversationText">Open a Conversation to Start a Chat</span>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Messanger