import Register from "./components/Register";
import { Outlet } from "react-router";
import { UserDataProvider } from "./components/Context";
import NavBar from "./components/NavBar";
import { useEffect, useState } from "react";

function App() {
    const [user, setUser] = useState({});

    useEffect(() => {
        async function GetUser() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("response is not ok");
                }
                const data = await response.json();
                console.log(data);
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
                <NavBar></NavBar>
                <Outlet></Outlet>
            </UserDataProvider>
        </>
    );
}

export default App;
