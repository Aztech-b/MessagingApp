import bcryptjs from "bcryptjs";
import { Router } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../../lib/prisma.js";
import { loginSchema } from "../../lib/zod.js";

const authRouter = Router();

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await prisma.user.findUnique({ where: { username } });

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
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

authRouter.post("/register", async (req, res, next) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success) {
            res.status(401).json({ message: parsed.error.issues[0].message });
            return;
        }
        const { username, password } = parsed.data;

        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            res.status(401).json({ message: "User already exists, pick another username or go login" });
            return;
        }

        const hashedPassword = await bcryptjs.hash(password, Number(process.env.SALT_LENGTH));
        const user = await prisma.user.create({
            data: { username, password: hashedPassword },
            select: { username: true, id: true },
        });
        if (!user) {
            throw new Error("USER_CREATION_ERROR");
        }

        req.logIn(user, (error) => {
            if (error) {
                return next(error);
            }
            return res.json(user);
        });
    } catch (error) {
        res.json(error);
    }
});

authRouter.post("/login", (req, res, next) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.json({ message: parsed.error.issues[0].message });
    }

    passport.authenticate("local", (error, user, info) => {
        if (!user) {
            return res.status(401).json(info);
        }
        if (user) {
            req.logIn(user, (error) => {
                if (error) {
                    console.error(error);
                    return next(error);
                }
                // eslint-disable-next-line no-unused-vars
                const { id, password, ...safeUser } = user;
                return res.json(safeUser);
            });
        }
    })(req, res, next);
});

authRouter.get("/", (req, res) => {
    if (!req.user) {
        res.status(401).json({ status: "NOT_AUTHENTICATED" });
        return;
    }
    // eslint-disable-next-line no-unused-vars
    const { id, password, ...user } = req.user;
    res.status(200).json(user);
});

export default authRouter;
