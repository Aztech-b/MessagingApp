import { alpha, Button } from "@mantine/core";
import { motion } from "motion/react";
import { Link } from "react-router";
import styles from "../../styles/LandingPage/navBar.module.css";
import { Icon } from "../global";
import AuthButtons from "./AuthButtons";

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
                        <Link to={"#"}>
                            <Button color="transparent">Some</Button>
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            <Button color="transparent">Navigation</Button>
                        </Link>
                    </li>
                    <li>
                        <Link to={"#"}>
                            <Button color="transparent">Links</Button>
                        </Link>
                    </li>
                </ul>
                <AuthButtons></AuthButtons>
            </nav>
        </motion.div>
    );
}

export default NavBar;
