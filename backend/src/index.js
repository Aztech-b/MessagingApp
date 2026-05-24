import express from "express";
import prisma from "../lib/prisma.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRouter);

app.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("Server running on port 3000");
});
