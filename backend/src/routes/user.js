import { Router } from "express";
import prisma from "../../lib/prisma.js";

const userRouter = Router();

userRouter.get("/search", async (req, res) => {
    const query = req.query.query;

    const foundUsers = await prisma.user.findMany({
        where: { username: { startsWith: query } },
        select: { username: true },
        take: 10,
    });

    const result = foundUsers.map((user) => user.username);
    console.log(`foundUsers ${result}`);

    res.json(result);
});

export default userRouter;
