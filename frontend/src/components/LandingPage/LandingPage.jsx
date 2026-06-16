import Content from "./Content";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useRef } from "react";
import { useInView } from "motion/react";

function LandingPage() {
    const topElement = useRef();
    const isTop = useInView(topElement);
    return (
        <>
            <NavBar isTop={isTop}></NavBar>
            <Content topElement={topElement}></Content>
            <Footer></Footer>
        </>
    );
}

export default LandingPage;
