import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import "./HomeNav.css";

export const HomeNav = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false); // Controla el menú

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false); // Cierra el menú al navegar
  };

  // CERRAR NAV AL PULSAR CUALQUIER TECLA (MÓVIL)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = () => {
      setIsOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <nav className="home-nav">
      <div className="navbar-brand">
        <div className="brand-group" onClick={() => handleNavigate("/")}>
          <img className="logo" src="/logo.png" alt="AgroSync" />
          <span className="brand-name">AgroSync</span>
        </div>
        
        {/* Botón hamburguesa: visible solo en móvil */}
        <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Clase dinámica para mostrar/ocultar */}
      <div className={`navbar-actions ${isOpen ? "active" : ""}`}>
        <button onClick={() => handleNavigate("/auth/login")} className="btn-login">
          Iniciar sesión
        </button>
        <button onClick={() => handleNavigate("/auth/register")} className="btn-register">
          Registrarse
        </button>
      </div>
    </nav>
  );
};
