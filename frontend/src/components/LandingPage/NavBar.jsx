import { Icon } from "../global";
import styles from "../../styles/LandingPage/navBar.module.css";
import { Link } from "react-router";
import { alpha, Button } from "@mantine/core";
import { motion } from "motion/react";

function NavBar({ isTop }) {
    return (
        <motion.div
            animate={{
                backdropFilter: "blur(8px)",
                backgroundColor: alpha("var(--bg-dark)", 0.8),
                height: isTop ? "var(--navBar-height)" : "calc(var(--navBar-height) - 8px)",
            }}
            transition={{ duration: 0.5 }}
            className={`contentContainer ${styles.contentContainer}`}
        >
            <nav className={styles.nav}>
                <div className={styles.icon}>
                    <Icon size={60}></Icon>
                </div>
                <ul className={styles.links}>
                    <li>
                        <Link to={"/home"}>
                            <Button color="transparent">Home</Button>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/home"}>
                            <Button color="transparent">Home</Button>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/home"}>
                            <Button color="transparent">Home</Button>
                        </Link>
                    </li>
                </ul>
                <ul className={`${styles.authLinks} ${styles.links}`}>
                    <li>
                        <Link to={"/register"}>
                            <Button color="transparent" style={{ border: "1px solid var(--border)" }}>
                                Register
                            </Button>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/login"}>
                            <Button>Login</Button>
                        </Link>
                    </li>
                </ul>
            </nav>
        </motion.div>
    );
}

export default NavBar;
