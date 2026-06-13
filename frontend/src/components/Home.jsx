import { Outlet } from "react-router";
import SideBar from "./Sidebar";
import styles from "../styles/home.module.css";

function Home() {
    return (
        <div className={styles.main}>
            <SideBar></SideBar>
            <div className={styles.home}>
                <Outlet></Outlet>
            </div>
        </div>
    );
}

export default Home;
