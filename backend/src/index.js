import express from "express";
import prisma from "../lib/prisma.js";
import authRouter from "./routes/auth.js";
import session from "express-session";
import passport from "passport";
import passportLocal from "passport-local";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

const LocalStrategy = passportLocal.Strategy;

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
        const user = await prisma.user.findUnique({ where: { id: id } });
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Routes
app.use("/auth", passport.authenticate("local"), authRouter);

app.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("Server running on port 3000");
});
