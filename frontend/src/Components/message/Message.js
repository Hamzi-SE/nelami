import "./message.css"
import { formatDistanceToNow } from "date-fns";
import { useSelector } from "react-redux";

const Message = (props) => {
    const { user } = useSelector(state => state.user);
    const { own, message } = props;

    const formatTimestamp = (timestamp) => {
		return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
	}

    return (
        <>
            <div className={own ? "message own" : "message"}>
                <div className="messageTop">
                    <img className="messageImg" src={own ? user?.avatar?.url : localStorage.getItem("friendAvatar")} alt="user" />
                    <p className="messageText m-0">{message.text}</p>
                </div>
                <div className="messageBottom m-0">{formatTimestamp(message.createdAt)}</div>
            </div>
        </>
    )
}

export default Message