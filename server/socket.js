// server/socket.js
import { Server } from "socket.io";
import Notification from "./models/Notification.js"; // adjust path if needed

export const initSocket = (httpServer, corsOrigin) => {
  const io = new Server(httpServer, {
    cors: {
      origin: Array.isArray(corsOrigin)
        ? corsOrigin.map(url => url.replace(/\/$/, "")) // remove trailing slash
        : corsOrigin.replace(/\/$/, ""),
      methods: ["GET", "POST"],
      credentials: true, // allow cookies if needed
    },
    transports: ["websocket"], // ensure only websocket
  });

  io.on("connection", (socket) => {
    console.log("socket connected:", socket.id);

    // Client sends their userId after connecting
    socket.on("identify", (userId) => {
      if (userId) socket.join(`user_${userId}`);
    });

    socket.on("disconnect", () => {
      console.log("socket disconnected:", socket.id);
    });
  });

  // Helper function to broadcast notifications
  const sendNotification = async ({ toUserId = null, title, body }) => {
    const saved = await Notification.create({ toUser: toUserId, title, body });
    if (toUserId) {
      io.to(`user_${toUserId}`).emit("notification", saved);
    } else {
      io.emit("notification", saved); // broadcast to all
    }
    return saved;
  };

  return { io, sendNotification };
};
