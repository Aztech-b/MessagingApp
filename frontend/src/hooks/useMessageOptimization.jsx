import { useEffect, useRef, useState } from "react";

function useMessageOptimization(scrollContainer, messages, setMessages, chatId) {
    const scrollPos = useRef({ top: 0, height: 0 });

    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    function handleScroll() {
        const el = scrollContainer.current;

        if (el.scrollTop < 100) {
            loadMore();
        }
    }

    async function loadMore() {
        if (loadingMore || !hasMore || messages.length === 0) return;
        setLoadingMore(true);
        const oldestId = messages[0].id;
        const container = scrollContainer.current;

        scrollPos.current = { top: container.scrollTop, height: container.scrollHeight };

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/${chatId}?before=${oldestId}`, {
            method: "GET",
            credentials: "include",
        });

        const data = await response.json();
        if (data.status === "NO_MORE_MESSAGES") {
            setHasMore(false);
            return;
        }
        setMessages((prev) => [...data.messages, ...prev]);
        setLoadingMore(false);
    }

    return { handleScroll };
}

export default useMessageOptimization;
