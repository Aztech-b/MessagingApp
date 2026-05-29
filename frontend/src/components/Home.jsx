import styles from "../styles/home.module.css";
import groupIcon from "../assets/users-round.svg";

function Home() {
    return (
        <div className={styles.home}>
            <div className={styles.chats}>
                <Chat chatName="Bakdaulet" />
                <Chat chatName="Ali" />
            </div>
            <div className="messages">
                <TopBar chatName="Bakdaulet" />
                <div className="chat">
                    <Message username="me" messageContent="hi, how are you" />
                    <Message username="Ali" messageContent="I am good" />
                </div>
            </div>
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
    return (
        <div className={styles.message}>
            <p className="username">{username}</p>
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
