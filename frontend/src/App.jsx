import Register from "./components/Register";
import { Outlet, useNavigate } from "react-router";
import { UserDataProvider, ChatContextProvider } from "./components/Context";
import { useEffect, useRef, useState } from "react";
import socket from "./components/socket.js";
import { ReceiptPoundSterlingIcon } from "lucide-react";

function App() {
    const [user, setUser] = useState();

    /**
     * @typedef {import("./components/types.js").Chat} Chat
     */

    /** @type {[Chat[]]} */
    const [chats, setChats] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState();
    const navigate = useNavigate();

    // User
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

    // chats
    useEffect(() => {
        async function GetAllChats() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("response is not ok");
                }
                const data = await response.json();
                setChats(data);
            } catch (error) {}
        }
        GetAllChats();
    }, []);

    useEffect(() => {
        if (!chats || chats.length === 0) {
            return;
        }
        for (let i = 0; i < chats.length; i++) {
            const id = chats[i].id;
            socket.emit("join", { chatId: id });
        }
    }, [chats]);

    useEffect(() => {
        if (!chats) {
            return;
        }
        for (let i = 0; i < chats.length; i++) {
            const chat = chats[i];
            socket.emit("join", { chatId: chat.id });
        }
    }, [chats]);

    return (
        <>
            <ChatContextProvider value={{ chats, setChats }}>
                <UserDataProvider value={{ user, setUser }}>
                    <Outlet></Outlet>
                </UserDataProvider>
            </ChatContextProvider>
        </>
    );
}

export default App;
