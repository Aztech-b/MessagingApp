import styles from "../styles/home.module.css";
import groupIcon from "../assets/users-round.svg";
import { TextInput, Button } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "./Context";

function Home() {
    let [messages, setMessages] = useState([
        { username: "Ali", content: "I am good" },
        { username: "me", content: "hi, how are you? " },
    ]);

    const [chats, setChats] = useState([]);
    const [activeChatId, setActiveChatId] = useState();

    const scrollDummy = useRef();

    useEffect(() => {
        scrollDummy.current.scrollTo({ top: scrollDummy.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

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
        <div className={styles.home}>
            <div className={styles.chats}>
                <Button
                    variant="filled"
                    color="accent.3"
                    onClick={() => {
                        // CreateChat("New Chat");
                        setChats((prev) => [{ id: 2, title: "new Chat" }, ...prev]);
                    }}
                >
                    New Chat
                </Button>
                {chats.map((chat, index) => (
                    <Chat
                        id={chat.id}
                        chatName={chat.title}
                        key={index}
                        setActiveChatId={setActiveChatId}
                        setMessages={setMessages}
                    />
                ))}
            </div>
            <div className={styles.messages}>
                <TopBar chatName="Bakdaulet" />
                <div className={styles.messagesContainer} ref={scrollDummy}>
                    <div className={styles.chat}>
                        {messages.map((message, index) => {
                            return <Message username={message.username} messageContent={message.content} key={index} />;
                        })}
                    </div>
                </div>
                <TextInput
                    size="md"
                    radius={2}
                    placeholder="Write you message here..."
                    styles={{ input: { backgroundColor: "var(--accent)", border: 0, flexShrink: 0 } }}
                    onKeyDown={(e) => {
                        if (e.target.value == "") {
                            return;
                        }
                        if (e.key === "Enter") {
                            const content = e.target.value;
                            setMessages((prev) => [...prev, { username: "me", content: content }]);
                            e.target.value = "";
                        }
                    }}
                ></TextInput>
            </div>
        </div>
    );
}

/**
 *
 * @returns `hsl(${hue}, ${saturation}%, ${lightness}%)`
 * hue is completely random,
 * satutarion is from 70 to 90,
 * lightness is from 80 to 90
 */
function GenerateRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 20) + 70;
    const lightness = Math.floor(Math.random() * 10) + 80;
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function TopBar({ chatName }) {
    return (
        <div className={styles.topBar}>
            <p className="chatName">{chatName}</p>
        </div>
    );
}

function Message({ username, messageContent }) {
    let authorStyle;
    let isauthorMe;
    let otherUsernameColor = null;
    if (username === "me") {
        authorStyle = styles.clientMessage;
        isauthorMe = true;
    } else {
        otherUsernameColor = GenerateRandomColor();
        authorStyle = styles.otherMessage;
        isauthorMe = false;
    }
    return (
        <div className={`${styles.message} ${authorStyle}`}>
            {isauthorMe ? null : <p style={{ color: otherUsernameColor }}>{username}</p>}
            <p className="text">{messageContent}</p>
        </div>
    );
}

function Chat({ id, chatName, icon, setActiveChatId, setMessages }) {
    if (!icon) {
        icon = groupIcon;
    }
    function handleChatClick() {
        useEffect(async () => {
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
        }, []);
    }
    return (
        <button
            className={styles.chat}
            onClick={() => {
                setActiveChatId(id);
                setMessages([
                    { username: generateRandomString(5), content: generateRandomString(50) },
                    { username: generateRandomString(5), content: generateRandomString(51) },
                    { username: generateRandomString(5), content: generateRandomString(52) },
                ]);
            }}
        >
            <img src={groupIcon} className={styles.icon} />
            <p className="chatName">{chatName}</p>
        </button>
    );
}

function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export default Home;
