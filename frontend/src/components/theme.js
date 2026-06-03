import { createTheme, Modal, TextInput } from "@mantine/core";

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
        // dark: [
        //     "#d5d7e0",
        //     "#acaebf",
        //     "#8c8fa3",
        //     "#666980",
        //     "#4d4f66",
        //     "#34354a",
        //     "#2b2c3d",
        //     "hsl(230.84, 30%, 12%)",
        //     "#1d1e30",
        //     "#01010a",
        // ],
    },
    primaryColor: "accent",
    components: {
        Button: { defaultProps: { color: "accent.1" } },
        ActionIcon: { defaultProps: { color: "accent.1" } },
        Modal: {
            styles: { content: { backgroundColor: "var(--surface)" }, header: { backgroundColor: "var(--surface)" } },
        },
        TextInput: { styles: { input: { backgroundColor: "var(--surface-light)", borderColor: "var(--border)" } } },
    },
});

export default theme;
