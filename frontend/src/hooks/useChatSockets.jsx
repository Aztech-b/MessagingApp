import socket from "../components/socket";
import { useEffect } from "react";
import { EVENT } from "../../../shared/socketEvents.js";
import { useNavigate } from "react-router";

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
            socket.on(EVENT.MESSAGE.RECEIVED, handleNewMessage);
            return () => socket.off(EVENT.MESSAGE.RECEIVED, handleNewMessage);
        },
        [addNewMessage],
    );

    useEffect(function AddNewChat() {
        function addNewChat(data) {
            addChat(data);
        }
        socket.on(EVENT.CHAT.CREATED, addNewChat);
        return () => socket.off(EVENT.CHAT.CREATED, addNewChat);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(function DeleteChat() {
        function _deleteChat(data) {
            deleteChat(data);
            navigate("/app/chat");
        }
        socket.on(EVENT.CHAT.DELETED, _deleteChat);
        return () => {
            socket.off(EVENT.CHAT.DELETED, _deleteChat);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
}

export default useChatSockets;
