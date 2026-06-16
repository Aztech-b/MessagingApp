import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { ServerStatusProvider, UserDataProvider } from "./components/Context";
import useCheckServer from "./hooks/useCheckServer.jsx";
import useUser from "./hooks/useUser.jsx";

function App() {
    const { status } = useCheckServer();
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
        <ServerStatusProvider value={{ status }}>
            <UserDataProvider value={{ user }}>
                <Outlet></Outlet>
            </UserDataProvider>
        </ServerStatusProvider>
    );
}

export default App;
