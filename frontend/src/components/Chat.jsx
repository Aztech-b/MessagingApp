import { useEffect, useState, useRef, forwardRef } from "react";
import { useParams, useOutletContext } from "react-router";
import styles from "../styles/chat.module.css";
import { Button, TextInput } from "@mantine/core";
import { useUserContext } from "./Context";
import socket from "./socket.js";
import ChatInput from "./ChatInput";
import { LoaderCircle, Check, CheckCheck, Type } from "lucide-react";
import Message from "./Message.jsx";
import { useStateHistory } from "@mantine/hooks";
import { useChatContext } from "./Context";

/**
 * @typedef {import("./types.js").newMessageData} newMessageData
 * @typedef {import("./types.js").ChatData} ChatData
 */

function Chat() {
    const chatId = Number(useParams().id);
    const { user } = useUserContext();
    const { chats } = useChatContext();

    const setActiveChatName = useOutletContext().setActiveChatName;
    const [messages, setMessages] = useState([]);
    /**
     * @type {[{ color: string, user: { username: string } }[]]}
     */
    const [members, setMembers] = useState(null);

    const [isBottom, setIsBottom] = useState(false);
    const shouldScrollRef = useRef(true);
    const scrollContainer = useRef();

    const lastMessageRef = useRef(null);
    const lastMessageId = useRef(0);
    const { lastReadMessages, setLastReadMessage } = useChatContext();
    const lastReadMessageId = lastReadMessages ? lastReadMessages[chatId] : null;
    // console.log(lastMessageId);

    function IsNearBottom() {
        const container = scrollContainer.current;

        return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    }

    useEffect(
        function SetLastMessageRef() {
            if (messages.length > 0) {
                lastMessageId.current = messages[messages.length - 1].id;
            }
        },
        [messages],
    );

    useEffect(
        function OnClientReadMessage() {
            if (!isBottom) {
                return;
            }
            if (lastReadMessageId === lastMessageId.current) {
                return;
            }
            if (messages[messages.length - 1]?.author?.username === user?.username) {
                return;
            }

            socket.emit(
                "readMessage",
                { messageId: messages[messages.length - 1].id, chatId, username: user.username },
                () => {
                    setLastReadMessage(chatId, lastMessageId.current, true);
                },
            );
        },
        [isBottom, messages],
    );

    useEffect(
        function ScrollHandle() {
            if (!shouldScrollRef.current) {
                return;
            }
            scrollContainer.current.scrollTo({ top: scrollContainer.current.scrollHeight, behavior: "auto" });
            shouldScrollRef.current = false;
        },
        [messages, chatId],
    );

    useEffect(
        function OnReceiveNewMessage() {
            /** @param {newMessageData} data */
            function handleNewMessage(data) {
                if (data.chatId !== chatId || data.author.username === user.username) {
                    return;
                }
                const shouldScroll = IsNearBottom();
                shouldScrollRef.current = shouldScroll;
                setMessages((prev) => [...prev, { ...data, status: "other" }]);
            }

            socket.on("newMessage", handleNewMessage);
            return () => {
                socket.off("newMessage", handleNewMessage);
            };
        },
        [chatId],
    );

    useEffect(
        function OnOurMessageIsRead() {
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
        },
        [socket, user],
    );

    useEffect(
        function FetchData() {
            if (!user) {
                return;
            }
            async function GetChatData() {
                try {
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/${chatId}`, {
                        method: "GET",
                        credentials: "include",
                    });

                    /** @type {ChatData} */
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
                    const { members } = data;
                    setMembers(members);
                    setActiveChatName(data.title);
                    setLastReadMessage(chatId, data.chatMember.lastReadMessageId);
                } catch (error) {
                    console.error(error);
                }
            }
            GetChatData();
        },
        [chatId, user],
    );

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
                                colors={members}
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
