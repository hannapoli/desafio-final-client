import { MenuCard } from '../components/MenuCard';
import { ChatBot } from '../components/ChatBot';
import messageImg from '/mensajes.png';
import usersImg from '/users.jpg';

export const AdminDashboard = () => {
  return (
      <>
        <div className="dashboard-producer-container">
          <h1 className='centeredText'>Panel de Gestión</h1>
          <section className="dashboard-producer-content">
            <div className="dashboard-grid-cards">
              <article className="producer-card-item">
                <MenuCard
                  image={usersImg}
                  url='/admin/users'
                />
              </article>
  
              <article className="producer-card-item">
                <MenuCard
                  image={messageImg}
                  url='/admin/messages'
                />
              </article>
            </div>
          </section>
        </div>
        <ChatBot />
      </>
    );
}
