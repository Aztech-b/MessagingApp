import ChatBar from "./ChatBar";
import { Outlet, useParams, Link } from "react-router";
import styles from "../styles/chatTab.module.css";
import { ChatContextProvider } from "./Context";
import useChats from "../hooks/useChats.jsx";
import useChatSockets from "../hooks/useChatSockets.jsx";
import useActiveChat from "../hooks/useActiveChat.jsx";
import { MoveLeft } from "lucide-react";
import { motion } from "motion/react";

/**
 * @typedef {import("./types.js").Chat} Chat
 * @typedef {import("./types.js").newMessageData} newMessageData
 */

function ChatTab() {
    const chatId = Number(useParams().id);
    const { chats, deleteChat, addChat, lastReadMessages, setLastReadMessage, addNewMessage, unreadCount } =
        useChats(chatId);
    const { activeChatName, setActiveChatName, usernames, setUsernames } = useActiveChat();
    useChatSockets(chats, addChat, deleteChat, addNewMessage);
    const { id } = useParams();

    return (
        <>
            <ChatContextProvider
                value={{ deleteChat, chats, unreadCount, lastReadMessages, setLastReadMessage, addChat, setUsernames }}
            >
                <motion.div layout className={`${styles.container} ${id ? styles.chatBarClose : styles.chatBarOpen}`}>
                    <ChatBar></ChatBar>
                    <motion.div
                        transition={{ duration: 0.2, type: "spring", stiffness: 400, damping: 35 }}
                        layout
                        className={styles.messages}
                    >
                        <TopBar chatName={activeChatName} usernames={usernames} />
                        <Outlet context={{ setActiveChatName }}></Outlet>
                    </motion.div>
                </motion.div>
            </ChatContextProvider>
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

export default ChatTab;
