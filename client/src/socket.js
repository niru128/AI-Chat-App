import { io } from "socket.io-client";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
export const socket = io(BACKEND_BASE, {
  // autoConnect: false,
  transports: ["websocket"],
});

export default socket;