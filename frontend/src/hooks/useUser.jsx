import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import useUserSockets from "./useUserSockets";

function useUser() {
    const [user, setUser] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    useUserSockets(user);

    async function GetUser() {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth`, {
                method: "GET",
                credentials: "include",
            });

            if (response.status === 401) {
                return false;
            }

            if (response.status === 503) {
                navigate("/error/503");
            }

            if (!response.ok) {
                throw new Error("response is not ok");
            }
            const data = await response.json();
            setUser(data);
            return true;
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        GetUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (location.pathname.includes("/app/chat")) {
            if (!GetUser()) {
                navigate("/login");
            }
        }
    }, [location.pathname]);

    return { user };
}

export default useUser;
