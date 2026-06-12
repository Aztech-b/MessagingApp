import { useState, useEffect, useRef } from "react";
import { useUserContext, useChatContext } from "../components/Context";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";
import socket from "../components/socket";
import { EVENT } from "../../../shared/socketEvents";

/** @typedef {import("../components/types.js").ChatData} ChatData */

function useCurrentMessages(chatId, user) {
    /**
     * @type {[{ color: string, user: { username: string } }[]]}
     */
    const [members, setMembers] = useState(null);
    const [messages, setMessages] = useState([]);
    const isBottom = useRef(false);
    const shouldAutoScroll = useRef(true);

    const { setUsernames, lastReadMessages, setLastReadMessage } = useChatContext();
    const setActiveChatName = useOutletContext().setActiveChatName;

    const lastMessageId = useRef(0);
    const scrollContainer = useRef();
    const navigate = useNavigate();

    function IsNearBottom() {
        const container = scrollContainer.current;
        return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    }

    useEffect(
        function OnClientReadMessage() {
            if (!isBottom) {
                return;
            }
            if (messages.length === 0 || messages[messages.length - 1]?.author?.username === user?.username) {
                return;
            }

            console.log(messages);
            socket.emit(
                EVENT.MESSAGE.READ,
                { messageId: messages[messages.length - 1].id, chatId, username: user.username },
                () => {
                    setLastReadMessage(chatId, lastMessageId.current, true);
                },
            );
        },
        [isBottom.current, messages],
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
        [socket, user],
    );

    useEffect(
        function FetchData() {
            if (!user) {
                return;
            }
            async function GetChatData() {
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
                    console.log(data);
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
                    const { members } = data;
                    setMembers(members);
                    setActiveChatName(data.title);
                    setLastReadMessage(chatId, data.chatMember.lastReadMessageId);
                } catch (error) {
                    console.error(error);
                }
            }
            GetChatData();
        },
        [chatId, user],
    );

    return { messages, setMessages, members, lastReadMessages, isBottom };
}

export default useCurrentMessages;
