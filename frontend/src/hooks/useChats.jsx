import { useState, useEffect } from "react";
import socket from "../components/socket.js";
import useChatSockets from "./useChatSockets.jsx";
import { EVENT } from "../../../shared/socketEvents.js";
/** @typedef {import("../components/types.js").Chat} */

function useChats(activeChatId) {
    /** @type {[Chat[], Function]} */
    const [chats, setChats] = useState([]);

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

    /**
     * @typedef {Object} Data
     * @property {number} chatId
     * @param {Data} data
     */
    const addNewMessage = (data) => {
        setChats((prev) =>
            prev.map((chat) =>
                chat.id === data.chatId && activeChatId !== chat.id
                    ? { ...chat, unreadCount: chat.unreadCount + 1 }
                    : chat,
            ),
        );
    };

    /** @param {{id: number, title: string}} newChatData */
    const addChat = async (newChatData) => {
        setChats((prev) => [{ id: newChatData.id, title: newChatData.title }, ...prev]);
    };

    const deleteChat = (chatData) => {
        debugger;
        setChats((prev) => prev.filter((chat) => chat.id !== chatData.chatId));
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

    return { chats, addChat, deleteChat, lastReadMessages, setLastReadMessage, addNewMessage, unreadCount };
}

export default useChats;
