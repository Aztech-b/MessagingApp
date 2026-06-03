import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useUserContext } from "./Context";
import styles from "../styles/sidebar.module.css";
import profileLogo from "../assets/user.svg";
import { Button, Divider, Tooltip } from "@mantine/core";
import { MessageCircle, Star, Archive, Ban, CircleUserRound } from "lucide-react";
import { Icon, iconColor } from "./global";

function Sidebar() {
    return (
        <nav className={styles.sidebar}>
            <div className="icon">
                <Icon size={52} color={iconColor}></Icon>
            </div>
            <Divider w={"80%"} size={"xs"} my={"md"} color="gray"></Divider>
            <Tab href={"/chat"} title={"Chats"}>
                <MessageCircle size={24} color="white" />
            </Tab>
            <Tab href={"/profile"} title={"Profile"}>
                <CircleUserRound size={24} color="white" />
            </Tab>
            <Tab title={"Starred"}>
                <Star color="#ffffff" />
            </Tab>
            <Tab title={"Archive"}>
                <Archive color="#ffffff" />
            </Tab>
            <Tab title={"Removed"}>
                <Ban color="#ffffff" />
            </Tab>
        </nav>
    );
}

function Tab({ title, href, children }) {
    const location = useLocation();
    const isActiveTab = location.pathname.startsWith(href);
    if (isActiveTab) {
        href = "#";
    }
    return (
        <Tooltip label={title} position="right" offset={-10}>
            <Link className={`${styles.tabItem} ${isActiveTab ? styles.activeTab : ""}`} to={href}>
                {/* <abbr className={styles.abbreviation} title={title}> */}
                {children}
                {/* </abbr> */}
            </Link>
        </Tooltip>
    );
}

function LoginButton() {
    return (
        <Link to="/login">
            <Button variant="filled" color="accent.3">
                Login
            </Button>
        </Link>
    );
}

function Account({ children }) {
    const { user } = useUserContext();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className={styles.item}>
                <button className={styles.account} popoverTarget="menu">
                    <img src={profileLogo} />
                </button>
                <div className={styles.menu} popover="auto" id="menu">
                    <div className={styles.info}>
                        <p>{user ? user.username : <LoginButton />}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
