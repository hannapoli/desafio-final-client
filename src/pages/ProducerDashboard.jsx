import { MenuCard } from '../components/MenuCard';
import fieldImg from '../assets/images/field.jpg';
import cropImg from '../assets/images/fieldwork.jpg';
import messageImg from '../assets/images/email.jpg';

export const ProducerDashboard = () => {

  return (
    <>
    <section className='flexColumn centeredContent fullHeight'>
      <h1 className='centeredText'>Panel de productor</h1>
      <div className='menu-card-list flexContainer'>
        <MenuCard
          logo='🌾'
          text='Mis parcelas'
          image={fieldImg}
          url='/producer/fields/all'
        />
        <MenuCard
          logo='🌱'
          text='Gestionar parcelas'
          image={cropImg}
          url='/producer/fields/manage'
        />
        <MenuCard
          logo='✉️'
          text='Mensajes'
          image={messageImg}
          url='/producer/messages'
        />
      </div>
      </section>
    </>
  );
};
