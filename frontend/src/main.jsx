import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { RouterProvider } from "react-router";

import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import theme from "./components/theme.js";
import router from "./components/routes.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <MantineProvider defaultColorScheme="auto" theme={theme}>
            <RouterProvider router={router} />
        </MantineProvider>
    </StrictMode>,
);
