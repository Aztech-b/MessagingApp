import prisma from "../../lib/prisma.js";

// TODO: validate if user is in chat and can send messages
function registerChatSockets(io) {
    io.on("connection", (socket) => {
        if (!socket.request.user) {
            socket.disconnect(true);
            return;
        }

        socket.on("join", (data) => {
            socket.join(`chat:${data.chatId}`);
        });

        socket.on("message", async (data, callback) => {
            const { content, chatId } = data;
            const userId = socket.request.user.id;
            const newMessage = await prisma.message.create({
                data: { content, author: { connect: { id: userId } }, chat: { connect: { id: Number(chatId) } } },
                select: { id: true, content: true },
            });
            const sendData = {
                content: newMessage.content,
                author: { username: socket.request.user.username },
                chatId,
                id: newMessage.id,
            };
            socket.to(`chat:${data.chatId}`).emit("newMessage", sendData);
            callback(sendData);
        });
    });
}

export default registerChatSockets;
