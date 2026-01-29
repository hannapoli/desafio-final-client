import { MenuCard } from '../components/MenuCard';
import { ChatBot } from '../components/ChatBot';
import messageImg from '/mensajes.png';
import usersImg from '/users.jpg';
import usuarios from '/gestion-usuarios.png'

/**
 * AdminDashboard component.
 *
 * Página principal del panel de control del Administrador.
 * Muestra una vista general del estado del sistema
 * y accesos rápidos a las funciones administrativas.
 *
 * @component
 * @returns {JSX.Element}
 */
export const AdminDashboard = () => {
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

          <h1 className="dashboard-title">Panel de Gestión de Admin</h1>

          <p className="dashboard-description">
            ¡Te damos la bienvenida! Aquí puedes gestionar los usuarios de la plataforma y ponerte en contacto a través del chat.
          </p>
        </section>
          <section className="dashboard-producer-content">
            <div className="dashboard-grid-cards">
              <article className="producer-card-item">
                <MenuCard
                  image={usuarios}
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
