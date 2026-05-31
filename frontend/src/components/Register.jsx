import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Button, TextInput, PasswordInput } from "@mantine/core";
import styles from "../styles/login.module.css";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username, password: password }),
            });
            if (!response.ok) {
                console.log(response);
                throw new Error("responese is not ok");
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.trace(error);
        }
    };

    return (
        <main className={styles.main}>
            <h1>Register</h1>
            <form>
                <TextInput
                    label="Username: "
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <TextInput
                    label="Password: "
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />

                <Button onClick={submit}>Submit</Button>
            </form>
            <p>
                Have an existing account? Login <Link to="/register">here. </Link>
            </p>
        </main>
    );
}

export default Register;
