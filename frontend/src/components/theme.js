import { createTheme } from "@mantine/core";

const theme = createTheme({
    colors: {
        accent: [
            "var(--accent-light-2xl)",
            "var(--accent-light-xl)",
            "var(--accent-light-l)",
            "var(--accent-light)",
            "var(--accent)",
            "var(--accent-dark)",
            "var(--accent-dark-l)",
            "var(--accent-dark-xl)",
            "var(--accent-dark-2xl)",
            "var(--accent-bg)",
        ],
        bg: [
            "var(--bg-light)",
            "var(--bg)",
            "var(--bg-dark)",
            "var(--bg-dark)",
            "var(--bg-dark)",
            "var(--bg-dark)",
            "var(--bg-dark)",
            "var(--bg-dark)",
            "var(--bg-dark)",
            "var(--bg-dark)",
        ],
    },
    primaryColor: "accent",
    components: { Button: { defaultProps: { color: "accent.1" } } },
});

export default theme;
