import { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router";
import styles from "../styles/chat.module.css";

function Chat() {
    const [messages, setMessages] = useState([
        { username: "Ali", content: "I am good" },
        { username: "me", content: "hi, how are you? " },
    ]);

    const chatId = useParams().id;
    const scrollDummy = useRef();

    useEffect(() => {
        scrollDummy.current.scrollTo({ top: scrollDummy.current.scrollHeight, behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        async function GetChatData() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/${chatId}`, {
                    method: "GET",
                    credentials: "include",
                });
                console.log(response);
                const data = await response.json();
                console.log(data);
                if (!response.ok) {
                    throw new Error("response is not ok");
                }
            } catch (error) {}
        }
        GetChatData();
    }, []);
    return (
        <div className={styles.messagesContainer} ref={scrollDummy}>
            <div className={styles.chat}>
                {messages.map((message, index) => {
                    return <Message username={message.username} messageContent={message.content} key={index} />;
                })}
            </div>
        </div>
    );
}

function Message({ username, messageContent }) {
    let authorStyle;
    let isauthorMe;
    let otherUsernameColor = null;
    if (username === "me") {
        authorStyle = styles.clientMessage;
        isauthorMe = true;
    } else {
        otherUsernameColor = GenerateRandomColor();
        authorStyle = styles.otherMessage;
        isauthorMe = false;
    }
    return (
        <div className={`${styles.message} ${authorStyle}`}>
            {isauthorMe ? null : <p style={{ color: otherUsernameColor }}>{username}</p>}
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
