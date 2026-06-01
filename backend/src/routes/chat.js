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
    try {
        const chat = await prisma.chat.findUnique({ where: { id }, select: { Messages: true, members: true } });
    } catch (error) {
        res.status(404).json({ status: "CHAT_NOT_FOUND" });
        return;
    }
    res.json(chat);
});

chatRouter.post("/", async (req, res) => {
    const { title } = req.body;
    if (!req.isAuthenticated()) {
        res.status(401).json({ status: "NOT_AUTHENTICATED" });
        return;
    }
    console.log(req.user);

    const newChat = await prisma.chat.create({
        data: { title, members: { connect: { id: req.user.id } } },
        select: { id: true, title: true },
    });
    res.json(newChat);
});

chatRouter;

export default chatRouter;
