import { useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { auth } from '../firebase/firebaseConfig';
import { Map } from '../components/Map'
import { userMap } from '../hooks/userMap';
import { MapsContext } from '../contexts/MapsContext';
import { ParcelDetails } from '../components/ParcelDetails';

import '../components/ParcelDetails.css'

import './ProducerSeeFields.css';
import { VegetationIndex } from '../components/Map/VegetationIndex';

export const ProducerSeeFields = () => {
  const { user } = useAuth();
  const { fetchData, loading, error, setError } = useFetch();
  // const [parcels, setParcels] = useState([]);
  const { getAllAlertsByUser, getAllInfoMeteoByUser } = userMap()
  const { parcels, setParcels, parcel, selectedParcelId, vegetation, setSelectedParcelId, setParcel, setVegetation } = useContext(MapsContext)
  
  const [reportData, setReportData] = useState({
    email_creator: '',
    email_receiver: '',
    content_message: '',
    attached: null
  });
  
  const [dataPoints, setDataPoints] = useState(null);
  const [dataPhoto, setDataPhoto] = useState(null);
  
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const infoParcelUrl = import.meta.env.VITE_API_DATA_URL_POINTS;

  useEffect(() => {
    const getParcels = async () => {
      if (!user?.uid) return;

      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          console.error('No hay usuario autenticado en Firebase');
          return;
        }

        const token = await firebaseUser.getIdToken();
        // console.log('llamada')
        const response = await fetchData(
          `${backendUrl}/producer/dashboard/${user.uid}`,
          'GET',
          null,
          token
        );

        // console.log('Datos de todas las parcelas:', response);
        setParcels(response.data || []);
      } catch (err) {
        setParcels([]);
        if (err.message?.includes('403') || err.message?.includes('permiso')) {
          setError('No tienes permiso para ver estas parcelas');
        } else {
          setError('Error al obtener parcelas');
        }
      }
    };
    const alertas = getAllAlertsByUser(user.email)

    getParcels();

  }, [user, backendUrl, fetchData]);

  // console.log('desde see fields', {parcel})

  useEffect(() => {
    if (user?.email) {
      setReportData(currentData => ({
        ...currentData,
        email_creator: user.email
      }));
    }
  }, [user]);

   useEffect(() => {
    setParcels([]);
    setSelectedParcelId(null);
    setParcel(null);
    setVegetation(null);
  }, []);
  

  return (
    <>
      {loading && <p>Cargando parcelas...</p>}
      {error && <p>Error al cargar parcelas: {error}</p>}
      <section className='flexContainer CenteredContent'>
        <h1 className='centeredText'>Mis parcelas</h1>
      </section>

      <section id='seeFieldsContainer'>
        <article id='mapBox'>
          {!loading && <Map parcels={parcels} />}
          {parcel && <div className="article-card" id="vegetation-section">
          <VegetationIndex vegetation={vegetation} />
    </div>}
        </article>
      {parcel &&  ( 
        <article id='detailsParcelBox'>
           <ParcelDetails />
        </article>
      )}
      </section>
    
      
    </>
  );
}