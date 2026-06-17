import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function useCheckServer() {
    const [status, setStatus] = useState();
    const navigate = useNavigate();
    useEffect(() => {
        async function FetchHealth() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/health`, { method: "GET" });
                if (!response.ok) {
                    setStatus("down");
                } else if (response.ok) {
                    setStatus("up");
                }
            } catch (error) {
                setStatus("down");
                console.error(error);
            }
        }
        FetchHealth();
    });
    useEffect(() => {
        if (status === "down") {
            navigate("/");
        }
    }, [status]);
    return { status };
}

export default useCheckServer;
