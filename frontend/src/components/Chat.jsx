import { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext } from "react-router";
import styles from "../styles/chat.module.css";
import { Button, TextInput, ActionIcon } from "@mantine/core";
import { useUserContext } from "./Context";
import socket from "./socket";
import { Send, SendHorizontal } from "lucide-react";

function Chat() {
    const setActiveChatName = useOutletContext().setActiveChatName;
    const [messages, setMessages] = useState([]);
    const chatId = Number(useParams().id);
    const scrollDummy = useRef();
    const { user } = useUserContext();
    const [canSend, setCanSend] = useState(false);
    const [typedMessage, setTypedMessage] = useState("");

    useEffect(() => {
        socket.emit("join", { chatId });
        socket.on("newMessage", (data) => {
            setMessages((prev) => [...prev, data]);
        });
        return () => {
            socket.off("newMessage");
        };
    }, []);
    useEffect(() => {
        scrollDummy.current.scrollTo({ top: scrollDummy.current.scrollHeight, behavior: "auto" });
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
                setActiveChatName(data.title);
                if (!response.ok) {
                    throw new Error("response is not ok");
                }
            } catch (error) {}
        }
        GetChatData();
    }, [chatId, user]);

    async function SendMessage() {
        if (typedMessage === "") {
            return;
        }
        const content = typedMessage;
        setMessages((prev) => [...prev, { content: content, author: { username: user.username } }]);
        socket.emit("message", { content, chatId });
        setTypedMessage("");
        setCanSend(false);
    }

    return (
        <>
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
                value={typedMessage}
                size="md"
                radius={2}
                placeholder="Write you message here..."
                styles={{ input: { backgroundColor: "var(--accent)", border: 0, flexShrink: 0 } }}
                rightSection={
                    <SendButton
                        isActive={canSend}
                        onClick={(e) => {
                            SendMessage();
                        }}
                    />
                }
                rightSectionPointerEvents="all"
                onChange={(e) => {
                    setTypedMessage(e.target.value);
                    setCanSend(e.target.value !== "");
                }}
                onKeyDown={(e) => {
                    if (e.key !== "Enter") {
                        return;
                    }
                    SendMessage();
                }}
            ></TextInput>
        </>
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

function SendButton({ isActive, onClick }) {
    const inactiveColor = "#6b6375";
    const activeColor = "var(--accent-light-2xl)";
    return (
        <ActionIcon variant="transparent" onClick={onClick}>
            <SendHorizontal color={isActive ? activeColor : inactiveColor} />
        </ActionIcon>
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
