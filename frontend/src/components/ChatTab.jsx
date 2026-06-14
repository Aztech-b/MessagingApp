import ChatBar from "./ChatBar";
import { useOutlet, useParams } from "react-router";
import styles from "../styles/chatTab.module.css";
import { ChatContextProvider } from "./Context";
import useChats from "../hooks/useChats.jsx";
import useChatSockets from "../hooks/useChatSockets.jsx";
import useActiveChat from "../hooks/useActiveChat.jsx";
import { cloneElement } from "react";
import { AnimatePresence } from "motion/react";

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
    const animatedOutlet = useOutlet({ activeChatName, setActiveChatName, usernames });
    return (
        <>
            <ChatContextProvider
                value={{ deleteChat, chats, unreadCount, lastReadMessages, setLastReadMessage, addChat, setUsernames }}
            >
                <div className={styles.container}>
                    <ChatBar></ChatBar>
                    <AnimatePresence>
                        {animatedOutlet && cloneElement(animatedOutlet, { key: location.pathname })}
                    </AnimatePresence>
                </div>
            </ChatContextProvider>
        </>
    );
}

export default ChatTab;
