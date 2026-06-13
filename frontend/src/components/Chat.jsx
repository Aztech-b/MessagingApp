import { useRef } from "react";
import { useParams } from "react-router";
import styles from "../styles/chat.module.css";
import ChatInput from "./ChatInput";
import Message from "./Message.jsx";
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
    const { autoScrollDummy, scrollContainer, setShouldScroll } = useScroll();
    const { messages, members, setMessages, setIsBottom, sendMessage, addMessage } = useCurrentMessages(
        chatId,
        user,
        setShouldScroll,
    );
    useCurrentMessagesSockets(user, chatId, scrollContainer, addMessage);

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
                    <div ref={autoScrollDummy}></div>
                </div>
            </div>
            <ChatInput setMessages={setMessages} sendMessage={sendMessage}></ChatInput>
        </>
    );
}

export default Chat;
