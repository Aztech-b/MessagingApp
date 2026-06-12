import { useState, useEffect, createContext, useContext } from "react";
import { useUserContext } from "./Context";
import Sidebar from "./Sidebar";
import ChatBar from "./ChatBar";
import { Outlet, useLocation, useParams } from "react-router";
import styles from "../styles/chatTab.module.css";
import { ChatContextProvider } from "./Context";
import socket from "./socket.js";
import { DatabaseBackup } from "lucide-react";
import useChats from "../hooks/useChats.jsx";
import useChatSockets from "../hooks/useChatSockets.jsx";
import useActiveChat from "../hooks/useActiveChat.jsx";

/**
 * @typedef {import("./types.js").Chat} Chat
 * @typedef {import("./types.js").newMessageData} newMessageData
 */

function ChatTab() {
    const chatId = Number(useParams().id);
    const { deleteChat, chats, addChat, lastReadMessages, setLastReadMessage, addNewMessage, unreadCount } =
        useChats(chatId);
    const { activeChatName, setActiveChatName } = useActiveChat();
    const location = useLocation();
    useChatSockets(chats, addChat, deleteChat, addNewMessage);

    return (
        <>
            <ChatContextProvider
                value={{ deleteChat, chats, unreadCount, lastReadMessages, setLastReadMessage, addChat }}
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
