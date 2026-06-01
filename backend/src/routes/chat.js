import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { io } from "../index.js";

const chatRouter = Router();

// TODO: validate if user is in chat and can send messages
chatRouter.post("/:id/message", async (req, res, next) => {
    const { username, message } = req.body.message;
    const chatId = req.params.id;
    const authorId = await prisma.user.findUnique({ where: { username: username }, select: { id: true } });
    const newMessage = await prisma.message.create({
        data: { content: message, authorId: authorId.id, groupId: chatId },
    });
    io.emit("message", { username, message, groupId });
});

chatRouter.get("/:id", async (req, res) => {
    const { id } = req.params;
    const chat = await prisma.chat.findUnique({ where: { id }, select: { Messages: true, members: true } });
    res.json(chat);
});

chatRouter.post("/new", async (req, res) => {
    const { membersId, chatName, title } = req.body;
    const newChat = await prisma.chat.create({
        data: { title, members: { connect: membersId.map((id) => ({ id })) } },
    });
    res.json({ status: "SUCCSESS" });
});

chatRouter;

export default chatRouter;
