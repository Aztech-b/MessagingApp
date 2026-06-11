import { EVENT } from "../../../shared/socketEvents.js";
import prisma from "../../lib/prisma.js";
import registerUserSockets from "./user.socket.js";
import registerChatSockets from "./chat.socket.js";
import registerMessageSockets from "./message.socket.js";

// TODO: validate if user is in chat and can send messages
function registerSockets(io) {
    io.on("connection", (socket) => {
        if (!socket.request.user) {
            socket.disconnect(true);
            return;
        }

        registerUserSockets(io, socket);
        registerChatSockets(io, socket);
        registerMessageSockets(io, socket);
    });
}

export default registerSockets;
