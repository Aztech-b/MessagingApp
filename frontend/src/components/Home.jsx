import styles from "../styles/home.module.css";
import groupIcon from "../assets/users-round.svg";

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

function Home() {
    return (
        <div className={styles.home}>
            <div className={styles.chats}>
                <Chat chatName="Bakdaulet" />
                <Chat chatName="Ali" />
            </div>
            <div className={styles.messages}>
                <TopBar chatName="Bakdaulet" />
                <div className={styles.chat}>
                    <Message username="me" messageContent="hi, how are you" />
                    <Message username="Ali" messageContent="I am good" />
                </div>
                <InputField />
            </div>
        </div>
    );
}

function InputField() {
    return (
        <div className="inputField">
            <input type="text" name="message" id="message" />
        </div>
    );
}

function TopBar({ chatName }) {
    return (
        <div className={styles.topBar}>
            <p className="chatName">{chatName}</p>
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

function Chat({ chatName, icon }) {
    if (!icon) {
        icon = groupIcon;
    }
    return (
        <div className={styles.chat}>
            <img src={groupIcon} className={styles.icon} />
            <p className="chatName">{chatName}</p>
        </div>
    );
}

export default Home;
