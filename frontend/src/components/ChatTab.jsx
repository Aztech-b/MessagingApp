import { useState, useEffect, createContext, useContext } from "react";
import { useUserContext } from "./Context";
import Sidebar from "./Sidebar";
import ChatBar from "./ChatBar";
import { Outlet } from "react-router";
import styles from "../styles/chatTab.module.css";
import { ChatContextProvider } from "./Context";
import socket from "./socket.js";
/** @typedef {import("./types.js").Chat} Chat */

const UnreadMessageContext = createContext(null);

export function useUnreadMessagesContext() {
    return useContext(UnreadMessageContext);
}
function ChatTab() {
    const [activeChatId, setActiveChatId] = useState();

    /** @type {[Chat[], Function]} */
    const [chats, setChats] = useState([]);
    const [activeChatName, setActiveChatName] = useState("");

    /**@type {{[id]: number}[]} */
    const unreadMessages = chats?.reduce((acc, chat) => {
        acc[chat.id] = chat.unreadCount;
        return acc;
    }, {});
    console.log(chats);
    console.log(unreadMessages);

    useEffect(() => {
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
                // console.log(data);
                setChats(data);
            } catch (error) {}
        }
        GetAllChats();
    }, []);

    useEffect(() => {
        if (!chats || chats.length === 0) {
            return;
        }
        for (let i = 0; i < chats.length; i++) {
            const id = chats[i].id;
            socket.emit("join", { chatId: id });
        }
    }, [chats]);

    return (
        <>
            <ChatContextProvider value={{ chats, setChats }}>
                <UnreadMessageContext value={unreadMessages}>
                    <ChatBar></ChatBar>
                    <div className={styles.messages}>
                        <TopBar chatName={activeChatName} />
                        <Outlet context={{ setActiveChatName }}></Outlet>
                    </div>
                </UnreadMessageContext>
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
