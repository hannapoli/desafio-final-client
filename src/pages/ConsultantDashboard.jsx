import { MenuCard } from '../components/MenuCard';
import { ChatBot } from '../components/ChatBot';
import messageImg from '/mensajes.png';

export const ConsultantDashboard = () => {

  return (
    <>
      <div className="dashboard-producer-container">
        <h1 className='centeredText'>Panel de Gestión</h1>
        <section className="dashboard-producer-content">
          <div className="dashboard-grid-cards">
            <article className="producer-card-item">
              <MenuCard
                text='Ver parcelas de un productor'
                // image={}
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
