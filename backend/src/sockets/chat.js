import { EVENT } from "../../../shared/socketEvents.js";
import prisma from "../../lib/prisma.js";

// TODO: validate if user is in chat and can send messages
function registerChatSockets(io) {
    io.on("connection", (socket) => {
        if (!socket.request.user) {
            socket.disconnect(true);
            return;
        }

        socket.on("join", (data) => {
            socket.join(`chat:${Number(data.chatId)}`);
        });

        socket.on("joinUser", (data) => {
            socket.join(`user:${data.username}`);
        });

        socket.on("leave", (data) => {
            socket.leave(`chat:${Number(data.chatId)}`);
        });

        socket.on("leaveUser", (data) => {
            socket.leave(`user:${data.username}`);
        });

        socket.on("readMessage", async (data, callback) => {
            if (callback) {
                callback();
            }
            const userId = await prisma.user.findUnique({ where: { username: data.username }, select: { id: true } });
            await prisma.chatMember.update({
                where: { userId_chatId: { userId: userId.id, chatId: data.chatId } },
                data: { lastReadMessageId: data.messageId },
            });

            const lastReadMessages = await prisma.chatMember.findMany({
                where: { chatId: data.chatId },
                select: { lastReadMessageId: true },
            });
            lastReadMessages.sort((a, b) => a.lastReadMessageId - b.lastReadMessageId);
            if (lastReadMessages[0].lastReadMessageId >= data.messageId) {
                socket.to(`chat:${Number(data.chatId)}`).emit("everyoneReadMessage", { messageId: data.messageId });
            }
        });

        socket.on("message", async (data, callback) => {
            const { content, chatId } = data;
            const userId = socket.request.user.id;
            const newMessage = await prisma.message.create({
                data: { content, author: { connect: { id: userId } }, chat: { connect: { id: Number(chatId) } } },
                omit: { authorId: true },
            });
            await prisma.chatMember.update({
                where: { userId_chatId: { chatId, userId } },
                data: { lastReadMessageId: newMessage.id },
            });

            /**
             * @type {{id: number, content: string, chatId: number, sent: string, author: {username: string}}}
             */
            const sendData = { ...newMessage, author: { username: socket.request.user.username } };
            io.to(`chat:${Number(data.chatId)}`).emit("newMessage", sendData);
            callback(sendData);
        });

        socket.on(EVENT.CHAT_CREATE, async (data) => {
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
                io.to(`user:${user.username}`).emit(EVENT.CHAT_CREATED, newChat);
            });
        });
    });
}

export default registerChatSockets;
