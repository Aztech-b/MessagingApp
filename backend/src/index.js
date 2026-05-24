import express from "express";
import prisma from "../lib/prisma.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res, next) => {
    res.send("everything is fine");
});

app.listen(3000, (error) => {
    if (error) {
        throw error;
    }
    console.log("Server running on port 3000");
});
