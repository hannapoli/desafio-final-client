import { MenuCard } from '../components/MenuCard';
import { ChatBot } from '../components/ChatBot';
import messageImg from '/mensajes.png';
import parcelas from '/parcelas-agrosync.png'

export const ConsultantDashboard = () => {

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
            ¡Te damos la bienvenida! Aquí puedes ver el estado de las parcelas de los productores y ponerte en contacto a través del chat.
          </p>
        </section>
        <section className="dashboard-producer-content">
          <div className="dashboard-grid-cards">
            <article className="producer-card-item">
              <MenuCard
                //text='Ver parcelas de un productor'
                 image={parcelas}
                url='/consultant/fields'
              />
            </article>

            <article className="producer-card-item">
              <MenuCard
                image={messageImg}
                url='/consultant/messages'
              />
            </article>
          </div>
        </section>
      </div>
      <ChatBot />
    </>
  );
};
