import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";

import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import theme from "./components/theme.js";
import router from "./components/routes.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
            <Notifications style={{ maxWidth: "90vh" }} />
            <RouterProvider router={router} />
        </MantineProvider>
    </StrictMode>,
);
