import Register from "./components/Register";
import { Outlet, useNavigate } from "react-router";
import { UserDataProvider, SocketDataProvider } from "./components/Context";
import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import socket from "./components/socket.js";

function App() {
    const [user, setUser] = useState();
    const navigate = useNavigate();

    useEffect(() => {
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

                if (!response.ok) {
                    throw new Error("response is not ok");
                }
                const data = await response.json();

                setUser(data);
            } catch (error) {
                console.log(error);
            }
        }
        GetUser();
    }, []);

    return (
        <>
            <SocketDataProvider value={socket?.current}>
                <UserDataProvider value={{ user, setUser }}>
                    <Sidebar></Sidebar>
                    <Outlet></Outlet>
                </UserDataProvider>
            </SocketDataProvider>
        </>
    );
}

export default App;
