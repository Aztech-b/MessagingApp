import { Alert, Button } from "@mantine/core";
import { Link } from "react-router";
import styles from "../../styles/LandingPage/navBar.module.css";
import { useServerStatusContext } from "../Context";

function AuthButtons() {
    const { status } = useServerStatusContext();
    return (
        <>
            {status === "down" ? (
                <Alert
                    color="red"
                    title="Backend is down"
                    pos={"absolute"}
                    top={8}
                    w={"30%"}
                    left={"50%"}
                    styles={{ root: { transform: "translateX(-50%)" } }}
                >
                    Server is down because of either the developer turned it off, or there are some limitations of PaaS
                    provider. In second case, just wait until the server turns on (usually max 60 seconds). The
                    developer turned off all navigation things that point to login/register routes.
                </Alert>
            ) : (
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
            )}
        </>
    );
}

export default AuthButtons;
