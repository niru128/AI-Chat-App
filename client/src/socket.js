import { io } from "socket.io-client";


export const socket = io('https://ai-chat-app-wb7u.onrender.com', {
  transports: ["websocket"]
});

export default socket;
