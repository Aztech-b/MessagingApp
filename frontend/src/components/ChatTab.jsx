import { useState, useEffect } from "react";
import { useUserContext } from "./Context";
import Sidebar from "./Sidebar";
import ChatBar from "./ChatBar";
import { Outlet } from "react-router";
import styles from "../styles/chatTab.module.css";

function ChatTab() {
    const [activeChatId, setActiveChatId] = useState();
    const [activeChatName, setActiveChatName] = useState("");
    // TODO make chat buttons work
    function CreateChat() {
        useEffect(() => {
            async function SendData(chatName) {
                try {
                    const { user } = useUserContext();
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/new`, {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify({ membersId: [user.id], chatName }),
                    });
                    const data = await response.json();
                    console.log(data);
                    if (!response.ok) {
                        throw new Error("response is not ok");
                    }
                    setChats((prev) => [...prev, data]);
                } catch (error) {
                    console.log(error);
                }
            }
            // SendData();
        }, []);
    }
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
