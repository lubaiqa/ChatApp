import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const Server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketmap[receiverId];
};

const userSocketmap = {}; // {userId, socketId}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId !== "undefine") userSocketmap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketmap));

  socket.on("disconnect", () => {
    (delete userSocketmap[userId],
      io.emit("getOnlineUsers", Object.keys(userSocketmap)));
  });
});

export { app, socket, io };
