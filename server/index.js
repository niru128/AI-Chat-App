import express from "express";
import http from "http";
import connectDB  from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chat.js";
import orgRoutes from "./routes/org.js";
import notifRoutes from "./routes/notification.js";
import { initSocket } from "./socket.js";
// import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

import cors from "cors";

const allowedOrigins = [
  'https://ai-chat-app-sooty.vercel.app',
  'http://localhost:5173'
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser requests like Postman
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// Handle preflight OPTIONS requests
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));


connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/org", orgRoutes);
app.use("/api/notifications", notifRoutes)
const server = http.createServer(app);
const { io, sendNotification } = initSocket(server, process.env.FRONTEND_URL);

// Example: route to send notification
app.post("/api/notify", async (req, res) => {
  const { toUserId, title, body } = req.body;
  const n = await sendNotification({ toUserId, title, body });
  res.json(n);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));
