import { EVENT } from "../../../shared/socketEvents.js";
import prisma from "../../lib/prisma.js";

function registerMessageSockets(io, socket) {
    socket.on(EVENT.MESSAGE.READ, async (data, callback) => {
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
            socket.to(`chat:${Number(data.chatId)}`).emit(EVENT.MESSAGE.EVERYONE_READ, { messageId: data.messageId });
        }
    });

    socket.on(EVENT.MESSAGE.SEND, async (data, callback) => {
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
        io.to(`chat:${Number(data.chatId)}`).emit(EVENT.MESSAGE.RECEIVED, sendData);
        callback(sendData);
    });
}

export default registerMessageSockets;
