import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button, TextInput, PasswordInput, Alert } from "@mantine/core";
import styles from "../styles/login.module.css";
import { useForm } from "@mantine/form";
import { Icon } from "./global";
import { useDisclosure } from "@mantine/hooks";
import { CircleX } from "lucide-react";

function Register() {
    const [isLoading, { open: openLoading, close: closeLoading }] = useDisclosure(false);
    const form = useForm({
        initialValues: { username: "", password: "" },
        validate: {
            username: (value) => (value.trim().length < 1 ? "Username must be at least 1 character long" : null),
            password: (value) => (value.trim().length < 8 ? "Password must be at least 8 character long" : null),
        },
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const submit = async (values) => {
        openLoading();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/register`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            let data;
            if (response.status === 401) {
                data = await response.json();
                console.log(data);
                setError(data.message);
                closeLoading();
                toggleError();
                return;
            }
            data = await response.json();
            if (response.status === 200) {
                window.location.reload();
                navigate("/app/chat");
            }
        } catch (error) {}
    };

    return (
        <main className={styles.main}>
            <div className={styles.formContainer}>
                <div>
                    <div className={styles.header}>
                        <Icon size={40} color="#e9bc61" />
                        <h1>Register</h1>
                    </div>
                    <p>
                        Have an account? Login <Link to="/login">here. </Link>
                    </p>
                </div>

                <form className={styles.form} onSubmit={form.onSubmit(submit)}>
                    <TextInput
                        label="Username: "
                        placeholder="Enter your username..."
                        {...form.getInputProps("username")}
                    />
                    <PasswordInput label="Password: " {...form.getInputProps("password")} />
                    <Button fullWidth loading={isLoading} type="submit">
                        Submit
                    </Button>
                    {error && (
                        <Alert
                            onClose={() => {
                                setError(null);
                            }}
                            withCloseButton={true}
                            color="red"
                            icon={<CircleX />}
                            title="ERROR"
                        >
                            {error}
                        </Alert>
                    )}
                </form>
            </div>
        </main>
    );
}

export default Register;
