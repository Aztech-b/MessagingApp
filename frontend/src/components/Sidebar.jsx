import { useUserContext } from "./Context";
import styles from "../styles/sidebar.module.css";
import profileLogo from "../assets/user.svg";
import { useState } from "react";
import { Link } from "react-router";

function Sidebar() {
    return (
        <div className={styles.sidebar}>
            <Account></Account>
        </div>
    );
}

/**
 *
 * @param {icon} icon
 * @returns jsx
 */

function Account({ children }) {
    const { user } = useUserContext();
    const [isOpen, setIsOpen] = useState(false);

    function AccountMenu({ children }) {
        return <>{isOpen && children}</>;
    }
    function AccountInfo() {
        return (
            <div className={styles.menu}>
                <div className={styles.info}>
                    <p>{user ? user.username : <Link to="/login">Login</Link>}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={styles.item}>
                <div
                    className={styles.account}
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                >
                    <img src={profileLogo} />
                </div>
                <AccountMenu>
                    <AccountInfo></AccountInfo>
                </AccountMenu>
            </div>
        </>
    );
}

export default Sidebar;
