import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { io } from "../index.js";

const chatRouter = Router();

// TODO: validate if user is in chat and can send messages
chatRouter.post("/:id/message", async (req, res, next) => {
    const { username, message } = req.body.message;
    const chatId = req.params.id;
    const authorId = prisma.user.findUnique({ where: { username: username }, select: { id: true } });
    const newMessage = prisma.message.create({ data: { content: message, authorId: authorId, groupId: groupId } });
    io.emit("message", { username, message, groupId });
});

chatRouter.get("chat", async (req, res) => {
    const { id } = req.body;
    const chat = prisma.chat.findUnique({ where: { id }, select: { Messages: true, members: true } });
    req.json(chat);
});

chatRouter;

export default chatRouter;
