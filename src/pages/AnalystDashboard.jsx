import { MenuCard } from '../components/MenuCard';
import messageImg from '/mensajes.png';

export const AnalystDashboard = () => {
  return (
    <>
      <div className="dashboard-producer-container">
        <section className='flexColumn centeredContent fullHeight'>
          <h1 className='centeredText'>Panel de Gestión</h1>
          <div className='menu-card-list flexContainer'>
            <MenuCard
              text='Mensajes'
              image={messageImg}
              url='/analyst/messages'
            />
          </div>
        </section>
      </div>
    </>
  );
}
