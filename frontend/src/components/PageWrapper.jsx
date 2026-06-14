import { motion } from "framer-motion";

const pageVariants = {
    initial: { x: "100%", zIndex: 2 },
    animate: { x: 0, zIndex: 2, transition: { type: "tween", ease: "easeInOut", duration: 0.4 } },
    exit: { x: "100%", zIndex: 1, transition: { type: "tween", ease: "easeInOut", duration: 0.4 } },
};

const PageWrapper = ({ children }) => (
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

export default PageWrapper;
