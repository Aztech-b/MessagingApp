import { useContext, useEffect, useRef, useState } from "react";
import errorStyles from "../styles/errorPopover.module.css";
import { useUserContext } from "./Context";
import { ServerRouter, useNavigate } from "react-router";
import { Link } from "react-router";
import styles from "../styles/login.module.css";
import { Fieldset, TextInput, PasswordInput, Button } from "@mantine/core";
import { Dices } from "lucide-react";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState();
    const [error, setError] = useState(null);
    const { setUser } = useUserContext();
    const navigate = useNavigate();

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
                        <Dices size={40} color="#e9bc61" />
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
                    <Button fullWidth onClick={submit}>
                        Submit
                    </Button>
                </form>
            </div>
        </main>
    );
}

export default Login;
