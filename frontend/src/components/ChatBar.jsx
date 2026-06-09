import { useEffect, useRef, useState } from "react";
import { data, Link, useParams } from "react-router";
import { Button, TextInput, ActionIcon, Modal, Stack, Indicator, Skeleton } from "@mantine/core";
import { useChatContext, useUserContext } from "./Context";
import styles from "../styles/chatBar.module.css";
import { UsersRound, Plus } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import socket from "./socket";
import { useUnreadMessagesContext } from "./ChatTab";

function ChatBar() {
    const { chats, setChats } = useChatContext();
    const { user } = useUserContext();
    const [newChatName, setNewChatName] = useState("");
    const [chatMembers, setChatMembers] = useState("");
    const [newChatModalOpened, { open, close }] = useDisclosure(false);
    const { id } = useParams();

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
                            setChats((prev) => [{ id: data.id, title: data.title }, ...prev]);
                        }}
                    >
                        Create New Chat
                    </Button>
                </Stack>
            </Modal>
            {chats?.length !== 0
                ? chats.map((chat) => <ChatBarItem data={chat} key={chat.id} />)
                : Array.from({ length: 5 }).map((_, index) => <ChatBarItemSkeleton key={index} />)}
            <ActionIcon
                style={{
                    position: "sticky",
                    bottom: "20px",
                    marginTop: "auto",
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

function ChatBarItemSkeleton() {
    return (
        <div className={styles.chatButton}>
            <Skeleton circle style={{ height: "100%", width: "auto", aspectRatio: "1 / 1", flexShrink: 0 }}></Skeleton>
            <Skeleton height={16}></Skeleton>
        </div>
    );
}

function ChatBarItem({ data, icon }) {
    const unreadMessages = useUnreadMessagesContext();
    console.log(typeof unreadMessages[29]);
    console.dir(unreadMessages);
    return (
        <Indicator
            showZero={false}
            label={unreadMessages[data.id]}
            color="var(--accent-saturated)"
            autoContrast
            position="middle-end"
            offset={{ x: 20 }}
            size={24}
            style={{ fontWeight: "bold" }}
        >
            <Link to={`/chat/${data.id}`} className={styles.chatLink}>
                <button className={styles.chatButton}>
                    {icon ?? (
                        <div style={{ height: "100%", width: "auto" }}>
                            <UsersRound height={"100%"} width={"100%"} />
                        </div>
                    )}
                    <p className={styles.chatName}>{data.title}</p>
                </button>
            </Link>
        </Indicator>
    );
}

export default ChatBar;
