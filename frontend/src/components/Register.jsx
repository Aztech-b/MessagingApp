import { useEffect, useMemo, useState } from "react";

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
            // console.log(data);
            console.log(data);
        } catch (error) {
            console.trace(error);
        }
    };

    return (
        <>
            <h1>Register</h1>
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

export default Register;
