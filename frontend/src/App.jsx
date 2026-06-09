import Register from "./components/Register";
import { Outlet, useNavigate } from "react-router";
import { UserDataProvider, ChatContextProvider } from "./components/Context";
import { useEffect, useRef, useState } from "react";
import socket from "./components/socket.js";

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

    // cfhats
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
        if (!chats) {
            return;
        }
        for (let i = 0; i < chats.length; i++) {
            const chat = chats[i];
            socket.emit("join", { chatId: chat.id });
            socket.on("newMessage", (data) => {
                setUnreadMessagesNumber((prev) => prev + 1);
            });
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
