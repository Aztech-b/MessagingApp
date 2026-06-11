import { EVENT } from "../../../shared/socketEvents.js";
import prisma from "../../lib/prisma.js";

function registerChatSockets(io, socket) {
    socket.on("join", (data) => {
        socket.join(`chat:${Number(data.chatId)}`);
    });

    socket.on("leave", (data) => {
        socket.leave(`chat:${Number(data.chatId)}`);
    });

    socket.on(EVENT.CHAT.CREATE, async (data) => {
        const { title, chatMembers } = data;
        const users = await prisma.user.findMany({
            where: { username: { in: chatMembers } },
            select: { username: true, id: true },
        });
        const newChat = await prisma.chat.create({
            data: { title, members: { create: [...users.map((user) => ({ userId: user.id }))] } },
            select: { id: true, title: true },
        });
        users.forEach((user) => {
            io.to(`user:${user.username}`).emit(EVENT.CHAT.CREATED, newChat);
        });
    });

    socket.on(EVENT.CHAT.DELETE, async (data) => {
        await prisma.chat.delete({ where: { id: data.chatId } });
        socket.emit(EVENT.CHAT.DELETED, data);
    });
}

export default registerChatSockets;
