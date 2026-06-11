import socket from "../components/socket";
import { useEffect } from "react";
import { EVENT } from "../../../shared/socketEvents.js";
/** @typedef {import("../components/types.js").newMessageData} */

function useChatSockets(chats, addChat, deleteChat, addNewMessage) {
    useEffect(
        function JoinChatSocketRooms() {
            if (!chats || chats.length === 0) {
                return;
            }
            for (let i = 0; i < chats.length; i++) {
                const id = chats[i].id;
                socket.emit("join", { chatId: id });
            }
            return () => {
                for (let i = 0; i < chats.length; i++) {
                    const id = chats[i].id;
                    socket.emit("leave", { chatId: id });
                }
            };
        },
        [chats.length],
    );

    useEffect(function NewMessage() {
        /** @param {newMessageData} data */
        function handleNewMessage(data) {
            addNewMessage(data);
        }
        socket.on("newMessage", handleNewMessage);
        return () => socket.off("newMessage", handleNewMessage);
    }, []);

    useEffect(function AddNewChat() {
        function addNewChat(data) {
            console.log(data);
            addChat(data);
        }
        socket.on(EVENT.CHAT.CREATED, addNewChat);
        return () => socket.off(EVENT.CHAT.CREATED, addNewChat);
    });

    useEffect(function DeleteChat() {
        function _deleteChat(data) {
            deleteChat(data);
        }
        socket.on(EVENT.CHAT.DELETED, _deleteChat);
        return () => {
            socket.off(EVENT.CHAT.DELETED, _deleteChat);
        };
    }, []);
}

export default useChatSockets;
