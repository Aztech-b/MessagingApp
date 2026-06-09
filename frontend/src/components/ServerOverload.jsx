import styles from "../styles/serverOverload.module.css";
import { Button } from "@mantine/core";
import { useNavigate, useParams } from "react-router";

function ServerOverload() {
    const navigate = useNavigate();
    const { errorcode } = useParams();
    let message;
    if (!errorcode) {
        message = `Network Error. Cannot connect to server. There are several causes to 
            this: server offline, DNS failure, connection refused, timeout, CORS`;
    } else if (errorcode === "503") {
        message = `We cannot handle your request right now, please wait for a couple of minutes and refresh the page.
                    Our team is already working on this issue.`;
    }
    return (
        <main className={styles.main} errorcode={errorcode || ""}>
            <div className={styles.content}>
                <h1 className={styles.h1}>All of our servers are busy</h1>
                <p className={styles.description}>{message}</p>
                <Button
                    color="accent.9"
                    onClick={() => {
                        navigate("/");
                    }}
                >
                    Refresh the page
                </Button>
            </div>
        </main>
    );
}

export default ServerOverload;
