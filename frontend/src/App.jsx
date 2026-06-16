import { Outlet, useLocation, useNavigate } from "react-router";
import useUser from "./hooks/useUser.jsx";
import { UserDataProvider } from "./components/Context";

function App() {
    const { user } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    if (location.pathname === "/") {
        navigate("/landing-page");
    }
    return (
        <>
            <UserDataProvider value={{ user }}>
                <Outlet></Outlet>
            </UserDataProvider>
        </>
    );
}

export default App;
