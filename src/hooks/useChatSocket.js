import { useEffect } from "react";
import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const BASE_URL = BACKEND_URL.replace(/\/api\/v1$/, '');

/**
 * Hook para gestionar la conexión de WebSockets para el chat.
 * 
 * Se encarga de conectar al servidor, registrar al usuario mediante su email 
 * y escuchar mensajes entrantes en tiempo real.
 * 
 * @param {string} email - El email del usuario para registrarlo en el socket.
 * @param {Function} onNewMessage - Callback que se ejecuta al recibir el evento 'new-message'.
 * 
 * @example
 * useChatSocket('usuario@correo.com', (msg) => {
 *   console.log("Nuevo mensaje:", msg);
 * });
 */
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
