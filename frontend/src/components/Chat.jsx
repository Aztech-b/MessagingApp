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
    const shouldScrollRef = useRef(false);

    // TODO: to mark read messages when scroll all the way to the bottom.
    function IsNearBottom() {
        const container = scrollDummy.current;

        return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    }

    useEffect(() => {
        if (!shouldScrollRef.current) {
            return;
        }
        scrollDummy.current.scrollTo({ top: scrollDummy.current.scrollHeight, behavior: "auto" });
        shouldScrollRef.current = false;
    }, [messages]);

    useEffect(() => {
        socket.on("newMessage", (data) => {
            if (data.chatId !== chatId) {
                return;
            }
            const shouldScroll = IsNearBottom();
            shouldScrollRef.current = shouldScroll;
            setMessages((prev) => [...prev, data]);
        });
        return () => {
            socket.off("newMessage");
        };
    }, [chatId]);

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
                                key={message.id}
                                extended={array[index - 1]?.author.username !== message.author.username}
                            />
                        );
                    })}
                </div>
            </div>
            <ChatInput setMessages={setMessages} shouldScrollRef={shouldScrollRef}></ChatInput>
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
