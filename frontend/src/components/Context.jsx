import { createContext, useContext, useState } from "react";

const UserContext = createContext({});

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
