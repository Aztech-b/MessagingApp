import { useEffect, useRef, useState } from "react";

function useScroll() {
    const autoScrollDummy = useRef(null);
    const scrollContainer = useRef(null);
    const [shouldScroll, setShouldScroll] = useState(false);

    useEffect(() => {
        if (!shouldScroll) {
            return;
        }
        if (!scrollContainer) {
            return;
        }
        scrollContainer.current.scrollTo({ top: scrollContainer.current.scrollHeight, behavior: "auto" });
        setShouldScroll(false);
    }, [shouldScroll]);

    return { autoScrollDummy, scrollContainer, setShouldScroll, shouldScroll };
}

export default useScroll;
