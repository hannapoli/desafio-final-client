import { MenuCard } from '../components/MenuCard';
import messageImg from '/mensajes.png';

import "./DirectorDashboard.css"

export const DirectorDashboard = () => {
  return (
    <div className="dashboard-director-container">

      <section className="dashboard-director-hero">
        <h1 className="dashboard-title">Panel de Gestión</h1>
      </section>

      <section className="dashboard-director-content">
        <div className="glass-card dashboard-grid-cards">

          <article className="producer-card-item">
            <MenuCard text="Reportes" url="/director/reports" />
          </article>

          <article className="producer-card-item">
            <MenuCard image={messageImg} url="/director/messages" />
          </article>

        </div>
      </section>

    </div>
  )
}
