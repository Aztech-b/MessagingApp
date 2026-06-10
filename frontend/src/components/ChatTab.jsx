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

/**
 * @typedef {import("./types.js").Chat} Chat
 * @typedef {import("./types.js").newMessageData} newMessageData
 */

function ChatTab() {
    const [activeChatId, setActiveChatId] = useState();
    const chatId = Number(useParams().id);

    const { chats, addChat, setLastReadMessage } = useChats();

    const [activeChatName, setActiveChatName] = useState("");

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

    useEffect(
        function JoinSocket() {
            if (!chats || chats.length === 0) {
                return;
            }
            for (let i = 0; i < chats.length; i++) {
                const id = chats[i].id;
                socket.emit("join", { chatId: id });
            }
            return () => {
                for (let i = 0; i < chats.length; i++) {
                    const id = chats[i].id;
                    socket.emit("leave", { chatId: id });
                }
            };
        },
        [chats.length],
    );

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
