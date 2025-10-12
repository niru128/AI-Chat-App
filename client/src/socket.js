import { io } from "socket.io-client";

const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL;

export const socket = io(BACKEND_BASE, {
  transports: ["websocket"]
});

export default socket;
