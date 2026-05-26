import Register from "./components/Register";
import { Outlet } from "react-router";
import { UserDataProvider } from "./components/Context";
import NavBar from "./components/NavBar";
import { useState } from "react";

function App() {
    const [user, setUser] = useState({});
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
