import { useEffect } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE_URL = BACKEND_URL.replace(/\/api\/v1$/, '');

export const useChatSocket = (email, onNewMessage) => {
  useEffect(() => {
    if (!email) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("Socket conectado:", socket.id);
      socket.emit("register", email);
    });

    socket.on("new-message", (message) => {
      onNewMessage(message);
    });

    return () => {
      socket.off("new-message");
      socket.disconnect();
    };
  }, [email]);
};
