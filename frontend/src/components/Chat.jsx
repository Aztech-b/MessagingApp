import { useEffect, useState, useRef } from "react";
import { useParams, useOutletContext } from "react-router";
import styles from "../styles/chat.module.css";
import { Button, TextInput } from "@mantine/core";
import { useUserContext } from "./Context";
import socket from "./socket.js";
import ChatInput from "./ChatInput";
import { LoaderCircle, Check, CheckCheck } from "lucide-react";

function Chat() {
    const setActiveChatName = useOutletContext().setActiveChatName;
    const [messages, setMessages] = useState([]);
    const scrollContainer = useRef();
    const { user } = useUserContext();
    const chatId = Number(useParams().id);
    const shouldScrollRef = useRef(true);
    const newestMessageRef = useRef(null);
    const [sendingMessages, setSendingMessages] = useState([]);

    function IsNearBottom() {
        const container = scrollContainer.current;

        return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    }

    // useEffect(() => {
    //     if (!newestMessageRef.current) return;

    //     const observer = new IntersectionObserver(
    //         ([entry]) => {
    //             if (entry.isIntersecting) {
    //                 console.log("user has seen newest message");
    //             }
    //         },
    //         { root: scrollContainer.current, threshold: 1 },
    //     );

    //     observer.observe(newestMessageRef.current);

    //     return () => observer.disconnect();
    // }, [messages]);

    useEffect(() => {
        if (!shouldScrollRef.current) {
            console.log("should not scroll");
            return;
        }
        scrollContainer.current.scrollTo({ top: scrollContainer.current.scrollHeight, behavior: "auto" });
        shouldScrollRef.current = false;
    }, [messages, sendingMessages]);

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
            <div className={styles.messagesContainer} ref={scrollContainer}>
                <div className={styles.chat}>
                    {messages.map((message, index, array) => {
                        return (
                            <Message
                                username={message.author.username}
                                messageContent={message.content}
                                key={message.id}
                                extended={array[index - 1]?.author.username !== message.author.username}
                                ref={
                                    index === array.length - 1 && sendingMessages.length === 0 ? newestMessageRef : null
                                }
                                state={"delivered"}
                            />
                        );
                    })}
                    <div className={`${styles.chat} ${styles.delivaringMessages}`}>
                        {sendingMessages.map((message, index, array) => {
                            return (
                                <Message
                                    username={message.author.username}
                                    messageContent={message.content}
                                    key={message.tempId}
                                    extended={array[index - 1]?.author.username !== message.author.username}
                                    state={"delivering"}
                                    ref={
                                        index === array.length - 1 && sendingMessages.length !== 0
                                            ? newestMessageRef
                                            : null
                                    }
                                />
                            );
                        })}
                    </div>
                </div>
            </div>
            <ChatInput
                setSendingMessages={setSendingMessages}
                setMessages={setMessages}
                shouldScrollRef={shouldScrollRef}
            ></ChatInput>
        </>
    );
}

function Message({ username, messageContent, extended, state }) {
    let icon;
    if (state === "delivering") {
        icon = <LoaderCircle size={16} />;
    } else if (state === "delivered") {
        icon = <Check size={16} />;
    } else if (state === "read") {
        icon = <CheckCheck size={16} />;
    }
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
            {icon}
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
