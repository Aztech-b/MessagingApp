import { useEffect, useState, useRef, forwardRef } from "react";
import { useParams, useNavigate } from "react-router";
import styles from "../styles/chat.module.css";
import { Button, TextInput } from "@mantine/core";
import socket from "./socket.js";
import ChatInput from "./ChatInput";
import { LoaderCircle, Check, CheckCheck, Type } from "lucide-react";
import Message from "./Message.jsx";
import { useMergedRef, useStateHistory } from "@mantine/hooks";
import useCurrentMessages from "../hooks/useCurrentMessages.jsx";
import useScroll from "../hooks/useScroll.jsx";
import { useUserContext } from "./Context.jsx";
import useCurrentMessagesSockets from "../hooks/useCurrentMessagesSockets.jsx";

/**
 * @typedef {import("./types.js").ChatData} ChatData
 */

function Chat() {
    const chatId = Number(useParams().id);
    const { user } = useUserContext();
    const { messages, members, setMessages, isBottom, setIsBottom } = useCurrentMessages(chatId, user);
    const { shouldAutoScroll, autoScroll, scrollContainer } = useScroll();
    useCurrentMessagesSockets(shouldAutoScroll, user, chatId, scrollContainer, setMessages);

    const lastMessageRef = useRef(null);
    const navigate = useNavigate();

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
                    <div ref={autoScroll}></div>
                </div>
            </div>
            <ChatInput setMessages={setMessages} shouldAutoScroll={shouldAutoScroll}></ChatInput>
        </>
    );
}

export default Chat;
