import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useUserContext } from "./Context";
import styles from "../styles/sidebar.module.css";
import profileLogo from "../assets/user.svg";
import { Button } from "@mantine/core";
import { MessageCircle } from "lucide-react";
import { Icon } from "./global";
import { Divider } from "@mantine/core";
import { iconColor } from "./global";

function Sidebar() {
    const location = useLocation();
    return (
        <nav className={styles.sidebar}>
            <div className="icon">
                <Icon size={52} color={iconColor}></Icon>
            </div>
            <Divider w={"80%"} size={"xs"} my={"md"} color="gray"></Divider>
            <Tab href={location.pathname.startsWith("/chat") ? "#" : "/chat"}>
                <MessageCircle size={24} color="white" />
            </Tab>
            <Account></Account>
        </nav>
    );
}

function Tab({ href, children }) {
    return (
        <Link to={href} className={styles.tabItem}>
            {children}
        </Link>
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
