import { MenuCard } from '../components/MenuCard';
import { ChatBot } from '../components/ChatBot';
import messageImg from '/mensajes.png';
import rutas from '/rutas-distribucion-agrosync.png'

/**
 * DistributorDashboard component.
 *
 * Panel principal del rol Distribuidor.
 * Presenta información relevante sobre
 * parcelas, productos y actividad asociada.
 *
 * @component
 * @returns {JSX.Element}
 */

export const DistributorDashboard = () => {
  return (
    <>
    <div className="dashboard-producer-container"> {/* <section className='distribuidor-container flexColumn centeredContent fullHeight'> */}
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
            ¡Te damos la bienvenida! Aquí puedes ver tus rutas de distribución y ponerte en contacto a través del chat.
          </p>
        </section>
            <section className="dashboard-producer-content">
              <div className="dashboard-grid-cards">
                <article className="producer-card-item">
                  <MenuCard
                    image={rutas}
                    url='/distributor/routes'
                  />
                </article>
                
                <article className="producer-card-item">
                  <MenuCard
                    image={messageImg}
                    url='/distributor/messages'
                  />
                </article>
              </div>
            </section>
          </div>
          <ChatBot />
        </>
  );
}
