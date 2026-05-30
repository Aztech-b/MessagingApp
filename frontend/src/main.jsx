import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Home from "./components/Home.jsx";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "/login", element: <Login /> },
            { path: "/register", element: <Register /> },
        ],
    },
]);

// const theme = createTheme({primaryColor: });

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <MantineProvider defaultColorScheme="dark">
            <RouterProvider router={router} />
        </MantineProvider>
    </StrictMode>,
);
