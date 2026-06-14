import { createBrowserRouter } from "react-router";
import Login from "./Login.jsx";
import Register from "./Register.jsx";
import Home from "./Home.jsx";
import App from "../App.jsx";
import ProfilePage from "./ProfilePage.jsx";
import ServerOverload from "./ServerOverload.jsx";
import ChatTab from "./ChatTab.jsx";
import ChatContainer from "./ChatContainer.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "/register", element: <Register /> },
            { path: "/login", element: <Login /> },
            {
                path: "/app",
                element: <Home />,
                children: [
                    {
                        path: "/app/chat",
                        element: <ChatTab />,
                        children: [{ path: "/app/chat/:id", element: <ChatContainer /> }],
                    },
                    { path: "/app/profile", element: <ProfilePage /> },
                ],
            },
        ],
    },
    { path: "/error/:errorcode?", element: <ServerOverload /> },
]);

export default router;
