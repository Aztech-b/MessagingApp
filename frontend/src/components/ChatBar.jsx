import styles from "../styles/chatBar.module.css";
import { Button } from "@mantine/core";
import { Link } from "react-router";
import groupIcon from "../assets/users-round.svg";
import { useEffect, useState } from "react";
import { useUserContext } from "./Context";

function ChatBar() {
    const [chats, setChats] = useState([]);
    return (
        <div className={styles.chats}>
            <Button
                variant="filled"
                color="accent.3"
                onClick={async () => {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title: "new Chat" }),
                    });
                    const data = await response.json();
                    console.log(data);
                    setChats((prev) => [{ id: data.id, title: data.title }, ...prev]);
                }}
            >
                New Chat
            </Button>
            {chats.map((chat, index) => (
                <Chat id={chat.id} chatName={chat.title} key={index} />
            ))}
        </div>
    );
}

function Chat({ id, chatName, icon, setActiveChatId, setMessages }) {
    if (!icon) {
        icon = groupIcon;
    }
    async function handleChatClick() {
        useEffect(() => {
            async function GetChatData() {
                try {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/${id}`, {
                        method: "GET",
                        credentials: "include",
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error("response is not ok");
                    }
                } catch (error) {
                    console.log(error);
                }
            }
        }, []);
    }
    return (
        <Link to={`/chat/${id}`} className={styles.chatLink}>
            <button className={styles.chatButton}>
                <img src={groupIcon} className={styles.icon} />
                <p className={styles.chatName}>{chatName}</p>
            </button>
        </Link>
    );
}

export default ChatBar;
