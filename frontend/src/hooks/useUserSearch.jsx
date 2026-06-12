import { useEffect, useState } from "react";

function useUserSearch(query) {
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (!query || query === "") {
            return;
        }

        const timeout = setTimeout(async () => {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/user/search?query=${query}`, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            setResults(data);
        }, 250);

        return () => clearTimeout(timeout);
    }, [query]);

    return { results };
}

export default useUserSearch;
