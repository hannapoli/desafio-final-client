import { MenuCard } from '../components/MenuCard';
import messageImg from '/mensajes.png';

export const DirectorDashboard = () => {
  return (
    <>
    <div className="dashboard-producer-container">
            <h1 className='centeredText'>Panel de Gestión</h1>
            <section className="dashboard-producer-content">
              <div className="dashboard-grid-cards">
                <article className="producer-card-item">
                  <MenuCard
                    text='Reportes'
                    // image={}
                    url='/director/reports'
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
        </>
  );
}
