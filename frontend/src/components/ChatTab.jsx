import { useState, useEffect, createContext, useContext } from "react";
import { useUserContext } from "./Context";
import Sidebar from "./Sidebar";
import ChatBar from "./ChatBar";
import { Outlet } from "react-router";
import styles from "../styles/chatTab.module.css";

const UnreadMessageContext = createContext(null);

export function useUnreadMessagesContext() {
    return useContext(UnreadMessageContext);
}
function ChatTab() {
    const [activeChatId, setActiveChatId] = useState();
    const [activeChatName, setActiveChatName] = useState("");
    /**
     * @type {[{id: number}[], Function]}
     */
    const [unreadMessages, setUnreadMessages] = useState({});

    return (
        <>
            <UnreadMessageContext value={{ unreadMessages, setUnreadMessages }}>
                <ChatBar></ChatBar>
                <div className={styles.messages}>
                    <TopBar chatName={activeChatName} />
                    <Outlet context={{ setActiveChatName }}></Outlet>
                </div>
            </UnreadMessageContext>
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
