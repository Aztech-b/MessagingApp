import { createBrowserRouter } from "react-router";
import App from "../App.jsx";
import ChatContainer from "./ChatContainer.jsx";
import ChatTab from "./ChatTab.jsx";
import Error404 from "./Error404.jsx";
import Home from "./Home.jsx";
import LandingPage from "./LandingPage/LandingPage.jsx";
import Login from "./Login.jsx";
import PageWrapper from "./PageWrapper.jsx";
import ProfilePage from "./ProfilePage.jsx";
import Register from "./Register.jsx";
import ServerOverload from "./ServerOverload.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        errorElement: <Error404 />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: "/register", element: <Register /> },
            { path: "/login", element: <Login /> },
            {
                path: "/app",
                element: <Home />,
                children: [
                    {
                        path: "/app/chat",
                        element: <ChatTab />,
                        children: [
                            {
                                path: "/app/chat/:id",
                                element: (
                                    <PageWrapper>
                                        <ChatContainer />
                                    </PageWrapper>
                                ),
                            },
                        ],
                    },
                    { path: "/app/profile", element: <ProfilePage /> },
                ],
            },
        ],
    },
    { path: "/error/:errorcode?", element: <ServerOverload /> },
]);

export default router;
