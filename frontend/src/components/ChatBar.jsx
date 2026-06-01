import styles from "../styles/chatBar.module.css";
import { Button } from "@mantine/core";
import { Link } from "react-router";
import groupIcon from "../assets/users-round.svg";

function ChatBar({ chatsState, activeChatIdState }) {
    return (
        <div className={styles.chats}>
            <Button
                variant="filled"
                color="accent.3"
                onClick={() => {
                    // CreateChat("New Chat");
                    chatsState.setChats((prev) => [{ id: 2, title: "new Chat" }, ...prev]);
                }}
            >
                New Chat
            </Button>
            {chatsState &&
                chatsState.chats.map((chat, index) => <Chat id={chat.id} chatName={chat.title} key={index} />)}
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
        <Link to={`/chat/${id}`}>
            <button className={styles.chat}>
                <img src={groupIcon} className={styles.icon} />
                <p className="chatName">{chatName}</p>
            </button>
        </Link>
    );
}

export default ChatBar;
