import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import "./conversations.css"
import customFetch from '../../utils/api';

const Conversations = ({ currentUser, conversation }) => {
    const [friend, setFriend] = useState(null);

    const friendId = conversation.members.find(m => m !== currentUser._id)

    const getFriend = async () => {
        const res = await customFetch(`/api/v1/user/${friendId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                },
            });
        const data = await res.json();

        if (res.status !== 200) {
            toast.error(data.message)
        } else {
            setFriend(data.user)
            localStorage.setItem("friendAvatar", data.user.avatar.url);
        }
    };

    useEffect(() => {
        getFriend();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, conversation])



    return (
        <>
            <div className="conversation">
                <img className="conversationImg" src={friend?.avatar.url} alt="UserImage" />
                <span className="conversationName">{friend?.name}</span>
            </div>
        </>
    )
}

export default Conversations