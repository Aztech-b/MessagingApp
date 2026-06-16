import { Icon, iconColor } from "../global";
import styles from "../../styles/LandingPage/footer.module.css";
import { Link } from "react-router";

function Footer() {
    return (
        <div className={`${styles.contentContainer} contentContainer`}>
            <footer className={styles.footer}>
                <div className={styles.icon}>
                    <Icon color={iconColor} size={60}></Icon>
                    <p>© MessagingApp</p>
                </div>
                <div className={styles.links}>
                    <Link to="#">Privacy Policy</Link>
                    <Link to="#">Terms Of Service</Link>
                    <Link to="#">Contact</Link>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
