import { Router } from "express";
import prisma from "../../lib/prisma.js";

const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new Error("INVALID_INPUT");
        }

        const user = await prisma.user.create({ data: { username, password } });
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        res.status(200).json({ status: "SUCCESS" });
    } catch (error) {
        res.status(403).json({ status: "FAILURE", error: error });
    }
});

authRouter.post("/login", (req, res, next) => {
    res.json(req.user);
});

export default authRouter;
