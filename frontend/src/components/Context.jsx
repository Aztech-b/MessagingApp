import { createContext, useContext, useState } from "react";

const UserContext = createContext({});
const SocketContext = createContext(null);

/**
 *
 * @returns State: {user, setUser}
 */
export function useUserContext() {
    return useContext(UserContext);
}

export function UserDataProvider({ value, children }) {
    return <UserContext value={value}>{children}</UserContext>;
}

export function useSocketContext() {
    return useContext(SocketContext);
}

export function SocketDataProvider({ value, children }) {
    return <SocketContext value={value}>{children}</SocketContext>;
}
