import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import styles from "../styles/chat.module.css";
import { TextInput } from "@mantine/core";
import { useUserContext } from "./Context";

function Chat() {
    const [messages, setMessages] = useState([]);
    const chatId = useParams().id;
    const scrollDummy = useRef();
    const { user } = useUserContext();
    useEffect(() => {
        scrollDummy.current.scrollTo({ top: scrollDummy.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        setMessages([]);
        async function GetChatData() {
            try {
                if (!user) {
                    return;
                }
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/${chatId}`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                setMessages(data.messages);
                if (!response.ok) {
                    throw new Error("response is not ok");
                }
            } catch (error) {}
        }
        GetChatData();
    }, [chatId, user]);
    return (
        <div className={styles.messages}>
            <div className={styles.messagesContainer} ref={scrollDummy}>
                <div className={styles.chat}>
                    {messages.map((message, index) => {
                        return (
                            <Message username={message.author.username} messageContent={message.content} key={index} />
                        );
                    })}
                </div>
            </div>
            <TextInput
                size="md"
                radius={2}
                placeholder="Write you message here..."
                styles={{ input: { backgroundColor: "var(--accent)", border: 0, flexShrink: 0 } }}
                onKeyDown={async (e) => {
                    if (e.target.value == "") {
                        return;
                    }
                    if (e.key !== "Enter") {
                        return;
                    }
                    const content = e.target.value;
                    setMessages((prev) => [...prev, { content: content, author: { username: user.username } }]);
                    try {
                        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/${chatId}/message`, {
                            method: "POST",
                            credentials: "include",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ content }),
                        });
                        const data = await response.json();
                    } catch (error) {
                        console.log(error);
                    }
                    e.target.value = "";
                }}
            ></TextInput>
        </div>
    );
}

function Message({ username, messageContent }) {
    let authorStyle;
    let isauthorMe;
    const user = useUserContext();
    let otherUsernameColor = null;
    if (user && user.user && username === user.user.username) {
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

export default Chat;
