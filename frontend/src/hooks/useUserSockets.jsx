import { useEffect } from "react";
import socket from "../components/socket";

function useUserSockets(user) {
    useEffect(
        function joinUserSocketRoom() {
            const username = { username: user ? user.username : null };
            socket.emit("joinUser", username);
            return () => socket.emit("leaveUser", username);
        },
        [user],
    );
}

export default useUserSockets;
