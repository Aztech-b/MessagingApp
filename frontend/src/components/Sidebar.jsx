import { useUserContext } from "./Context";
import styles from "../styles/sidebar.module.css";
import profileLogo from "../assets/user.svg";
import { useState } from "react";
import { Link } from "react-router";
import { Button } from "@mantine/core";

function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <Account></Account>
        </div>
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
