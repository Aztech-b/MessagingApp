import { useEffect } from "react";
import socket from "../components/socket";
import { EVENT } from "../../../shared/socketEvents.js";

/**
 * @typedef {import("./types.js").newMessageData} newMessageData
 */

function useCurrentMessagesSockets(user, chatId, scrollContainer, addMessage) {
    useEffect(
        function OnReceiveNewMessage() {
            socket.on(EVENT.MESSAGE.RECEIVED, addMessage);
            return () => {
                socket.off(EVENT.MESSAGE.RECEIVED, addMessage);
            };
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [chatId, user],
    );
}

export default useCurrentMessagesSockets;
