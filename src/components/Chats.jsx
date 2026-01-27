import { useRef, useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useChatSocket } from "../hooks/useChatSocket";
import { auth } from "../firebase/firebaseConfig";
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

  // Para mostrar el botón "Abrir chat" al enfocar el input
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Para abrir / cerrar sidebar en móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Para que el chat haga scroll automático al escribir
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Cerrar sidebar al seleccionar chat
  const handleSelectChat = (email) => {
    setSelectedChat(email);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /* =========================
     TOKEN FIREBASE
  ========================== */
  const getIdToken = async () => {
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) {
      console.error("No hay usuario autenticado en Firebase");
      return;
    }

    return await firebaseUser.getIdToken();
  };

  /* =========================
     SOCKET LISTENER
  ========================== */
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
  ========================== */
  const fetchChats = async () => {
    if (!user?.email) return;

    const token = await getIdToken();

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

    setChats(emails.filter((email) => email !== user.email));
  };

  /* =========================
     FETCH MENSAJES
  ========================== */
  const fetchMessages = async (email) => {
    const token = await getIdToken();

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
        ? json.data.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          )
        : []
    );
  };

  /* =========================
     ENVIAR MENSAJE
  ========================== */
  const sendMessage = async (e) => {
    e.preventDefault();

    const token = await getIdToken();
    if (!newMessage.trim()) return;

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

    if (user.email !== selectedChat) {
      setMessages((prev) => [...prev, tempMessage]);
    }

    setNewMessage("");
  };

  /* =========================
     BORRAR CHAT
  ========================== */
  const deleteChat = async (email) => {
    const confirmDelete = window.confirm(
      `¿Seguro que quieres eliminar el chat con ${email}?`
    );

    if (!confirmDelete) return;

    try {
      const token = await getIdToken();

      await fetch(`${backendUrl}/messages/deleteAll/${email}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
  ========================== */
  useEffect(() => {
    if (user?.email) fetchChats();
  }, [user]);

  useEffect(() => {
    if (selectedChat) fetchMessages(selectedChat);
  }, [selectedChat]);

  /* =========================
     UI
  ========================== */
  return (
    <div className={`chats-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* HANDLE LATERAL (solo móvil) */}
      <div
        className="sidebar-handle"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Abrir conversaciones"
      >
        <span />
        <span />
        <span />
      </div>

      {/* OVERLAY PARA CERRAR */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className="chats-sidebar">
        <section className="search-container">
          <h3 className="messages-title">Mensajes</h3>

          <div className="search-wrapper">
            <input
              className="input-chat"
              type="email"
              value={newChatEmail}
              onChange={(e) => setNewChatEmail(e.target.value)}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              placeholder=""
            />

            {!newChatEmail && (
              <div className="placeholder-overlay">
                <Icon name="search" color="#000000" size={16} />
                <span>Buscar...</span>
              </div>
            )}
          </div>

          {(isInputFocused || newChatEmail.length > 0) && (
            <button
              className="btn-chat"
              onClick={() => {
                setSelectedChat(newChatEmail);
                setIsSidebarOpen(false);
              }}
            >
              Abrir chat
            </button>
          )}
        </section>

        {/* LISTA DE CHATS */}
        <section className="chat-list">
          {chats.map((email) => (
            <div
              key={email}
              className={`chat-item ${
                selectedChat === email ? "active" : ""
              }`}
              onClick={() => handleSelectChat(email)}
            >
              <div className="users-div">
                <span className="user-photo"></span>
                <span>{email}</span>
              </div>

              <button
                className="delete-chat-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteChat(email);
                }}
                title="Eliminar chat"
              >
                <Icon name="trash" color="#000000" size={20} />
              </button>
            </div>
          ))}
        </section>
      </aside>

      {/* CHAT */}
      <section className="chat-section">
        <div className="chat-inner">
          {selectedChat ? (
          <>
            <div className="users-div cabecera-nombre-chat">
              <span className="user-photo"></span>
              <span>{selectedChat}</span>
            </div>

            {/* MENSAJES */}
            <div className="chat-messages">
              {messages.map((msg) => {
                const isMine = msg.email_creator === user.email;

                return (
                  <div
                    key={msg.uid_message}
                    className={`message ${isMine ? "sent" : "received"}`}
                  >
                    <span
                      className={`message-bubble ${
                        isMine ? "sent" : "received"
                      }`}
                    >
                      {msg.content_message}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="message-form">
              <div className="send-msg-container">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje"
                  className="message-textarea"
                />
                <button className="btn-send-msg" type="submit">
                  <Icon name="airplane" color="white" size={22} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="msg-option">
            <p>
              <strong>Selecciona un chat o crea uno nuevo</strong>
            </p>
          </div>
        )}
        </div>
      </section>
    </div>
  );
};
