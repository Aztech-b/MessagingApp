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
import registerSockets from "./sockets/index.socket.js";
import userRouter from "./routes/user.js";

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

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});
io.use((socket, next) => {
    passport.initialize()(socket.request, {}, () => {
        passport.session()(socket.request, {}, () => {
            next();
        });
    });
});

// Routes
app.use("/auth", authRouter);
app.use("/chat", chatRouter);
app.use("/user", userRouter);
registerSockets(io);

server.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("Server running on port 3000");
});
