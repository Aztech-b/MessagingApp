import { Outlet, useLocation, useNavigate } from "react-router";
import useUser from "./hooks/useUser.jsx";
import { UserDataProvider } from "./components/Context";
import { useEffect } from "react";

function App() {
    const { user } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === "/") {
            navigate("/landing-page");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);
    return (
        <>
            <UserDataProvider value={{ user }}>
                <Outlet></Outlet>
            </UserDataProvider>
        </>
    );
}

export default App;
