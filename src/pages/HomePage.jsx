import "./HomePage.css";

export const HomePage = () => {

  return (
    <div className="landing-container">
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
