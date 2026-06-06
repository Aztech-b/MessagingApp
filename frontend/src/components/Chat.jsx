import { useEffect, useState, useRef, forwardRef } from "react";
import { useParams, useOutletContext } from "react-router";
import styles from "../styles/chat.module.css";
import { Button, TextInput } from "@mantine/core";
import { useUserContext } from "./Context";
import socket from "./socket.js";
import ChatInput from "./ChatInput";
import { LoaderCircle, Check, CheckCheck, Type } from "lucide-react";
import Message from "./Message.jsx";

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
        if (messages.length > 0) {
            lastMessageId.current = messages[messages.length - 1].id;
        }
    }, [messages]);

    useEffect(() => {
        if (!isBottom) {
            return;
        }
        if (lastReadMessageId.current === lastMessageId.current) {
            return;
        }
        if (messages[messages.length - 1].author.username === user.username) {
            return;
        }

        socket.emit(
            "readMessage",
            { messageId: messages[messages.length - 1].id, chatId, username: user.username },
            () => {
                console.log(messages[messages.length - 1].id);
                lastReadMessageId.current = lastMessageId.current;
            },
        );
    }, [isBottom, messages]);

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
        if (!socket || !user) {
            return;
        }
        function handleRead(data) {
            setMessages((prev) => {
                return prev.map((message) => {
                    return message.id <= data.messageId && message.author.username === user.username
                        ? { ...message, status: "read" }
                        : message;
                });
            });
        }

        socket.on("everyoneReadMessage", handleRead);
        return () => {
            socket.off("everyoneReadMessage", handleRead);
        };
    }, [socket, user]);

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
                setMessages(
                    messagesFromDatabase.map((message) => {
                        if (data.allReadMessageId >= message.id && message.author.username === user.username) {
                            return { ...message, status: "read" };
                        }
                        return message;
                    }),
                );
                setActiveChatName(data.title);
                lastReadMessageId.current = data.lastReadMessageId;
            } catch (error) {
                console.error(error);
            }
        }
        GetChatData();
    }, [chatId, user]);

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

export default Chat;
