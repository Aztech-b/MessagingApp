import Register from "./components/Register";
import { Outlet } from "react-router";
import { useEffect, useRef, useState } from "react";
import socket from "./components/socket.js";
import { ReceiptPoundSterlingIcon } from "lucide-react";
import useUser from "./hooks/useUser.jsx";
import { UserDataProvider } from "./components/Context";

function App() {
    const { user } = useUser();

    const [unreadMessages, setUnreadMessages] = useState();

    return (
        <>
            <UserDataProvider value={{ user }}>
                <Outlet></Outlet>
            </UserDataProvider>
        </>
    );
}

export default App;
