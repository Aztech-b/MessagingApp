import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { TextInput, ActionIcon } from "@mantine/core";
import { useUserContext } from "./Context";
import socket from "./socket.js";
import { useParams } from "react-router";

function ChatInput({ setMessages, shouldScrollRef }) {
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
        setMessages((prev) => [...prev, { content: content, author: { username: user.username } }]);
        socket.emit("message", { content, chatId });
        setTypedMessage("");
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
