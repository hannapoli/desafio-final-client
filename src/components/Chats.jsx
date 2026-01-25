import { useRef, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useChatSocket } from "../hooks/useChatSocket";
import { auth } from '../firebase/firebaseConfig';
import "./Chats.css";

import { Icon } from "./Icono-Busqueda-chat"; 

// import "./Chats-style.css";

export const Chats = () => {
  const { user } = useAuth();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newChatEmail, setNewChatEmail] = useState("");

  const [isInputFocused, setIsInputFocused] = useState(false); // para el boton de abrir chat

  // Para que el chat baje al ir escribiendo
  const messagesEndRef = useRef(null);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

useEffect(() => {
  scrollToBottom();
}, [messages]);

// Y en el JSX, al final de .messages-container:
<div className="messages-container">
    {/* ... tus mensajes ... */}
    <div ref={messagesEndRef} /> 
</div>


  const getIdToken = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      console.error('No hay usuario autenticado en Firebase');
      return;
    }

    return await firebaseUser.getIdToken();
  }
  /* =========================
     SOCKET LISTENER
  ==========================*/
const selectedChatRef = useRef(selectedChat);
useEffect(() => {
  selectedChatRef.current = selectedChat;
}, [selectedChat]);

useChatSocket(user?.email, (message) => {
  if (
    message.email_creator === selectedChatRef.current ||
    message.email_receiver === selectedChatRef.current
  ) {
    setMessages((prev) => [...prev, message]);
  }

  fetchChats();
});

  /* =========================
     FETCH CHATS
  ==========================*/
const fetchChats = async () => {
  if (!user?.email) return;
  console.log(user)
  const token = await getIdToken()
  console.log(token, "TOKEEEEN")
  const res = await fetch(
    `${backendUrl}/messages/getChats/${user.email}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const json = await res.json();

  const emails = Array.isArray(json.data)
    ? json.data.map((chat) => chat.other_user)
    : [];

  setChats(emails.filter(email => email !== user.email));
};

  /* =========================
     FETCH MENSAJES
  ==========================*/
  const fetchMessages = async (email) => {
    const token = await getIdToken()
    const res = await fetch(
      `${backendUrl}/messages/getAll/${user.email}/${email}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json();
    setMessages(
      Array.isArray(json.data)
        ? json.data.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        : []
    );
  };

  /* =========================
     ENVIAR MENSAJE
  ==========================*/
  const sendMessage = async (e) => {
    e.preventDefault();
    const token = await getIdToken()
    if (!newMessage.trim()) return;
    console.log(selectedChat)
    await fetch(
      `${backendUrl}/messages/create/${user.email}/${selectedChat}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content_message: newMessage,
        }),
      }
    );
    const tempMessage = {
      uid_message: Date.now(), // temporal
      email_creator: user.email,
      email_receiver: selectedChat,
      content_message: newMessage,
      is_read: false,
      created_at: new Date().toISOString(),
    };

    if(user.email != selectedChat){
        setMessages(prev => [...prev, tempMessage]);
    }

    setNewMessage("");
  };

    const deleteChat = async (email) => {
        const confirmDelete = window.confirm(
            `¿Seguro que quieres eliminar el chat con ${email}?`
        );

        if (!confirmDelete) return;

        try {
            const token = await getIdToken();

            await fetch(
            `${backendUrl}/messages/deleteAll/${email}`,
            {
                method: "DELETE",
                headers: {
                Authorization: `Bearer ${token}`,
                },
            }
            );

            // Actualizar UI
            setChats((prev) => prev.filter((chat) => chat !== email));

            if (selectedChat === email) {
            setSelectedChat(null);
            setMessages([]);
            }
        } catch (error) {
            console.error("Error al borrar el chat", error);
        }
    };


  /* =========================
     EFECTOS
  ==========================*/
  useEffect(() => {
    if (user?.email) fetchChats();
  }, [user]);

  useEffect(() => {
    if (selectedChat) fetchMessages(selectedChat);
  }, [selectedChat]);

  /* =========================
     UI
  ==========================*/
    return (
    <div className="chats-container">
        {/* SIDEBAR */}
        <aside className="chats-sidebar">
          <section className="search-container">
            <h3 className="messages-title">Messages</h3>

            <div className="search-wrapper">
                <input 
                    className="input-chat"
                    type="email"
                    value={newChatEmail}
                    onChange={(e) => setNewChatEmail(e.target.value)}
                    placeholder="" 
                />
                {/* Esta capa se oculta automáticamente cuando hay texto */}
                {!newChatEmail && (
                    <div className="placeholder-overlay">
                        <Icon name="search" color="#a0a0a0" size={16} />

                        <span>Search...</span>
                    </div>
                )}
            </div>
            {/* El boton aparecerá si el imput esta enfocado */}
            {(isInputFocused || newChatEmail.length > 0) && (
              <button className="btn-chat " onClick={() => setSelectedChat(newChatEmail)}>
                  Abrir chat
              </button>
            )}

          </section>

            <section className="messages-container">
              {chats.map((email) => (
                  <div 
                      key={email} 
                      className={`chat-item ${selectedChat === email ? "active" : ""}`}
                      onClick={() => setSelectedChat(email)} // Movido aquí para que toda la fila sea clicable
                  >
                      <span className="user-photo"></span><span>{email}</span>
                      
                      <button
                          className="delete-chat-btn"
                          onClick={(e) => {
                              e.stopPropagation(); // Evita que se seleccione el chat al borrar
                              deleteChat(email);
                          }}
                          title="Eliminar chat"
                      >
                          {/* Usamos el nuevo componente Icon */}
                          <Icon name="trash" color="#5f6368" size={20} />
                      </button>
                  </div>
              ))}

            </section>


        <hr />


        </aside>

        {/* CHAT */}
        <section className="chat-section">
        {selectedChat ? (
            <>
            <h3>{selectedChat}</h3>

            <div className="messages-container">
                {messages.map((msg) => {
                const isMine = msg.email_creator === user.email;

                return (
                    <div
                    key={msg.uid_message}
                    className={`message ${isMine ? "sent" : "received"}`}
                    >
                    <span
                        className={`message-bubble ${isMine ? "sent" : "received"}`}
                    >
                        {msg.content_message}
                    </span>
                    </div>
                );
                })}
            </div>

            <form onSubmit={sendMessage} className="message-form">
                <input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe un mensaje"
                className="message-input"
                />
                <button type="submit">Enviar</button>
            </form>
            </>
        ) : (
            <p>Selecciona un chat o crea uno nuevo</p>
        )}
        </section>
    </div>
    );
};
