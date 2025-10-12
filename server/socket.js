import { Server } from "socket.io";
import Notification from "./models/Notification.js"; // adjust path if needed

export const initSocket = (httpServer, corsOrigin) => {
  const io = new Server(httpServer, {
    cors: { origin: corsOrigin, methods: ["GET", "POST"] }
  });

  io.on("connection", (socket) => {
    console.log("socket connected", socket.id);

    // Join room per userId (client sends userId after connect)
    socket.on("identify", (userId) => {
      socket.join(`user_${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected", socket.id);
    });
  });

  // helper to broadcast
  const sendNotification = async ({ toUserId=null, title, body }) => {
    const saved = await Notification.create({ toUser: toUserId, title, body });
    if (toUserId) {
      io.to(`user_${toUserId}`).emit("notification", saved);
    } else {
      io.emit("notification", saved); // global
    }
    return saved;
  };

  return { io, sendNotification };
};
