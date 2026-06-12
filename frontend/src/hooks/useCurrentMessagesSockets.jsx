import { useEffect } from "react";
import socket from "../components/socket";
import { EVENT } from "../../../shared/socketEvents.js";

/**
 * @typedef {import("./types.js").newMessageData} newMessageData
 */

function useCurrentMessagesSockets(shouldAutoScroll, user, chatId, scrollContainer, setMessages) {
    function IsNearBottom() {
        const container = scrollContainer.current;

        return container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    }

    useEffect(
        function OnReceiveNewMessage() {
            /** @param {newMessageData} data */
            function handleNewMessage(data) {
                if (data.chatId !== chatId || data.author.username === user.username) {
                    return;
                }
                const shouldScroll = IsNearBottom();
                shouldAutoScroll.current = shouldScroll;
                setMessages((prev) => [...prev, { ...data, status: "other" }]);
            }

            socket.on(EVENT.MESSAGE.RECEIVED, handleNewMessage);
            return () => {
                socket.off(EVENT.MESSAGE.RECEIVED, handleNewMessage);
            };
        },
        [chatId],
    );
}

export default useCurrentMessagesSockets;
