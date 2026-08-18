import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import dotenv from "dotenv";
import express from "express";
import dbConnect from "./DB/dbConnect.js";
import authRouter from "./Router/authUser.js";
import messageRouter from "./Router/messageRouter.js";
import cookieParser from "cookie-parser";
import userRouter from "./Router/userRouter.js";
import path from "path";

import { app, server } from "./Socket/socket.js";

const __dirname = path.resolve();

dotenv.config();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

app.use(express.static(path.join(__dirname, "/frontend/dist")));

app.get("/", (req, res) => {
  res.send("Server is working");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  dbConnect();
  console.log(`Server is running on port ${PORT}`);
});
