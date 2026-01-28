import { MenuCard } from '../components/MenuCard';
import { ChatBot } from '../components/ChatBot';
import messageImg from '/mensajes.png';
import reportes from '/reportes-agrosync.png'
import parcelas from '/parcelas-agrosync.png' 
import productores from '/productores-agrosync.png'

export const DirectorDashboard = () => {
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
            ¡Te damos la bienvenida! Aquí puedes ver el estado de las parcelas de tus productores, ver reportes y ponerte en contacto a través del chat.
          </p>
        </section>
            <section className="dashboard-producer-content">
              <div className="dashboard-grid-cards">                
                <article className="producer-card-item">
                  <MenuCard
                    image={parcelas}
                    url='/director/fields'
                  />
                </article>

                <article className="producer-card-item">
                  <MenuCard
                    //text='Reportes'
                     image={reportes}
                    url='/director/reports'
                  />
                </article>

                <article className="producer-card-item">
                  <MenuCard
                    image={productores}
                    url='/director/consultants'
                  />
                </article>

                <article className="producer-card-item">
                  <MenuCard
                    image={messageImg}
                    url='/director/messages'
                  />
                </article>
              </div>
            </section>
          </div>
          <ChatBot />
        </>
  );
}
