import { useEffect } from "react";
import socket from "../components/socket";

/**
 * @typedef {import("./types.js").newMessageData} newMessageData
 */
function useCurrentMessagesSockets(user, chatId, scrollContainer, addMessage) {
    useEffect(
        function OnReceiveNewMessage() {
            socket.on("message:received", addMessage);
            return () => {
                socket.off("message:received", addMessage);
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [chatId, user],
    );
}

export default useCurrentMessagesSockets;
