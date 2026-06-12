import { useEffect, useState } from "react";
import { useLocation } from "react-router";

function useActiveChat() {
    const [activeChatName, setActiveChatName] = useState("");
    const [usernames, setUsernames] = useState([]);
    const location = useLocation();
    useEffect(() => {
        if (location.pathname === "/chat") {
            setActiveChatName("");
        }
    }, [location.pathname]);

    return { activeChatName, setActiveChatName, usernames, setUsernames };
}

export default useActiveChat;
