import { motion } from "motion/react";
import { useEffect, useState } from "react";

function PageWrapper({ children }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1200);
        };
        window.addEventListener("resize", handleResize);
        return window.removeEventListener("resize", handleResize);
    }, []);

    const pageVariants = {
        initial: { x: "100%", zIndex: 2 },
        animate: { x: 0, zIndex: 2, transition: { type: "tween", ease: "easeInOut", duration: 0.2 } },
        exit: { x: "100%", zIndex: 1, transition: { type: "tween", ease: "easeInOut", duration: 0.2 } },
    };

    if (!isMobile) {
        return <div>{children}</div>;
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ position: "absolute", width: "100%", height: "100vh", top: 0, left: 0, overflow: "hidden" }}
        >
            {children}
        </motion.div>
    );
}

export default PageWrapper;
