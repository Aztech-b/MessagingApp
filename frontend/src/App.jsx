import Register from "./components/Register";
import { Outlet, useNavigate } from "react-router";
import { UserDataProvider } from "./components/Context";
import { useEffect, useRef, useState } from "react";
import socket from "./components/socket.js";
import { ReceiptPoundSterlingIcon } from "lucide-react";

function App() {
    const [user, setUser] = useState();

    const [unreadMessages, setUnreadMessages] = useState();
    const navigate = useNavigate();

    useEffect(function GetUserData() {
        async function GetUser() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.status === 401) {
                    navigate("/login");
                    return;
                }

                if (response.status === 503) {
                    navigate("/error/503");
                }

                if (!response.ok) {
                    throw new Error("response is not ok");
                }
                const data = await response.json();
                setUser(data);
                navigate("/chat");
            } catch (error) {
                navigate("/error");
            }
        }
        GetUser();
    }, []);

    useEffect(
        function joinUserSocketRoom() {
            const username = { username: user ? user.username : null };
            socket.emit("joinUser", username);
            return () => socket.emit("leaveUser", username);
        },
        [user],
    );

    return (
        <>
            <UserDataProvider value={{ user, setUser }}>
                <Outlet></Outlet>
            </UserDataProvider>
        </>
    );
}

export default App;
