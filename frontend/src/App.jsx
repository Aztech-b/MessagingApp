import Register from "./components/Register";
import { Outlet, useNavigate } from "react-router";
import { UserDataProvider } from "./components/Context";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";

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
                // console.log(data);

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
            <UserDataProvider value={{ user, setUser }}>
                <Sidebar></Sidebar>
                <Outlet></Outlet>
            </UserDataProvider>
        </>
    );
}

export default App;
