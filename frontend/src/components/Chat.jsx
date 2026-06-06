import { useEffect, useState, useRef, forwardRef } from "react";
import { useParams, useOutletContext } from "react-router";
import styles from "../styles/chat.module.css";
import { Button, TextInput } from "@mantine/core";
import { useUserContext } from "./Context";
import socket from "./socket.js";
import ChatInput from "./ChatInput";
import { LoaderCircle, Check, CheckCheck } from "lucide-react";

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

    useEffect(() => {
        setMessages([]);
        async function GetChatData() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/${chatId}`, {
                    method: "GET",
                    credentials: "include",
                });
                let data = await response.json();
                const messagesFromDatabase = data.messages.map((message) => {
                    if (message.status) {
                        return;
                    }
                    let status = "";
                    if (message.author.username === user.username) {
                        status = "sent";
                    }
                    return { ...message, status };
                });
                setMessages(messagesFromDatabase);
                setActiveChatName(data.title);
                lastReadMessageId.current = data.lastReadMessageId;
                if (!response.ok) {
                    throw new Error("response is not ok");
                }
            } catch (error) {}
        }
        GetChatData();
    }, [chatId]);

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
                                username={message.author.username}
                                messageContent={message.content}
                                key={message.id}
                                id={message.id}
                                extended={array[index - 1]?.author.username !== message.author.username}
                                ref={index === array.length - 1 ? lastMessageRef : null}
                                state={message.status}
                            />
                        );
                    })}
                </div>
            </div>
            <ChatInput setMessages={setMessages} shouldScrollRef={shouldScrollRef}></ChatInput>
        </>
    );
}

/**
 *
 * @param {String} username username to display
 * @param {String} messageContent content to dispay
 * @param {Boolean} extended true to show the username, false to hise the username.
 * @param {"sending" | "sent" | "read"} state state of the message, changes the icon in the bottom
 */
const Message = forwardRef(function Message({ username, messageContent, state, id, extended }, ref) {
    let icon;
    if (state === "sending") {
        icon = <LoaderCircle size={16} />;
    } else if (state === "sent") {
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
        <div className={`${styles.message} ${authorStyle}`} ref={ref}>
            {extended ? <p style={{ color: otherUsernameColor }}>{username}</p> : null}
            <p className="text">{messageContent}</p>
            {icon}
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
