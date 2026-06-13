import { useState } from "react";
import { SendHorizontal } from "lucide-react";
import { ActionIcon, Textarea } from "@mantine/core";

function ChatInput({ sendMessage }) {
    const [typedMessage, setTypedMessage] = useState("");
    const [canSend, setCanSend] = useState(false);

    async function SendMessage() {
        sendMessage({ content: typedMessage });
        setTypedMessage("");
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
                    onClick={() => {
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
