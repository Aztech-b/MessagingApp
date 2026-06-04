import { useState, useEffect } from "react";
import { useUserContext } from "./Context";
import Sidebar from "./Sidebar";
import ChatBar from "./ChatBar";
import { Outlet } from "react-router";
import styles from "../styles/chatTab.module.css";

function ChatTab() {
    const [activeChatId, setActiveChatId] = useState();
    const [activeChatName, setActiveChatName] = useState("");

    return (
        <>
            <ChatBar></ChatBar>
            <div className={styles.messages}>
                <TopBar chatName={activeChatName} />
                <Outlet context={{ setActiveChatName }}></Outlet>
            </div>
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
