import { useState, useEffect } from "react";
import socket from "../components/socket.js";
/** @typedef {import("../components/types.js").Chat} */

function useChats() {
    /** @type {[Chat[], Function]} */
    const [chats, setChats] = useState([]);

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

    return { chats, addChat, setLastReadMessage };
}

export default useChats;
