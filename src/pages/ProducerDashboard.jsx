import { MenuCard } from '../components/MenuCard';
import fieldImg from '/mis_parcelas.png';
import cropImg from '/parcelas.png';
import messageImg from '/mensajes.png';

import "./ProducerDashboard.css"

export const ProducerDashboard = () => {

return (
    /* Clase base cambiada para evitar heredar el fondo del Home */
    <div className="dashboard-producer-container">

      {/* Secciones renombradas */}
      <section className="dashboard-producer-hero">
        <span>
          <img className="dashboard-logo-icon" src="/logo.png" alt="AgroSync" />
        </span>
        <h1 className="dashboard-title">Panel de Gestión</h1>
        <p className="dashboard-description">
          ¡Te damos la bienvenida! Aquí puedes gestionar tus parcelas, monitorear cultivos 
          y revisar tus mensajes de soporte técnico.
        </p>
      </section>

      <section className="dashboard-producer-content">
        <div className="dashboard-grid-cards">
          <article className="producer-card-item">
            <MenuCard
              // logo='🌾'
              // text='Mis parcelas'
              image={fieldImg}
              url='/producer/fields/all'
            />
          </article>

          <article className="producer-card-item">
            <MenuCard
              // logo='🌱'
              // text='Gestionar parcelas'
              image={cropImg}
              url='/producer/fields/manage'
            />
          </article>

          <article className="producer-card-item">
            <MenuCard
              // logo='✉️'
              // text='Mensajes'
              image={messageImg}
              url='/producer/messages'
            />
          </article>
        </div>

      </section>
    </div>
  );
};
