import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { Button, TextInput, ActionIcon, Modal, Stack, Indicator, Skeleton, Menu } from "@mantine/core";
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
            label={unreadCount[data.id] || 0}
            color="var(--accent-saturated)"
            autoContrast
            position="middle-end"
            offset={{ x: 20 }}
            size={24}
            style={{ fontWeight: "bold" }}
        >
            <Link to={`/chat/${data.id}`} className={styles.chatLink}>
                <button className={styles.chatButton}>
                    <div className={styles.content}>
                        {icon ?? (
                            <div style={{ height: "100%", width: "auto" }}>
                                <UsersRound
                                    height={"calc(var(--chat-height) - 12px)"}
                                    width={"calc(var(--chat-height) - 12px)"}
                                />
                            </div>
                        )}
                        <p className={styles.chatName}>{data.title}</p>
                    </div>
                    <ContextMenu />
                </button>
            </Link>
        </Indicator>
    );
}

function ContextMenu() {
    return (
        <>
            <Menu>
                <Menu.Target>
                    <button
                        className={styles.menuButton}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                        }}
                    >
                        ...
                    </button>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item>Edit</Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    );
}

export default ChatBar;
