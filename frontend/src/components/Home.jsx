import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router";
import { TextInput, Button } from "@mantine/core";
import SideBar from "./Sidebar";
import ChatBar from "./ChatBar";
import Chat from "./Chat";
import { useUserContext } from "./Context";
import styles from "../styles/home.module.css";
import ChatTab from "./ChatTab";

function Home() {
    const [activeTab, setActiveTab] = useState("chat");
    if (activeTab === "chat") {
        return (
            <div className={styles.main}>
                <SideBar></SideBar>
                <div className={styles.home}>
                    <ChatTab></ChatTab>
                </div>
            </div>
        );
    }
    return <ChatTab />;
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
