import { Link, useLocation } from "react-router";
import styles from "../styles/sidebar.module.css";
import { Divider, Tooltip, Dialog } from "@mantine/core";
import { MessageCircle, Star, Archive, Ban, CircleUserRound } from "lucide-react";
import { Icon, iconColor } from "./global";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

function Sidebar() {
    return (
        <nav className={styles.sidebar}>
            <div className="icon">
                <Icon size={52} color={iconColor}></Icon>
            </div>
            <Divider w={"80%"} size={"xs"} my={"md"} color="gray"></Divider>
            <Tab href={"/app/chat"} title={"Chats"}>
                <MessageCircle size={24} color="white" />
            </Tab>
            <Tab href={"/app/profile"} title={"Profile"}>
                <CircleUserRound size={24} color="white" />
            </Tab>
            <NotReadyTab title={"Starred"} href={"/starred"}>
                <Star color="#ffffff" />
            </NotReadyTab>
            <NotReadyTab title={"Archive"} href={"/archive"}>
                <Archive color="#ffffff" />
            </NotReadyTab>
            <NotReadyTab title={"Removed"} href={"/removed"}>
                <Ban color="#ffffff" />
            </NotReadyTab>
        </nav>
    );
}

function NotReadyTab({ title, children }) {
    const [opened, { close }] = useDisclosure(false);
    return (
        <>
            <Tooltip label={title} position="right" offset={-10}>
                <button
                    onClick={() => {
                        notifications.show({
                            title: "Not implemented yet",
                            message: "This tab is not implemented yet, right now it is only for beauty.",
                            autoClose: 4000,
                            color: "red",
                            classNames: styles,
                            position: "bottom-center",
                        });
                    }}
                    className={`${styles.tabItem}`}
                >
                    {/* <abbr className={styles.abbreviation} title={title}> */}
                    {children}
                    {/* </abbr> */}
                </button>
            </Tooltip>
            <Dialog withCloseButton opened={opened} onClose={close}></Dialog>
        </>
    );
}

function Tab({ title, href, children }) {
    const location = useLocation();
    const isActiveTab = location.pathname.startsWith(href);
    if (isActiveTab) {
        href = "#";
    }
    return (
        <Tooltip label={title} position="right" offset={-10}>
            <Link className={`${styles.tabItem} ${isActiveTab ? styles.activeTab : ""}`} to={href}>
                {/* <abbr className={styles.abbreviation} title={title}> */}
                {children}
                {/* </abbr> */}
            </Link>
        </Tooltip>
    );
}

export default Sidebar;
