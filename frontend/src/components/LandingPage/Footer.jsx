import { Icon, iconColor } from "../global";
import styles from "../../styles/LandingPage/footer.module.css";
import { Link } from "react-router";
import { SiGithub } from "@icons-pack/react-simple-icons";

function Footer() {
    return (
        <div className={`${styles.contentContainer} contentContainer`}>
            <footer className={styles.footer}>
                <div className={styles.icon}>
                    <Icon color={iconColor} size={60}></Icon>
                    <p>© MessagingApp</p>
                </div>
                <div className={styles.links}>
                    <div className={styles.about}>
                        <Link to="#">Privacy Policy</Link>
                        <Link to="#">Terms Of Service</Link>
                        <Link to="#">Contact</Link>
                    </div>
                    <div className={styles.social}>
                        <a href="https://github.com/Aztech-b/MessagingApp">
                            <p>GitHub</p>
                            <SiGithub size={18}></SiGithub>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
