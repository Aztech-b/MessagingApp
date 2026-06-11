import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function useUser() {
    const [user, setUser] = useState();
    const navigate = useNavigate();

    useEffect(function GetUserData() {
        async function GetUser() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/auth/`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.status === 401) {
                    navigate("/login");
                    return;
                }

                if (response.status === 503) {
                    navigate("/error/503");
                }

                if (!response.ok) {
                    throw new Error("response is not ok");
                }
                const data = await response.json();
                setUser(data);
                console.log("navigate to chat");
                navigate("/chat");
            } catch (error) {
                navigate("/error");
            }
        }
        GetUser();
    }, []);

    return { user };
}

export default useUser;
