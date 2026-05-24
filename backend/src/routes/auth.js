import { Router } from "express";
import prisma from "../../lib/prisma.js";

const authRouter = Router();

authRouter.post("/register", async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = await prisma.user.create({ data: { username, email, password } });
        res.status(200).json({ status: "SUCCESS" });
    } catch (error) {
        res.status(403).json({ status: "FAILURE" });
    }
});

export default authRouter;
