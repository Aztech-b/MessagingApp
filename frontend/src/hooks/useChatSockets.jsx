import { useEffect } from "react";
import { useNavigate } from "react-router";
import socket from "../components/socket";

/** @typedef {import("../components/types.js").newMessageData} */

function useChatSockets(chats, addChat, deleteChat, addNewMessage) {
    const navigate = useNavigate();

    useEffect(
        function JoinChatSocketRooms() {
            if (!chats || chats.length === 0) {
                return;
            }
            chats.forEach((chat) => {
                socket.emit("join", { chatId: chat.id });
            });
            return () => {
                chats.forEach((chat) => {
                    socket.emit("leave", { chatId: chat.id });
                });
            };
        },
        [chats],
    );

    useEffect(
        function NewMessage() {
            /** @param {newMessageData} data */
            function handleNewMessage(data) {
                addNewMessage(data);
            }
            socket.on("message:received", handleNewMessage);
            return () => socket.off("message:received", handleNewMessage);
        },
        [addNewMessage],
    );

    useEffect(function AddNewChat() {
        function addNewChat(data) {
            addChat(data);
        }
        socket.on("chat:created", addNewChat);
        return () => socket.off("chat:created", addNewChat);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(function DeleteChat() {
        function _deleteChat(data) {
            deleteChat(data);
            navigate("/app/chat");
        }
        socket.on("chat:deleted", _deleteChat);
        return () => {
            socket.off("chat:deleted", _deleteChat);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

export default useChatSockets;
