import prisma from "../../lib/prisma.js";

function registerChatSockets(io, socket) {
    socket.on("join", (data) => {
        socket.join(`chat:${Number(data.chatId)}`);
    });

    socket.on("leave", (data) => {
        socket.leave(`chat:${Number(data.chatId)}`);
    });

    socket.on("chat:create", async (data) => {
        const { title, chatMembers } = data;
        if (chatMembers.length !== 2) {
            // 1 is the client that emitted the event, the other one is someone that the emitter wants to chat with
            socket.emit("chat:error", { status: "USER_NOT_FOUND" }); // users.length must not be other than 2
            return;
        }
        const users = await prisma.user.findMany({
            where: { username: { in: chatMembers } },
            select: { username: true, id: true },
        });
        const newChat = await prisma.chat.create({
            data: { title, members: { create: [...users.map((user) => ({ userId: user.id }))] } },
            select: { id: true, title: true },
        });
        users.forEach((user) => {
            io.to(`user:${user.username}`).emit("chat:created", {
                ...newChat,
                members: users.map((user) => user.username),
            });
        });
    });

    socket.on("chat:delete", async (data) => {
        const users = await prisma.chat.findUnique({
            where: { id: data.chatId },
            select: { members: { select: { user: { select: { username: true } } } } },
        });
        await prisma.chat.delete({ where: { id: data.chatId } });
        users.members.forEach((user) => {
            io.to(`user:${user.user.username}`).emit("chat:deleted", data);
        });
    });
}

export default registerChatSockets;
