import { useEffect, useState } from "react";
import { SendHorizontal } from "lucide-react";
import { TextInput, ActionIcon, Textarea } from "@mantine/core";
import socket from "./socket.js";
import { useParams } from "react-router";
import { useUserContext } from "./Context.jsx";

function ChatInput({ setMessages, shouldScrollRef }) {
    const [typedMessage, setTypedMessage] = useState("");
    const { user } = useUserContext();
    const [canSend, setCanSend] = useState(false);
    const chatId = Number(useParams().id);

    async function SendMessage() {
        if (typedMessage === "") {
            return;
        }
        setTypedMessage("");
        shouldScrollRef.current = true;
        const content = typedMessage;
        const tempId = crypto.randomUUID();
        socket.emit("message", { content, chatId }, (data) => {
            setMessages((prev) =>
                prev.map((message, index) => {
                    if (message.id === tempId) {
                        socket.emit("readMessage", { username: user.username, chatId, messageId: data.id });

                        return { ...message, status: "sent", id: data.id };
                    }
                    return message;
                }),
            );
        });
        setMessages((prev) => [
            ...prev,
            { content, author: { username: user.username }, id: tempId, status: "sending", sent: Date.now() },
        ]);
        setCanSend(false);
    }

    return (
        <Textarea
            minRows={1}
            value={typedMessage}
            size="md"
            radius={2}
            placeholder="Write you message here..."
            styles={{ input: { backgroundColor: "var(--accent)", border: 0, flexShrink: 0, zIndex: 2 } }}
            autosize={true}
            maxRows={6}
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
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    SendMessage();
                }
            }}
        ></Textarea>
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
