import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";
import postgreSession from "connect-pg-simple";
import { Pool } from "pg";
import { Server } from "socket.io";
import http from "node:http";

import authRouter from "./routes/auth.js";
import chatRouter from "./routes/chat.js";

const app = express();
const server = http.createServer(app);
const PostgreSession = postgreSession(session);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const io = new Server(server, { cors: { origin: "*" } });

app.use(
    session({
        store: new PostgreSession({ pool: pool, createTableIfMissing: true, schemaName: "session" }),
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
app.use("/chat", chatRouter);

io.on("connection", (socket) => {
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
