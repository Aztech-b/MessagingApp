import express from "express";
import prisma from "../lib/prisma.js";
import authRouter from "./routes/auth.js";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import postgreSession from "connect-pg-simple";
import { Pool } from "pg";
import { Server } from "socket.io";
import http from "node:http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRouter);

io.on("connection", (socket) => {
    console.log("user connected: " + socket.id);
    socket.on("message", (data) => {
        console.log(data);
    });
});

server.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("Server running on port 3000");
});
