import { Router } from "express";
import prisma from "../../lib/prisma.js";

const chatRouter = Router();

chatRouter.post("/", async (req, res) => {
    const { title, members } = req.body;
    if (!req.isAuthenticated()) {
        res.status(401).json({ status: "NOT_AUTHENTICATED" });
        return;
    }
    const users = await prisma.user.findMany({ where: { username: { in: members } }, select: { id: true } });
    const newChat = await prisma.chat.create({
        data: {
            title,
            members: {
                create: [{ userId: req.user.id, lastReadMessageId: 0 }, ...users.map((user) => ({ userId: user.id }))],
            },
        },
    });
    res.json(newChat);
});

chatRouter.get("/", async (req, res) => {
    if (!req.isAuthenticated()) {
        res.status(401).json({ status: "NOT_AUTHENTICATED" });
        return;
    }
    const chats = await prisma.chat.findMany({
        where: { members: { some: { user: { id: req.user.id } } } },
        select: { id: true, title: true },
    });
    res.json(chats);
});

chatRouter.get("/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const chat = await prisma.chat.findUnique({
            where: { id: Number(req.params.id) },
            select: {
                messages: { select: { id: true, content: true, author: { select: { username: true } } } },
                title: true,
            },
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

// I guess this route is no longer needed as writing to database is handeled by sockets
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
