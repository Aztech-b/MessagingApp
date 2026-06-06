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

        socket.emit(
            "readMessage",
            { messageId: messages[messages.length - 1].id, chatId, username: user.username },
            () => {
                console.log(messages[messages.length - 1].id);
                lastReadMessageId.current = lastMessageId.current;
            },
        );

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
                        // console.log(status);
                    }
                    // console.log({ ...message, status });
                    return { ...message, status };
                });
                console.log(messagesFromDatabase);
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

export default Chat;
