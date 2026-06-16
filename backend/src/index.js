import postgreSession from "connect-pg-simple";
import cors from "cors";
import express from "express";
import session from "express-session";
import http from "node:http";
import passport from "passport";
import { Pool } from "pg";
import { Server } from "socket.io";

import authRouter from "./routes/auth.js";
import chatRouter from "./routes/chat.js";
import userRouter from "./routes/user.js";
import registerSockets from "./sockets/index.socket.js";

const corsData = { origin: "http://localhost:5173", credentials: true };

const app = express();
const server = http.createServer(app);
const PostgreSession = postgreSession(session);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const io = new Server(server, { cors: corsData, connectionStateRecovery: {} });

const sessionMiddleware = session({
    store: new PostgreSession({ pool: pool, createTableIfMissing: true }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, secure: false, maxAge: 60 * 60 * 1000 * 24 },
});
app.use(sessionMiddleware);
app.use(cors(corsData));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

// Routes
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/user", userRouter);
registerSockets(io);

app.use((req, res) => {
    try {
        if (new URL(req.query.url).host !== process.env.FRONTEND_URL) {
            console.log("t");
            return res.status(400).end(`Unsupported redirect to host: ${req.query.url}`);
        }
    } catch (error) {
        console.error(error);
        return res.status(400).end(`Invalid url: ${req.query.url}`);
    }
    res.redirect(req.query.url);
});

server.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("Server running on port 3000");
});
