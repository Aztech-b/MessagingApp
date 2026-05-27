import Register from "./components/Register";
import { Outlet } from "react-router";
import { UserDataProvider } from "./components/Context";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";

function App() {
    const [user, setUser] = useState();

    useEffect(() => {
        async function GetUser() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                console.log(data);
                if (!response.ok) {
                    throw new Error("response is not ok");
                }
                setUser(data);
            } catch (error) {
                console.trace(error);
            }
        }
        GetUser();
    }, []);

    return (
        <>
            <UserDataProvider value={{ user, setUser }}>
                <Sidebar></Sidebar>
                <Outlet></Outlet>
            </UserDataProvider>
        </>
    );
}

export default App;
