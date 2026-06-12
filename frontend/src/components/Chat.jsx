import { useEffect, useState, useRef, forwardRef } from "react";
import { useParams } from "react-router";
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
import useMessageOptimization from "../hooks/useMessageOptimization.jsx";

/**
 * @typedef {import("./types.js").ChatData} ChatData
 */

function Chat() {
    const chatId = Number(useParams().id);
    const { user } = useUserContext();
    const { messages, members, setMessages, isBottom } = useCurrentMessages(chatId, user);
    const { shouldAutoScroll, autoScroll, scrollContainer } = useScroll();
    useCurrentMessagesSockets(shouldAutoScroll, user, chatId, scrollContainer, setMessages);

    const { handleScroll } = useMessageOptimization(scrollContainer, messages, setMessages, chatId);
    const lastMessageRef = useRef(null);

    return (
        <>
            <div
                className={styles.messagesContainer}
                ref={scrollContainer}
                onScroll={() => {
                    handleScroll();
                    if (!lastMessageRef.current) return;
                    isBottom.current =
                        lastMessageRef.current.getBoundingClientRect().top <=
                        scrollContainer.current.getBoundingClientRect().bottom;
                    // did not want to write something like setIsBottom(that if condition) as isBottom gets rerendered every scroll(seems like a bit expensive)
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
