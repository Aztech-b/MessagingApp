import { useEffect, useRef, useState } from "react";
import errorStyles from "../styles/errorPopover.module.css";

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [data, setData] = useState();
    const [error, setError] = useState(null);

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
        } catch (error) {
            setError(error);
            console.trace(error);
        }
    };

    const popoverRef = useRef(null);

    useEffect(() => {
        const popover = popoverRef.current;
        if (!popover) {
            return;
        }
        if (error) {
            popover.classList.add(errorStyles.opened);
            popover.classList.remove(errorStyles.closed);
        } else {
            popover.classList.remove(errorStyles.opened);
            popover.classList.add(errorStyles.closed);
        }
    }, [error]);

    /**
     *
     * @param {String} error Error string to render
     * @returns html
     */
    function ErrorPopover({ error }) {
        return (
            <div ref={popoverRef} className={errorStyles.popover}>
                <h1>Error</h1>
                <p>{error}</p>
            </div>
        );
    }
    return (
        <>
            <h1>Login</h1>
            <ErrorPopover error="error text" />
            <form>
                <label htmlFor="username">Username: </label>
                <input
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                    type="username"
                    name="username"
                    id="username"
                />
                <label htmlFor="password">Password: </label>
                <input
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    type="password"
                    name="password"
                    id="password"
                />

                <button onClick={submit} type="submit">
                    Submit
                </button>
            </form>
        </>
    );
}

export default Login;
