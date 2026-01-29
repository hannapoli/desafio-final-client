import { MenuCard } from '../components/MenuCard';
import { ChatBot } from '../components/ChatBot';
import messageImg from '/mensajes.png';
import reportes from '/reportes-agrosync.png'
import parcelas from '/parcelas-agrosync.png' 

import "./ProducerDashboard.css";

/**
 * ProducerDashboard component.
 *
 * Panel principal del rol Productor.
 * Ofrece una visión general de sus parcelas,
 * reportes y estado de los cultivos.
 *
 * @component
 * @returns {JSX.Element}
 */

export const ProducerDashboard = () => {
  return (
    <div className="dashboard-producer-container">

      {/* Capa de fondo */}
      <div className="dashboard-producer-bg" />

      {/* Contenido */}
      <div className="dashboard-producer-content-wrapper">

        <section className="dashboard-producer-hero">
          <span>
            <img
              className="dashboard-logo-icon"
              src="/logo.png"
              alt="AgroSync"
            />
          </span>

          <h1 className="dashboard-title">Panel de Gestión de Productor</h1>

          <p className="dashboard-description">
            ¡Te damos la bienvenida! Aquí puedes gestionar tus parcelas, monitorear cultivos
            y revisar tus mensajes de soporte técnico.
          </p>
        </section>

        <section className="dashboard-producer-content">
          <div className="dashboard-grid-cards">

            <article className="producer-card-item">
              <MenuCard
                image={parcelas}
                url="/producer/fields/all"
              />
            </article>
            <article className="producer-card-item">
              <MenuCard
                //text='Reportes'
                  image={reportes}
                url='/producer/reports'
              />
            </article>
            <article className="producer-card-item">
              <MenuCard
                image={messageImg}
                url="/producer/messages"
              />
            </article>

          </div>
        </section>

      </div>
      <ChatBot />
    </div>
  );
};
