import { LockKeyhole, Smartphone, Zap } from "lucide-react";
import mockup from "../../assets/mockup.png";
import styles from "../../styles/LandingPage/content.module.css";
import { Button, Divider } from "@mantine/core";
import { Link } from "react-router";
import MyCard from "./MyCard";

function Content() {
    return (
        <div className={`${styles.contentContainer} contentContainer`}>
            <main className={styles.main}>
                <div className={styles.mockup}>
                    <img src={mockup} alt="mockup" />
                </div>
                <h1>Messaging that stays simple.</h1>
                <p>Chat with friends, and stay connected without the clutter.</p>
                <div className={styles.links}>
                    <Link to={"/register"}>
                        <Button color="transparent" style={{ border: "1px solid var(--border)" }}>
                            Register
                        </Button>
                    </Link>
                    <Link to={"/login"}>
                        <Button>Login</Button>
                    </Link>
                </div>
                <Divider label="features" labelPosition="center" style={{ width: "100vw" }} my={40}></Divider>
                <div className={styles.cards}>
                    <MyCard
                        icon={<Zap />}
                        title={"Real-time messaging"}
                        description={"Messages appear instantly."}
                        animate={{ y: [0, 10, 0] }}
                    ></MyCard>
                    <MyCard
                        icon={<Smartphone />}
                        title={"Works everywhere"}
                        description={"Access your conversations from any device."}
                        animate={{ y: [-5, 5, -5] }}
                        delay={0.2}
                    ></MyCard>
                    <MyCard
                        icon={<LockKeyhole />}
                        title={"Secure authentication"}
                        description={"Your account is protected."}
                        animate={{ y: [0, 10, 0] }}
                    ></MyCard>
                </div>
            </main>
        </div>
    );
}

export default Content;
