import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { Button, TextInput, ActionIcon, Modal, Stack, Indicator, Skeleton } from "@mantine/core";
import { useChatContext, useUserContext } from "./Context";
import styles from "../styles/chatBar.module.css";
import { UsersRound, Plus } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import socket from "./socket";
import { useForm } from "@mantine/form";
import { EVENT } from "../../../shared/socketEvents";

function ChatBar() {
    const { chats, addChat } = useChatContext();
    const { user } = useUserContext();
    const [newChatModalOpened, { open, close }] = useDisclosure(false);
    const { id } = useParams();
    const form = useForm({ initialValues: { chatMembers: "", title: "" } });

    useEffect(() => {
        function addNewChat(data) {
            console.log(data);
            addChat(data);
        }
        socket.on(EVENT.CHAT_CREATED, addNewChat);
        return () => socket.off(EVENT.CHAT_CREATED, addNewChat);
    });
    return (
        <div className={styles.chats}>
            <Modal opened={newChatModalOpened} onClose={close} title="Create New Chat" centered>
                <Stack gap={"xl"}>
                    <form
                        onSubmit={form.onSubmit((values) => {
                            const transformed = { ...values, chatMembers: [values.chatMembers, ...[user.username]] };
                            socket.emit(EVENT.CHAT_CREATE, transformed);
                        })}
                    >
                        <Stack gap={"xs"}>
                            <TextInput
                                label="member username: "
                                {...form.getInputProps("chatMembers")}
                                key={form.key("chatMembers")}
                            ></TextInput>
                            <TextInput
                                {...form.getInputProps("title")}
                                key={form.key("title")}
                                label="Chat Name: "
                            ></TextInput>
                        </Stack>
                        <Button type="submit">Create New Chat</Button>
                    </form>
                </Stack>
            </Modal>
            {chats?.length !== 0
                ? chats?.map((chat) => <ChatBarItem data={chat} key={chat.id} />)
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
    const { unreadCount } = useChatContext();

    return (
        <Indicator
            showZero={false}
            label={unreadCount[data.id]}
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
