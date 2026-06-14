import ChatBar from "./ChatBar";
import { Outlet, useParams } from "react-router";
import styles from "../styles/chatTab.module.css";
import { ChatContextProvider } from "./Context";
import useChats from "../hooks/useChats.jsx";
import useChatSockets from "../hooks/useChatSockets.jsx";
import useActiveChat from "../hooks/useActiveChat.jsx";
import { MoveLeft } from "lucide-react";

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

    return (
        <>
            <ChatContextProvider
                value={{ deleteChat, chats, unreadCount, lastReadMessages, setLastReadMessage, addChat, setUsernames }}
            >
                <div className={styles.container}>
                    <ChatBar></ChatBar>
                    <div className={styles.messages}>
                        <TopBar chatName={activeChatName} usernames={usernames} />
                        <Outlet context={{ setActiveChatName }}></Outlet>
                    </div>
                </div>
            </ChatContextProvider>
        </>
    );
}

function TopBar({ chatName, usernames }) {
    return (
        <div className={styles.topBar}>
            <div className={styles.back}>
                <MoveLeft style={{ display: "flex", alignItems: "center" }} size={32} />
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
