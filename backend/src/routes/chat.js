import { Router } from "express";
import prisma from "../../lib/prisma.js";
import { io } from "../index.js";

const chatRouter = Router();

chatRouter.post("/message", async (req, res, next) => {
    const { username, message, groupId } = req.body.message;
    const authorId = prisma.user.findUnique({ where: { username: username }, select: { id: true } });
    const newMessage = prisma.message.create({ data: { content: message, authorId: authorId, groupId: groupId } });
    io.emit("message", { username, message, groupId });
});

export default chatRouter;
