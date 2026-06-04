import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { TextInput, ActionIcon } from "@mantine/core";
import { useUserContext } from "./Context";
import socket from "./socket.js";
import { useParams } from "react-router";

function ChatInput({ setMessages, setSendingMessages, shouldScrollRef }) {
    const [typedMessage, setTypedMessage] = useState("");
    const { user } = useUserContext();
    const [canSend, setCanSend] = useState(false);
    const chatId = Number(useParams().id);

    async function SendMessage() {
        if (typedMessage === "") {
            return;
        }
        shouldScrollRef.current = true;
        const content = typedMessage;
        const tempId = crypto.randomUUID();
        socket.emit("message", { content, chatId }, tempId, (data, tempId) => {
            setMessages((prev) => [...prev, data]);
            setSendingMessages((prev) =>
                prev.filter((message) => {
                    message.tempId === tempId;
                }),
            );
        });
        setTypedMessage("");
        setSendingMessages((prev) => [...prev, { content, author: { username: user.username }, tempId }]);
        setCanSend(false);
    }

    return (
        <TextInput
            value={typedMessage}
            size="md"
            radius={2}
            placeholder="Write you message here..."
            styles={{ input: { backgroundColor: "var(--accent)", border: 0, flexShrink: 0 } }}
            rightSection={
                <SendButton
                    isActive={canSend}
                    onClick={(e) => {
                        SendMessage();
                    }}
                />
            }
            rightSectionPointerEvents="all"
            onChange={(e) => {
                setTypedMessage(e.target.value);
                setCanSend(e.target.value !== "");
            }}
            onKeyDown={(e) => {
                if (e.key !== "Enter") {
                    return;
                }
                SendMessage();
            }}
        ></TextInput>
    );
}

function SendButton({ isActive, onClick }) {
    const inactiveColor = "#6b6375";
    const activeColor = "var(--accent-light-2xl)";
    return (
        <ActionIcon variant="transparent" onClick={onClick}>
            <SendHorizontal color={isActive ? activeColor : inactiveColor} />
        </ActionIcon>
    );
}

export default ChatInput;
