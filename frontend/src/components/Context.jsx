/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from "react";

const UserContext = createContext({});
const ChatContext = createContext(null);
const ServerStatus = createContext("");

// USER INFO
export function useUserContext() {
    return useContext(UserContext);
}

export function UserDataProvider({ value, children }) {
    return <UserContext value={value}>{children}</UserContext>;
}

export function useChatContext() {
    return useContext(ChatContext);
}

export function ChatContextProvider({ value, children }) {
    return <ChatContext value={value}>{children}</ChatContext>;
}

export function useServerStatusContext() {
    return useContext(ServerStatus);
}

export function ServerStatusProvider({ value, children }) {
    return <ServerStatus value={value}>{children}</ServerStatus>;
}
