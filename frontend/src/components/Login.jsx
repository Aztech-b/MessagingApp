import { useContext, useEffect, useRef, useState } from "react";
import errorStyles from "../styles/errorPopover.module.css";
import { ServerRouter, useNavigate } from "react-router";
import { Link } from "react-router";
import styles from "../styles/login.module.css";
import { Icon } from "./global";
import { TextInput, PasswordInput, Button, Alert } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { CircleX } from "lucide-react";

function Login() {
    const { setUser } = useUserContext();
    const navigate = useNavigate();
    const [isLoading, { close: closeLoading, open: openLoading }] = useDisclosure(false);
    const [error, setError] = useState(null);
    const form = useForm({
        initialValues: { username: "", password: "" },
        validate: {
            username: (value) => (value.trim().length < 1 ? "Username must be at least 1 character long" : null),
            password: (value) => (value.trim().length < 8 ? "Password must be at least 8 character long" : null),
        },
    });

    /**
     *
     * @param {{username: string, password: string}} values
     */
    const submit = async (values) => {
        openLoading();
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });
            let data;
            console.log(response);
            if (response.status === 401) {
                data = await response.json();
                setError(data.message);
                closeLoading();
                toggleError();
                return;
            }
            data = await response.json();
            window.location.reload();
            if (data.username) {
                navigate("/chat");
            }
        } catch (error) {
            console.error(error);
            closeLoading();
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

export default Login;
