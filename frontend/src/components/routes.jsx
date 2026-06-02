import { createBrowserRouter } from "react-router";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Home from "./Home.jsx";
import App from "../App.jsx";
import Chat from "./Chat.jsx";
import ProfilePage from "./ProfilePage.jsx";

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
]);

export default router;
