import styles from "../styles/home.module.css";
import groupIcon from "../assets/users-round.svg";
import { TextInput, Button } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "./Context";
import ChatBar from "./ChatBar";
import Chat from "./Chat";
import { Outlet } from "react-router";

function Home() {
    const [activeChatId, setActiveChatId] = useState();

    // TODO make chat buttons work
    function CreateChat() {
        useEffect(() => {
            async function SendData(chatName) {
                try {
                    const { user } = useUserContext();
                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/new`, {
                        method: "POST",
                        credentials: "include",
                        headers: { "Content-type": "application/json" },
                        body: JSON.stringify({ membersId: [user.id], chatName }),
                    });
                    const data = await response.json();
                    console.log(data);
                    if (!response.ok) {
                        throw new Error("response is not ok");
                    }
                    setChats((prev) => [...prev, data]);
                } catch (error) {
                    console.log(error);
                }
            }
            // SendData();
        }, []);
    }
    return (
        <div className={styles.home}>
            <ChatBar></ChatBar>
            <div className={styles.messages}>
                <TopBar chatName="Bakdaulet" />
                <Outlet></Outlet>
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

function generateRandomString(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

export default Home;
