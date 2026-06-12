import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router";
import {
    Button,
    TextInput,
    ActionIcon,
    Modal,
    Stack,
    Indicator,
    Skeleton,
    Menu,
    Combobox,
    useCombobox,
} from "@mantine/core";
import { useChatContext, useUserContext } from "./Context";
import styles from "../styles/chatBar.module.css";
import { UsersRound, Plus } from "lucide-react";
import { useDisclosure } from "@mantine/hooks";
import socket from "./socket";
import { useForm } from "@mantine/form";
import { EVENT } from "../../../shared/socketEvents";
import useUserSearch from "../hooks/useUserSearch";

function ChatBar() {
    const { chats } = useChatContext();
    const { user } = useUserContext();
    const [newChatModalOpened, { open, close }] = useDisclosure(false);
    const { id } = useParams();
    const form = useForm({ initialValues: { chatMembers: "", title: "" } });

    const combobox = useCombobox({ onDropdownClose: () => combobox.resetSelectedOption() });
    const [searchLoading, { open: openLoading, close: closeLoading }] = useDisclosure();
    const [query, setQuery] = useState("");
    const { results } = useUserSearch(query);

    const shouldFilterOptions = !results.some((item) => item === query);
    const filteredOptions = shouldFilterOptions
        ? results.filter((item) => item.toLowerCase().includes(query.toLowerCase().trim()))
        : results;

    const options = results.map((result) => (
        <Combobox.Option value={result} key={result}>
            {result}
        </Combobox.Option>
    ));
    useEffect(() => {
        combobox.updateSelectedOptionIndex();
    }, [options]);

    return (
        <div className={styles.chats}>
            <Modal opened={newChatModalOpened} onClose={close} title="Create New Chat" centered>
                <Stack gap={"xl"}>
                    <form
                        onSubmit={form.onSubmit((values) => {
                            const transformed = { ...values, chatMembers: [values.chatMembers, ...[user.username]] };
                            socket.emit(EVENT.CHAT.CREATE, transformed);
                            close();
                        })}
                    >
                        <Stack gap={"xs"} mb={"lg"}>
                            <TextInput
                                {...form.getInputProps("title")}
                                key={form.key("title")}
                                label="Chat Name: "
                            ></TextInput>
                            <Combobox
                                store={combobox}
                                onOptionSubmit={(value) => {
                                    setQuery(value);
                                    combobox.closeDropdown();
                                }}
                            >
                                <Combobox.Target>
                                    <TextInput
                                        label="User to chat with: "
                                        placeholder="Type username..."
                                        value={query}
                                        onChange={(event) => {
                                            setQuery(event.target.value);
                                        }}
                                        onClick={() => {
                                            combobox.openDropdown();
                                        }}
                                        onFocus={() => {
                                            combobox.openDropdown();
                                        }}
                                        onBlur={() => {
                                            combobox.closeDropdown();
                                        }}
                                    />
                                </Combobox.Target>
                                <Combobox.Dropdown>
                                    <Combobox.Options>{options}</Combobox.Options>
                                </Combobox.Dropdown>
                            </Combobox>
                        </Stack>
                        <Button type="submit">Create New Chat</Button>
                    </form>
                </Stack>
            </Modal>
            {chats
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
                                <UsersRound className={styles.icon} />
                            </div>
                        )}
                        <p className={styles.chatName}>{data.title}</p>
                    </div>
                    <ContextMenu id={data.id} />
                </button>
            </Link>
        </Indicator>
    );
}

function ContextMenu({ id }) {
    const navigate = useNavigate();

    return (
        <>
            <Menu classNames={{ dropdown: styles.dropdown, item: styles.item }}>
                <Menu.Target>
                    <div
                        className={styles.menuButton}
                        onClick={(event) => {
                            event.stopPropagation();
                            event.preventDefault();
                        }}
                    >
                        ...
                    </div>
                </Menu.Target>

                <Menu.Dropdown
                // style={{ backgroundColor: "var(--accent-light)", border: 0, boxShadow: "0 0 8px black" }}
                // styles={{ dropdown: { backgroundColor: "var(--accent-dark)", border: 0 } }}
                >
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item>Edit</Menu.Item>
                    <Menu.Item
                        color="red"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            socket.emit(EVENT.CHAT.DELETE, { chatId: id });
                        }}
                    >
                        Delete
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </>
    );
}

export default ChatBar;
