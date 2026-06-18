import { Outlet } from "react-router";
import { ServerStatusProvider, UserDataProvider } from "./components/Context";
import useUser from "./hooks/useUser.jsx";

function App() {
    const { user } = useUser();

    return (
        <ServerStatusProvider value={{ status }}>
            <UserDataProvider value={{ user }}>
                <Outlet></Outlet>
            </UserDataProvider>
        </ServerStatusProvider>
    );
}

export default App;
