import socket from "../components/socket";
import { useEffect } from "react";
/** @typedef {import("../components/types.js").newMessageData} */

function useChatSockets(chats, addNewMessage) {
    useEffect(
        function JoinSocket() {
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
}

export default useChatSockets;
