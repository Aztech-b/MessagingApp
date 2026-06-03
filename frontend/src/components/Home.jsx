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

export default Home;
