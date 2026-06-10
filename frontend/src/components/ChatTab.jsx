import { useState, useEffect, createContext, useContext } from "react";
import { useUserContext } from "./Context";
import Sidebar from "./Sidebar";
import ChatBar from "./ChatBar";
import { Outlet, useParams } from "react-router";
import styles from "../styles/chatTab.module.css";
import { ChatContextProvider } from "./Context";
import socket from "./socket.js";
import { DatabaseBackup } from "lucide-react";
/**
 * @typedef {import("./types.js").Chat} Chat
 * @typedef {import("./types.js").newMessageData} newMessageData
 */

function ChatTab() {
    const [activeChatId, setActiveChatId] = useState();
    const chatId = Number(useParams().id);

    /** @type {[Chat[], Function]} */
    const [chats, setChats] = useState([]);
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
    /** @param {number} chatId  @param {number} messageId */
    const setLastReadMessage = (chatId, messageId, isLastMessageSeen) => {
        if (isLastMessageSeen) {
            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === chatId ? { ...chat, lastReadMessageId: messageId, unreadCount: 0 } : chat,
                ),
            );
            return;
        }
        setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, lastReadMessageId: messageId } : chat)));
    };

    /** @param {{id: number, title: string}} newChatData */
    const addChat = async (newChatData) => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newChatName, members: chatMembers }),
        });
        const data = await response.json();
        setChats((prev) => [{ id: newChatData.id, title: newChatData.title }, ...prev]);
    };

    useEffect(function FetchData() {
        async function GetAllChats() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("response is not ok");
                }
                const data = await response.json();
                setChats(data);
            } catch (error) {}
        }
        GetAllChats();
    }, []);

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

    useEffect(function NewMessage() {
        /** @param {newMessageData} data */
        function handleNewMessage(data) {
            setChats((prev) =>
                prev.map((chat) =>
                    chat.id === data.chatId && chatId !== chat.id
                        ? { ...chat, unreadCount: chat.unreadCount + 1 }
                        : chat,
                ),
            );
        }
        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, []);

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
