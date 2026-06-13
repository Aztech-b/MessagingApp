import { useEffect } from "react";
import socket from "../components/socket";
import { EVENT } from "../../../shared/socketEvents.js";

/**
 * @typedef {import("./types.js").newMessageData} newMessageData
 */

function useCurrentMessagesSockets(user, chatId, scrollContainer, setMessages) {
    useEffect(
        function OnReceiveNewMessage() {
            /** @param {newMessageData} data */
            function handleNewMessage(data) {
                if (data.chatId !== chatId || data.author.username === user.username) {
                    return;
                }
                setMessages((prev) => [...prev, { ...data, status: "other" }]);
            }

            socket.on(EVENT.MESSAGE.RECEIVED, handleNewMessage);
            return () => {
                socket.off(EVENT.MESSAGE.RECEIVED, handleNewMessage);
            };
        },
        [chatId, scrollContainer, setMessages, user],
    );
}

export default useCurrentMessagesSockets;
