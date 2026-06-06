import { useState, useEffect, forwardRef, useRef } from "react";
import { useUserContext } from "./Context";
import socket from "./socket";
import styles from "../styles/chat.module.css";
import { LoaderCircle, Check, CheckCheck } from "lucide-react";
import { useParams } from "react-router";

function Message({ data, extended, ref }) {
    let [icon, setIcon] = useState(null);
    const { content } = data;
    const id = useRef(data.id);
    const username = data.author.username;
    const status = data.status;
    const chatId = useParams();

    useEffect(() => {
        if (status === "sending") {
            setIcon(<LoaderCircle color="var(--accent-light-2xl)" size={16} />);
        } else if (status === "sent") {
            setIcon(<Check color="var(--accent-light-2xl)" size={16} />);
        } else if (status === "read") {
            setIcon(<CheckCheck color="var(--accent-light-2xl)" size={16} />);
        }
    }, [status]);

    useEffect(() => {
        socket.on("readMessage", (data) => {
            if (data.messageId <= data.id) {
                setStatus("read");
            }
        });
        return () => {
            socket.off("readMessage");
        };
    }, []);
    let authorStyle;
    const { user } = useUserContext();
    let otherUsernameColor = null;
    if (user && user.username && username === user.username) {
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
                    {icon}
                </div>
            </div>
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

export default Message;
