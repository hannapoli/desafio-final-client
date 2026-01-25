import { MenuCard } from '../components/MenuCard';
import messageImg from '../../public/mensajes.png';

export const DirectorDashboard = () => {
  return (
    <>
    <section className='flexColumn centeredContent fullHeight'>
      <h1 className='centeredText'>Panel de productor</h1>
      <div className='menu-card-list flexContainer'>
        <MenuCard
          logo='✉️'
          text='Mensajes'
          image={messageImg}
          url='/director/messages'
        />
      </div>
      </section>
    </>
  );
}
