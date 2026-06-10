import { useState, useEffect, createContext, useContext } from "react";
import { useUserContext } from "./Context";
import Sidebar from "./Sidebar";
import ChatBar from "./ChatBar";
import { Outlet, useParams } from "react-router";
import styles from "../styles/chatTab.module.css";
import { ChatContextProvider } from "./Context";
import socket from "./socket.js";
import { DatabaseBackup } from "lucide-react";
import useChats from "../hooks/useChats.jsx";
import useChatSockets from "../hooks/useChatSockets.jsx";

/**
 * @typedef {import("./types.js").Chat} Chat
 * @typedef {import("./types.js").newMessageData} newMessageData
 */

function ChatTab() {
    const chatId = Number(useParams().id);
    const { chats, addChat, setLastReadMessage, addNewMessage } = useChats(chatId);

    const [activeChatName, setActiveChatName] = useState("");
    useChatSockets(chats, addNewMessage);

    /**@type {{[id]: number}[]} */
    const unreadCount = chats?.reduce((accumulator, chat) => {
        accumulator[chat.id] = chat.unreadCount;
        return accumulator;
    }, {});

    /** @type {{[id]: number}} */
    const lastReadMessages = chats?.reduce((accumulator, chat) => {
        accumulator[chat.id] = chat.lastReadMessageId;
        return accumulator;
    }, {});

    return (
        <>
            <ChatContextProvider
                value={{ chats, unreadMessages: unreadCount, lastReadMessages, setLastReadMessage, addChat }}
            >
                <ChatBar></ChatBar>
                <div className={styles.messages}>
                    <TopBar chatName={activeChatName} />
                    <Outlet context={{ setActiveChatName }}></Outlet>
                </div>
            </ChatContextProvider>
        </>
    );
}

function TopBar({ chatName }) {
    return (
        <div className={styles.topBar}>
            <p className="chatName">{chatName}</p>
        </div>
    );
}

export default ChatTab;
