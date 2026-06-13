import { Outlet } from "react-router";
import useUser from "./hooks/useUser.jsx";
import { UserDataProvider } from "./components/Context";

function App() {
    const { user } = useUser();

    return (
        <>
            <UserDataProvider value={{ user }}>
                <Outlet></Outlet>
            </UserDataProvider>
        </>
    );
}

export default App;
