import styles from "../styles/chatTab.module.css";
import { Link, useOutletContext } from "react-router";
import { MoveLeft } from "lucide-react";
import Chat from "./Chat";

function ChatContainer() {
    const { activeChatName, usernames } = useOutletContext();
    return (
        <>
            <div className={styles.messages}>
                <TopBar chatName={activeChatName} usernames={usernames} />
                <Chat></Chat>
            </div>
        </>
    );
}

function TopBar({ chatName, usernames }) {
    return (
        <div className={styles.topBar}>
            <div className={styles.back}>
                <Link to={"/app/chat"}>
                    <MoveLeft style={{ display: "flex", alignItems: "center" }} size={32} />
                </Link>
            </div>
            {chatName ? (
                <div className={styles.info}>
                    <p className={styles.chatName}>{chatName}</p>
                    <div className={styles.usernamesContainer}>
                        {usernames?.map((username) => (
                            <p key={username}>{username}</p>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

export default ChatContainer;
