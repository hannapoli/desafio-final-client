import { MenuCard } from '../components/MenuCard';
import { ChatBot } from '../components/ChatBot';
import messageImg from '/mensajes.png';

/**
 * AnalystDashboard component.
 *
 * Página principal del panel del rol Analista.
 * Muestra información agregada y accesos a
 * herramientas de análisis y visualización de datos.
 *
 * @component
 * @returns {JSX.Element}
 */

export const AnalystDashboard = () => {
  return (
    <>

      <div className="dashboard-producer-container">
        <section className="dashboard-producer-hero">
          <span>
            <img
              className="dashboard-logo-icon"
              src="/logo.png"
              alt="AgroSync"
            />
          </span>

          <h1 className="dashboard-title">Panel de Gestión</h1>

          <p className="dashboard-description">
            ¡Te damos la bienvenida! Aquí puedes ponerte en contacto a través del chat.
          </p>
        </section>
        <section className="dashboard-producer-content">
          <div className="dashboard-grid-cards">
            <article className="producer-card-item">
              <MenuCard
              image={messageImg}
              url='/analyst/messages'
            />
            </article>
          </div>
        </section>
      </div>
      <ChatBot />
    </>
  );
}
