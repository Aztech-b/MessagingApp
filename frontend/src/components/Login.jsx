import { useContext, useEffect, useRef, useState } from "react";
import errorStyles from "../styles/errorPopover.module.css";
import { useUserContext } from "./Context";
import { ServerRouter, useNavigate } from "react-router";
import { Link } from "react-router";
import styles from "../styles/login.module.css";
import { TextInput, PasswordInput, Button } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Icon } from "./global";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState();
    const [error, setError] = useState(null);
    const { setUser } = useUserContext();
    const navigate = useNavigate();
    const [loading, { toggle }] = useDisclosure();

    const submit = async (e) => {
        e.preventDefault();
        toggle();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username, password: password }),
            });
            if (!response.ok) {
                throw new Error("responese is not ok");
            }
            const data = await response.json();
            setUser(data);
            if (data.username) {
                navigate("/chat");
            }
        } catch (error) {
            setError(error);
        }
    };

    return (
        <main className={styles.main}>
            <div className={styles.formContainer}>
                <div>
                    <div className={styles.header}>
                        <Icon size={40} color="#e9bc61" />
                        <h1>Welcome</h1>
                    </div>
                    <p>
                        Don't have an account? Create one <Link to="/register">here. </Link>
                    </p>
                </div>
                <form className={styles.form}>
                    <TextInput
                        label="Username: "
                        placeholder="Enter your username..."
                        onChange={(e) => {
                            setUsername(e.target.value);
                        }}
                    />
                    <PasswordInput
                        label="Password: "
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                    <Button fullWidth loading={loading} onClick={submit}>
                        Submit
                    </Button>
                </form>
            </div>
        </main>
    );
}

export default Login;
