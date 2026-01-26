import { MenuCard } from '../components/MenuCard';
import messageImg from '/mensajes.png';

export const ConsultantDashboard = () => {

  return (
    <>
      <div className="dashboard-consultant-container">

      <section className="dashboard-consultant-hero">
        <h1 className="dashboard-title">Panel de Gestión</h1>
      </section>

      <section className="dashboard-consultant-content">
        <div className="dashboard-grid-cards">

          <article className="producer-card-item">
            <MenuCard text="Alertas" url="/consultant/alerts" />
          </article>

          <article className="producer-card-item">
            <MenuCard image={messageImg} url="/consultant/messages" />
          </article>

        </div>
      </section>
      </div>
    </>
  );
};
