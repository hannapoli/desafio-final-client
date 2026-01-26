import { MenuCard } from '../components/MenuCard';
// import fieldImg from '../assets/images/field.jpg';
// import cropImg from '../assets/images/fieldwork.jpg';
import messageImg from '../assets/images/email.jpg';

import "./DistributorDashboard.css"

export const DistributorDashboard = () => {
  return (
    <>
    <section className='distribuidor-container flexColumn centeredContent fullHeight'>
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
