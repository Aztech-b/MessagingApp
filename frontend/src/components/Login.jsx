import { useContext, useEffect, useRef, useState } from "react";
import errorStyles from "../styles/errorPopover.module.css";
import { useUserContext } from "./Context";
import { ServerRouter } from "react-router";
import { Link } from "react-router";
import styles from "../styles/login.module.css";
import { Fieldset, TextInput, PasswordInput, Button } from "@mantine/core";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState();
    const [error, setError] = useState(null);
    const { setUser } = useUserContext();

    const submit = async (e) => {
        e.preventDefault();
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
            console.log(data);
            setUser(data);
        } catch (error) {
            setError(error);
        }
    };

    return (
        <main className={styles.main}>
            <h1>Login</h1>
            <div className={styles.error}></div>
            <form className={styles.form}>
                <TextInput
                    label="Username: "
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

                <Button onClick={submit}>Submit</Button>
            </form>
            <p>
                Don't have an account? Create one <Link to="/register">here. </Link>
            </p>
        </main>
    );
}

export default Login;
