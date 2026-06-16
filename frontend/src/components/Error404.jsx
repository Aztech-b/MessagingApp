import { Button } from "@mantine/core";
import { Link } from "react-router";
import styles from "../styles/error.module.css";

function Error404() {
    return (
        <div className="contentContainer">
            <main>
                <h1>Sorry bro, there is no such page</h1>
                <Button autoContrast>
                    <Link className={styles.link} to="/landing-page">
                        Go to landing page
                    </Link>
                </Button>
                <p>
                    If you came from navigation links, then you are welcome to fix it yourself in{" "}
                    <a href="https://github.com/Aztech-b/MessagingApp">github</a>
                </p>
            </main>
        </div>
    );
}

export default Error404;
