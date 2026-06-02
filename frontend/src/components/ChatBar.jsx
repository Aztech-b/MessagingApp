import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Button, TextInput } from "@mantine/core";
import { useUserContext } from "./Context";
import styles from "../styles/chatBar.module.css";
import groupIcon from "../assets/users-round.svg";

function ChatBar() {
    const [chats, setChats] = useState([]);
    const { user } = useUserContext();
    const [chatName, setChatName] = useState("");
    const [chatMembers, setChatMembers] = useState("");

    useEffect(() => {
        if (!user) {
            return;
        }
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
    }, [user]);
    return (
        <div className={styles.chats}>
            <Button variant="filled" color="accent.3" popoverTarget="newChat">
                New Chat
            </Button>
            <div className={styles.newChat} popover="auto" id="newChat">
                <form>
                    <TextInput
                        styles={{ input: { backgroundColor: "var(--accent)", border: 0 } }}
                        label="member username: "
                        onChange={(e) => {
                            setChatMembers([e.target.value]);
                        }}
                    ></TextInput>
                    <TextInput
                        label="Chat Name: "
                        styles={{ input: { backgroundColor: "var(--accent)", border: 0 } }}
                        onChange={(e) => {
                            setChatName(e.target.value);
                        }}
                    ></TextInput>
                    <Button
                        onClick={async (e) => {
                            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
                                method: "POST",
                                credentials: "include",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ title: chatName, members: chatMembers }),
                            });
                            const data = await response.json();
                            console.log(data);
                            setChats((prev) => [{ id: data.id, title: data.title }, ...prev]);
                        }}
                    >
                        Create New Chat
                    </Button>
                </form>
            </div>
            {chats.map((chat) => (
                <Chat id={chat.id} title={chat.title} key={chat.id} />
            ))}
        </div>
    );
}

function Chat({ id, title, icon }) {
    if (!icon) {
        icon = groupIcon;
    }
    return (
        <Link to={`/chat/${id}`} className={styles.chatLink}>
            <button className={styles.chatButton}>
                <img src={groupIcon} className={styles.icon} />
                <p className={styles.chatName}>{title}</p>
            </button>
        </Link>
    );
}

export default ChatBar;
