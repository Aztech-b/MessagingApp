import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { io } from "../index.js";

const chatRouter = Router();

chatRouter.post("/", async (req, res) => {
    const { title, members } = req.body;
    if (!req.isAuthenticated()) {
        res.status(401).json({ status: "NOT_AUTHENTICATED" });
        return;
    }
    console.log(req.user);
    const newChat = await prisma.chat.create({
        data: { title, members: { connect: [{ id: req.user.id }, ...members.map((username) => ({ username }))] } },
    });
    res.json(newChat);
});

chatRouter.get("/", async (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ status: "NOT_AUTHENTICATED" });
        return;
    }
    const chats = await prisma.chat.findMany({
        where: { members: { some: { id: req.user.id } } },
        select: { id: true, title: true },
    });
    res.json(chats);
});

chatRouter.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const chat = await prisma.chat.findUnique({
            where: { id: Number(req.params.id) },
            select: { messages: { select: { content: true, author: { select: { username: true } } } } },
        });
        // console.dir(chat, { depth: null });
        res.json(chat);
        return;
    } catch (error) {
        console.group(error);
        res.status(404).json({ status: "CHAT_NOT_FOUND" });
        return;
    }
});

// TODO: validate if user is in chat and can send messages
chatRouter.post("/:id/message", async (req, res, next) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ status: "NOT_AUTHENTICATED" });
        return;
    }
    const { content } = req.body;
    const chatId = req.params.id;
    const userId = req.user.id;
    const newMessage = await prisma.message.create({
        data: { content, author: { connect: { id: userId } }, chat: { connect: { id: Number(chatId) } } },
    });
    res.json({ newMessage });
});

export default chatRouter;
