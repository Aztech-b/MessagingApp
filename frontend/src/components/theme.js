import { createTheme } from "@mantine/core";

const theme = createTheme({
    colors: {
        accent: [
            "var(--accent)",
            "var(--accent-bg)",
            "var(--accent-border)",
            "var(--accent-light)",
            "var(--accent-lighter)",
            "var(--accent-bg)",
            "var(--accent)",
            "var(--accent)",
            "var(--accent)",
            "var(--accent)",
        ],
    },
    primaryColor: "accent",
});

export default theme;
