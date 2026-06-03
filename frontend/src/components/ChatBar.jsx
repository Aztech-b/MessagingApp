import { useEffect, useState } from "react";
import { data, Link } from "react-router";
import { Button, TextInput, ActionIcon, Modal, Stack } from "@mantine/core";
import { useUserContext } from "./Context";
import styles from "../styles/chatBar.module.css";
import { UsersRound, Plus } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import socket from "./socket";

function ChatBar() {
    const [chats, setChats] = useState([]);
    const { user } = useUserContext();
    const [newChatName, setNewChatName] = useState("");
    const [chatMembers, setChatMembers] = useState("");
    const [newChatModalOpened, { open, close }] = useDisclosure(false);

    useEffect(() => {
        async function GetAllChats() {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
                    method: "GET",
                    credentials: "include",
                });
                if (!response.ok) {
                    throw new Error("response is not ok");
                }
                const data = await response.json();
                setChats(data);
            } catch (error) {}
        }
        GetAllChats();
    }, []);
    return (
        <div className={styles.chats}>
            <Modal opened={newChatModalOpened} onClose={close} title="Create New Chat" centered>
                <Stack gap={"xl"}>
                    <Stack gap={"xs"}>
                        <TextInput
                            label="member username: "
                            onChange={(e) => {
                                setChatMembers([e.target.value]);
                            }}
                        ></TextInput>
                        <TextInput
                            label="Chat Name: "
                            onChange={(e) => {
                                setNewChatName(e.target.value);
                            }}
                        ></TextInput>
                    </Stack>
                    <Button
                        onClick={async (e) => {
                            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
                                method: "POST",
                                credentials: "include",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ title: newChatName, members: chatMembers }),
                            });
                            const data = await response.json();
                            console.log(data);
                            setChats((prev) => [{ id: data.id, title: data.title }, ...prev]);
                        }}
                    >
                        Create New Chat
                    </Button>
                </Stack>
            </Modal>
            {chats.map((chat) => (
                <Chat id={chat.id} title={chat.title} key={chat.id} />
            ))}
            <ActionIcon
                style={{
                    position: "sticky",
                    bottom: "12px",
                    marginRight: "2%",
                    marginLeft: "auto",
                    boxShadow: "0px 4px 4px #111111",
                    zIndex: 1,
                }}
                size={60}
                radius="xl"
                variant="filled"
                onClick={open}
            >
                <Plus size={40} strokeWidth={3} />{" "}
            </ActionIcon>
        </div>
    );
}

function Chat({ id, title, icon }) {
    useEffect(() => {
        socket.emit("join", { chatId: id });
        socket.on("newMessage", (data) => {});
    }, []);
    return (
        <Link to={`/chat/${id}`} className={styles.chatLink}>
            <button className={styles.chatButton}>
                {icon ?? <UsersRound />}
                <p className={styles.chatName}>{title}</p>
            </button>
        </Link>
    );
}

export default ChatBar;
