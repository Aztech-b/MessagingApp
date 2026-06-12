import { useEffect, useRef } from "react";

function useScroll() {
    const shouldAutoScroll = useRef(true);
    const autoScrollDummy = useRef(null);
    const scrollContainer = useRef(null);

    const scrollToBottom = () => {
        if (!scrollContainer) {
            return;
        }
        scrollContainer.current.scrollTo({ top: scrollContainer.current.scrollHeight, behavior: "auto" });
    };

    useEffect(
        function ScrollRightNow() {
            if (!shouldAutoScroll) {
                return;
            }
            scrollToBottom();
            shouldAutoScroll.current = false;
        },
        [shouldAutoScroll.current],
    );
    return { shouldAutoScroll, autoScrollDummy, scrollContainer };
}

export default useScroll;
