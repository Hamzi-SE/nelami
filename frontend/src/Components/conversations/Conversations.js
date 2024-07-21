import "./conversations.css";

const Conversations = ({ currentUser, conversation, friendsData }) => {
    const friendId = conversation.members.find(m => m !== currentUser._id);
    const friend = friendsData[friendId];

    return (
        <div className="conversation">
            <img className="conversationImg" src={friend?.avatar.url} alt="UserImage" />
            <span className="conversationName">{friend?.name}</span>
        </div>
    );
};

export default Conversations;
