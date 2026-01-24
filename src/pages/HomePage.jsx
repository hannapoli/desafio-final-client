import { Link, useNavigate } from "react-router";
import "./HomePage.css";



export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <header className="navbar">
        <div className="navbar-brand">
          <img className="logo" src="/logo.png" alt="AgroSync" />
          <span className="brand-name">AgroSync</span>
        </div>

        <nav className="navbar-actions">
          <button onClick={() => navigate("/auth/login")} className="btn-login">
            Iniciar sesión
          </button>

          <button onClick={() => navigate("/auth/register")} className="btn-register">
            Registrarse
          </button>
        </nav>
      </header>

      <section className="landing-hero">
        <span>
          <img
            className="logo-grande"
            src="/logo.png"
            alt="AgroSync"
          />
        </span>
        <h1>Optimiza tu Producción Agrícola</h1>
        <p>
          Gestiona y monitorea tus cultivos de manera eficiente con nuestra
          herramienta inteligente.
        </p>
      </section>

    </div>
  );
};
