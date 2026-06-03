import { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext } from "react-router";
import styles from "../styles/chat.module.css";
import { Button, TextInput } from "@mantine/core";
import { useUserContext } from "./Context";
import socket from "./socket.js";
import ChatInput from "./ChatInput";

function Chat() {
    const setActiveChatName = useOutletContext().setActiveChatName;
    const [messages, setMessages] = useState([]);
    const scrollDummy = useRef();
    const { user } = useUserContext();
    const chatId = Number(useParams().id);

    useEffect(() => {
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
    }, [chatId]);

    return (
        <>
            <div className={styles.messagesContainer} ref={scrollDummy}>
                <div className={styles.chat}>
                    {messages.map((message, index, array) => {
                        return (
                            <Message
                                username={message.author.username}
                                messageContent={message.content}
                                key={index}
                                extended={array[index - 1]?.author.username !== message.author.username}
                            />
                        );
                    })}
                </div>
            </div>
            <ChatInput setMessages={setMessages}></ChatInput>
        </>
    );
}

function Message({ username, messageContent, extended }) {
    let authorStyle;
    const user = useUserContext();
    let otherUsernameColor = null;
    if (user && user.user && username === user.user.username) {
        authorStyle = styles.clientMessage;
        extended = false;
    } else {
        otherUsernameColor = GenerateRandomColor();
        authorStyle = styles.otherMessage;
    }
    return (
        <div className={`${styles.message} ${authorStyle}`}>
            {extended ? <p style={{ color: otherUsernameColor }}>{username}</p> : null}
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
