import { Link, useOutletContext } from "react-router";
import styles from "../styles/chatTab.module.css";
import { MoveLeft } from "lucide-react";
import { motion } from "motion/react";
import Chat from "./Chat.jsx";

/**
 * @typedef {import("./types.js").Chat} Chat
 * @typedef {import("./types.js").newMessageData} newMessageData
 */

function ChatContainer() {
    const { activeChatName, usernames } = useOutletContext();
    return (
        <motion.div
            className={styles.messages}
            key={location.pathname}
            initial={{ y: "-100%", x: "100%" }}
            transition={{ duration: 0.2 }}
            exit={{ y: "-100%", x: "100%" }}
            animate={{ x: "0%" }}
            style={{ zIndex: 100 }}
        >
            <TopBar chatName={activeChatName} usernames={usernames} />
            <Chat />
        </motion.div>
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
