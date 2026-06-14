import { useState, useEffect } from "react";
import socket from "./socket";
import styles from "../styles/chat.module.css";
import { LoaderCircle, Check, CheckCheck } from "lucide-react";
import { useUserContext } from "./Context";
import { EVENT } from "../../../shared/socketEvents";

/**
 *
 * @param {{colors: {color: string, user: {username: string}}[], data: string}} colors
 * @returns
 */
function Message({ data, colors, extended, ref }) {
    let [icon, setIcon] = useState(null);
    const { content } = data;
    const username = data.author.username;
    const status = data.status;
    const member = colors.find((member) => member.user.username === username);
    const color = member.color;

    useEffect(() => {
        if (status === "sending") {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIcon(<LoaderCircle color="var(--accent-light-2xl)" size={16} />);
        } else if (status === "sent") {
            setIcon(<Check color="var(--accent-light-2xl)" size={16} />);
        } else if (status === "read") {
            setIcon(<CheckCheck color="var(--accent-light-2xl)" size={16} />);
        }
    }, [status]);

    useEffect(() => {
        function setRead(data) {
            if (data.messageId <= data.id) {
                // eslint-disable-next-line no-undef
                setStatus("read");
            }
        }
        socket.on(EVENT.MESSAGE.READ, setRead);
        return () => {
            socket.off(EVENT.MESSAGE.READ, setRead);
        };
    }, []);
    let authorStyle;
    const { user } = useUserContext();
    if (user && user.username && username === user.username) {
        authorStyle = styles.clientMessage;
        extended = false;
    } else {
        // otherUsernameColor = GenerateRandomColor();
        authorStyle = styles.otherMessage;
    }
    const sent = new Date(data.sent).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true });
    return (
        <div className={`${styles.message} ${authorStyle}`} ref={ref}>
            {extended ? <p style={{ color: color }}>{username}</p> : null}
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

export default Message;
