import { useEffect, useState, useRef, forwardRef } from "react";
import { useParams, useOutletContext } from "react-router";
import styles from "../styles/chat.module.css";
import { Button, TextInput } from "@mantine/core";
import { useUserContext } from "./Context";
import socket from "./socket.js";
import ChatInput from "./ChatInput";
import { LoaderCircle, Check, CheckCheck, Type } from "lucide-react";

function Chat() {
    const chatId = Number(useParams().id);
    const { user } = useUserContext();

    const setActiveChatName = useOutletContext().setActiveChatName;
    const [messages, setMessages] = useState([]);

    const [isBottom, setIsBottom] = useState(false);
    const shouldScrollRef = useRef(true);
    const scrollContainer = useRef();

    const lastMessageRef = useRef(null);
    const lastMessageId = useRef(0);
    const lastReadMessageId = useRef(-1);

    function IsNearBottom() {
        const container = scrollContainer.current;

        return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    }

    useEffect(() => {
        if (!isBottom) {
            return;
        }
        if (lastReadMessageId.current === lastMessageId.current) {
            return;
        }
        if (messages[messages.length - 1].status === "sending") {
            return;
        }

        console.log("read event");

        socket.emit("readMessage", { lastMessageId: lastMessageId.current, chatId, username: user.username }, () => {
            console.log(lastMessageId.current);
            lastReadMessageId.current = lastMessageId.current;
        });

        console.log("bottom");
    }, [isBottom]);

    useEffect(() => {
        if (!shouldScrollRef.current) {
            return;
        }
        scrollContainer.current.scrollTo({ top: scrollContainer.current.scrollHeight, behavior: "auto" });
        shouldScrollRef.current = false;
    }, [messages, chatId]);

    useEffect(() => {
        socket.on("newMessage", (data) => {
            if (data.chatId !== chatId) {
                return;
            }
            const shouldScroll = IsNearBottom();
            shouldScrollRef.current = shouldScroll;
            setMessages((prev) => [...prev, { ...data, status: "other" }]);
        });
        return () => {
            socket.off("newMessage");
        };
    }, [chatId]);

    // fetch
    useEffect(() => {
        async function GetChatData() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/${chatId}`, {
                    method: "GET",
                    credentials: "include",
                });
                let data = await response.json();
                const messagesFromDatabase = data.messages.map((message) => {
                    let status = "";
                    if (message.author.username === user?.username) {
                        status = "sent";
                    }
                    return { ...message, status };
                });
                if (!response.ok) {
                    throw new Error("response is not ok");
                }
                setMessages(messagesFromDatabase);
                setActiveChatName(data.title);
                lastReadMessageId.current = data.lastReadMessageId;
            } catch (error) {
                console.error(error);
            }
        }
        GetChatData();
    }, [chatId, user]);

    useEffect(() => {
        if (messages.length > 0) {
            lastMessageId.current = messages[messages.length - 1].id;
        }
    }, [messages]);

    return (
        <>
            <div
                className={styles.messagesContainer}
                ref={scrollContainer}
                onScroll={() => {
                    if (!lastMessageRef.current) return;
                    setIsBottom(
                        lastMessageRef.current.getBoundingClientRect().top <=
                            scrollContainer.current.getBoundingClientRect().bottom,
                    );
                }}
            >
                <div className={styles.chat}>
                    {messages.map((message, index, array) => {
                        return (
                            <Message
                                data={message}
                                key={message.id}
                                extended={array[index - 1]?.author.username !== message.author.username}
                                ref={index === array.length - 1 ? lastMessageRef : null}
                            />
                        );
                    })}
                </div>
            </div>
            <ChatInput setMessages={setMessages} shouldScrollRef={shouldScrollRef}></ChatInput>
        </>
    );
}

const Message = forwardRef(function Message({ data, extended }, ref) {
    let icon = useRef(null);
    const { content, id } = data;
    const username = data.author.username;
    const [status, setStatus] = useState(data.status);
    useEffect(() => {
        if (status === "sending") {
            icon.currrent = <LoaderCircle color="var(--accent-light-2xl)" size={16} />;
        } else if (status === "sent") {
            icon.currrent = <Check color="var(--accent-light-2xl)" size={16} />;
        } else if (status === "read") {
            icon.currrent = <CheckCheck color="var(--accent-light-2xl)" size={16} />;
        }
    }, [status]);
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
    const sent = new Date(data.sent).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    return (
        <div className={`${styles.message} ${authorStyle}`} ref={ref}>
            {extended ? <p style={{ color: otherUsernameColor }}>{username}</p> : null}
            <div className={styles.messageContent}>
                <p className={styles.content}>{content}</p>
                <div className={styles.info}>
                    <p className={styles.date}>{sent || null}</p>
                    {icon.currrent}
                </div>
            </div>
        </div>
    );
});

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
