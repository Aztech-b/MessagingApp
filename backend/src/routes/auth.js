import { Router } from "express";
import prisma from "../../lib/prisma.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";

const authRouter = Router();

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { username: username } });

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }

            const match = await bcryptjs.compare(password, user.password);

            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    }),
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id: id }, select: { username: true } });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

authRouter.post("/register", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            throw new Error("INVALID_INPUT");
        }

        const hashedPassword = await bcryptjs.hash(password, Number(process.env.SALT_LENGTH));

        const user = await prisma.user.create({
            data: { username, password: hashedPassword },
            select: { username: true },
        });
        if (!user) {
            throw new Error("USER_CREATION_ERROR");
        }

        res.status(200).json({ user });
    } catch (error) {
        console.log(error);
        res.json({ error });
    }
});

authRouter.post("/login", passport.authenticate("local"), (req, res, next) => {
    const { id, password, ...user } = req.user;
    res.json(user);
});

authRouter.get("/", (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ status: "NOT_AUTHENTICATED" });
        return;
    }
    const { id, password, ...user } = req.user;
    res.json(user);
});

export default authRouter;
