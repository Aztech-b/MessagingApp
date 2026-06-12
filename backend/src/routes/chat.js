import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { GetLatestAllReadMessageId } from "../controllers/chat.controller.js";

const chatRouter = Router();

chatRouter.post("/", async (req, res) => {
    const { title, chatMember } = req.body;
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

    const memberships = await prisma.chatMember.findMany({
        where: { userId: req.user.id },
        select: { chatId: true, lastReadMessageId: true, chat: { select: { id: true, title: true } } },
    });

    const result = await Promise.all(
        memberships.map(async (message) => {
            const unreadCount = await prisma.message.count({
                where: { chatId: message.chatId, id: { gt: message.lastReadMessageId } },
            });

            return {
                id: message.chat.id,
                title: message.chat.title,
                unreadCount,
                lastReadMessageId: message.lastReadMessageId,
            };
        }),
    );

    res.json(result);
});

chatRouter.get("/:id", async (req, res) => {
    const userId = Number(req.user.id);
    const chatId = Number(req.params.id);
    const before = Number(req.query.before);
    const messageWhere = before ? { id: { lt: before } } : {};
    try {
        const chatMember = await prisma.chatMember.findUnique({
            where: { userId_chatId: { userId, chatId } },
            select: { lastReadMessageId: true, color: true },
        });
        if (!chatMember) {
            res.status(404).json({ status: "NOT_FOUND" });
            return;
        }
        const chat = await prisma.chat.findUnique({
            where: { id: chatId },
            select: {
                messages: {
                    where: messageWhere,
                    take: 50,
                    orderBy: { id: "desc" },
                    select: { id: true, content: true, author: { select: { username: true } }, sent: true },
                },
                title: true,
                members: { select: { color: true, user: { select: { username: true } } } },
            },
        });
        chat.messages.reverse();
        const allReadMessageId = await GetLatestAllReadMessageId({ username: req.user.username, chatId });
        if (chat.messages.length === 0) {
            res.json({ status: "NO_MORE_MESSAGES" });
            return;
        }
        res.json({ ...chat, allReadMessageId, chatMember });
        return;
    } catch (error) {
        console.log(error);
        res.status(404).json({ status: "CHAT_NOT_FOUND", chatId: req.params.id });
        return;
    }
});

// I guess this route is no longer needed as writing to database is handled by sockets
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
