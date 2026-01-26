import { MenuCard } from '../components/MenuCard';
import messageImg from '/mensajes.png';

export const DistributorDashboard = () => {
  return (
    <>
    <div className="dashboard-producer-container"> {/* <section className='distribuidor-container flexColumn centeredContent fullHeight'> */}
y
            <h1 className='centeredText'>Panel de Gestión</h1>
            <section className="dashboard-producer-content">
              <div className="dashboard-grid-cards">
                <article className="producer-card-item">
                  <MenuCard
                    text='Mis rutas'
                    // image={}
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
        </>
  );
}
{/* import { MenuCard } from '../components/MenuCard';
import messageImg from '/mensajes.png';

export const DistributorDashboard = () => {
  return (
    <>
    <section className='flexColumn centeredContent fullHeight'>
      <h1 className='centeredText'>Panel de productor</h1>
      <div className='menu-card-list flexContainer'>
        <MenuCard
          logo='✉️'
          text='Mensajes'
          image={messageImg}
          url='/distributor/messages'
        />
      </div>
      </section>
    </>
  );
}
 */}