import { useRef } from "react";

function useScroll() {
    const autoScrollDummy = useRef(null);
    const scrollContainer = useRef(null);

    const scrollToBottom = () => {
        if (!scrollContainer) {
            return;
        }
        scrollContainer.current.scrollTo({ top: scrollContainer.current.scrollHeight, behavior: "auto" });
    };

    return { autoScrollDummy, scrollContainer, scrollToBottom };
}

export default useScroll;
