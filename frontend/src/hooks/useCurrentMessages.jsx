import { useState, useEffect, useRef } from "react";
import { useUserContext, useChatContext } from "../components/Context";
import { useNavigate } from "react-router";
import { useOutletContext } from "react-router";
import socket from "../components/socket";

function useCurrentMessages(chatId) {
    /**
     * @type {[{ color: string, user: { username: string } }[]]}
     */
    const [members, setMembers] = useState(null);
    const [messages, setMessages] = useState([]);
    const [isBottom, setIsBottom] = useState(false);
    const shouldAutoScroll = useRef(true);

    const { lastReadMessages, setLastReadMessage } = useChatContext();
    const setActiveChatName = useOutletContext().setActiveChatName;

    const lastMessageId = useRef(0);
    const scrollContainer = useRef();

    const { user } = useUserContext();
    const navigate = useNavigate();

    function IsNearBottom() {
        const container = scrollContainer.current;

        return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    }

    // useEffect(
    //     function SetLastMessageId() {
    //         if (messages.length > 0) {
    //             lastMessageId.current = messages[messages.length - 1].id;
    //         }
    //     },
    //     [messages],
    // );

    // useEffect(
    //     function OnClientReadMessage() {
    //         if (!isBottom) {
    //             return;
    //         }
    //         if (lastReadMessageId === lastMessageId.current) {
    //             return;
    //         }
    //         if (messages[messages.length - 1]?.author?.username === user?.username) {
    //             return;
    //         }

    //         socket.emit(
    //             "readMessage",
    //             { messageId: messages[messages.length - 1].id, chatId, username: user.username },
    //             () => {
    //                 setLastReadMessage(chatId, lastMessageId.current, true);
    //             },
    //         );
    //     },
    //     [isBottom, messages],
    // );

    // useEffect(
    //     function OnOurMessageIsRead() {
    //         if (!socket || !user) {
    //             return;
    //         }
    //         function handleRead(data) {
    //             setMessages((prev) => {
    //                 return prev.map((message) => {
    //                     return message.id <= data.messageId && message.author.username === user.username
    //                         ? { ...message, status: "read" }
    //                         : message;
    //                 });
    //             });
    //         }

    //         socket.on("everyoneReadMessage", handleRead);
    //         return () => {
    //             socket.off("everyoneReadMessage", handleRead);
    //         };
    //     },
    //     [socket, user],
    // );

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
                        navigate("/chat");
                        return;
                    }

                    /** @type {ChatData} */
                    let data = await response.json();
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

    return { messages, setMessages, members, lastReadMessages };
}

export default useCurrentMessages;
