import js from "@eslint/js";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
    globalIgnores(["dist"]),
    {
        files: ["**/*.{js,jsx}"],
        extends: [js.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
        languageOptions: { globals: globals.browser, parserOptions: { ecmaFeatures: { jsx: true } } },
    },
    {
        rules: {
            "no-var": "error",
            "prefer-const": "error",
            "no-const-assign": "error",
            "no-new-object": "error",
            "object-shorthand": "error",
            "no-array-constructor": "error",
            "prefer-destructing": "warn",
        },
    },
]);
