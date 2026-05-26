import { Router } from "express";
import prisma from "../../lib/prisma.js";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const authRouter = Router();

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { username: username } });

            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }

            if (user.password !== password) {
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

        const user = await prisma.user.create({ data: { username, password } });
        if (!user) {
            throw new Error("USER_NOT_FOUND");
        }

        res.status(200).json({ status: "SUCCESS" });
    } catch (error) {
        res.status(403).json({ status: "FAILURE", error: error });
    }
});

authRouter.post("/login", passport.authenticate("local"), (req, res, next) => {
    res.json(req.user);
});

authRouter.get("/", (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ status: "NOT_AUTHENTICATED" });
        return;
    }
    res.json(req.user);
});

export default authRouter;
