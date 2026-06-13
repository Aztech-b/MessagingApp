import { useState, useEffect, useRef } from "react";
import { useChatContext } from "../components/Context";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";
import socket from "../components/socket";
import { EVENT } from "../../../shared/socketEvents";

/** @typedef {import("../components/types.js").ChatData} ChatData */
/** @typedef {import("../components/types.js").newMessageData} MessageData */

function useCurrentMessages(chatId, user, setShouldScroll) {
    /**
     * @type {[{ color: string, user: { username: string } }[]]}
     */
    const [members, setMembers] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isBottom, setIsBottom] = useState(false);

    const { setUsernames, lastReadMessages, setLastReadMessage } = useChatContext();
    const setActiveChatName = useOutletContext().setActiveChatName;

    const lastMessageId = useRef(0);
    const navigate = useNavigate();

    /** @param {MessageData} messageData */
    const sendMessage = (messageData) => {
        if (messageData.content === "") {
            return;
        }
        const content = messageData.content;
        const tempId = crypto.randomUUID();
        const username = user.username;
        socket.emit(EVENT.MESSAGE.SEND, { content, chatId, username }, (data) => {
            setMessages((prev) =>
                prev.map((message) => {
                    if (message.id === tempId) {
                        socket.emit(EVENT.MESSAGE.READ, { username, chatId, messageId: data.id });

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
        setShouldScroll(true);
    };

    /** @param {MessageData} messageData */
    const addMessage = (messageData) => {
        if (messageData.chatId !== chatId || messageData.author.username === user.username) {
            return;
        }
        setMessages((prev) => [...prev, { ...messageData, status: "other" }]);
        setShouldScroll(true);
    };

    useEffect(
        function OnClientReadMessage() {
            if (!isBottom) {
                return;
            }
            if (messages.length === 0 || messages[messages.length - 1]?.author?.username === user?.username) {
                return;
            }

            socket.emit(
                EVENT.MESSAGE.READ,
                { messageId: messages[messages.length - 1].id, chatId, username: user.username },
                () => {
                    setLastReadMessage(chatId, lastMessageId.current, true);
                },
            );
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsBottom(false);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [isBottom, messages, chatId, user],
    );

    useEffect(
        function OnOurMessageIsRead() {
            if (!socket || !user) {
                return;
            }
            function handleRead(data) {
                setMessages((prev) => {
                    return prev.map((message) => {
                        return message.id <= data.messageId && message.author.username === user.username
                            ? { ...message, status: "read" }
                            : message;
                    });
                });
            }

            socket.on(EVENT.MESSAGE.EVERYONE_READ, handleRead);
            return () => {
                socket.off(EVENT.MESSAGE.EVERYONE_READ, handleRead);
            };
        },
        [user],
    );

    useEffect(() => {
        async function FetchData() {
            if (!user) {
                return;
            }
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/chat/${chatId}`, {
                    method: "GET",
                    credentials: "include",
                });

                if (response.status === 404 || response.status === 401) {
                    navigate("/app/chat");
                    return;
                }

                /** @type {ChatData} */
                let data = await response.json();
                setUsernames(data.members.map((member) => member.user.username));
                const messagesFromDatabase = data.messages.map((message) => {
                    let status = "";
                    if (message.author.username === user?.username) {
                        status = "sent";
                    }
                    return { ...message, status };
                });
                if (!response.ok) {
                    throw new Error("response is not ok");
                }
                setMessages(
                    messagesFromDatabase.map((message) => {
                        if (data.allReadMessageId >= message.id && message.author.username === user.username) {
                            return { ...message, status: "read" };
                        }
                        return message;
                    }),
                );
                setShouldScroll(true);
                const { members } = data;
                setMembers(members);
                setActiveChatName(data.title);
                setLastReadMessage(chatId, data.chatMember.lastReadMessageId);
            } catch (error) {
                console.error(error);
            }
        }
        FetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chatId, user]);

    return { messages, setMessages, members, lastReadMessages, setIsBottom, sendMessage, addMessage };
}

export default useCurrentMessages;
