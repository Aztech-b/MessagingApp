import { createBrowserRouter } from "react-router";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Home from "./Home.jsx";
import App from "../App.jsx";
import Chat from "./Chat.jsx";
import ProfilePage from "./ProfilePage.jsx";
import ServerOverload from "./ServerOverload.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/register", element: <Register /> },
            { path: "/login", element: <Login /> },
            { path: "/chat", element: <Home />, children: [{ path: "/chat/:id", element: <Chat /> }] },
            { path: "/profile", element: <ProfilePage /> },
        ],
    },
    { path: "/error/:errorcode?", element: <ServerOverload /> },
]);

export default router;
