import { createContext, useContext, useState } from "react";

const UserContext = createContext({});
const ChatContext = createContext(null);

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
