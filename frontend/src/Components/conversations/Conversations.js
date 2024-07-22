import "./conversations.css";

const Conversations = ({ currentUser, conversation, friendsData, onlineStatus }) => {
    const friendId = conversation.members.find(m => m !== currentUser._id);
    const friend = friendsData[friendId];

    return (
        <div className="conversation">
            <div className="img-group position-relative">
                <img src={friend?.avatar.url} alt={friend?.name} className="conversationImg" />
                {onlineStatus && <div className="user-online"></div>}
            </div>
            <span className="conversationName">{friend?.name}</span>
        </div>
    );
};

export default Conversations;
