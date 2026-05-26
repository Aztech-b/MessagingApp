import express from "express";
import prisma from "../lib/prisma.js";
import authRouter from "./routes/auth.js";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import postgreSession from "connect-pg-simple";
import { Pool } from "pg";

const app = express();
const PostgreSession = postgreSession(session);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(
    session({
        store: new PostgreSession({ pool: pool, createTableIfMissing: true }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true, secure: false, maxAge: 60 * 60 * 1000 },
    }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRouter);

app.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("Server running on port 3000");
});
