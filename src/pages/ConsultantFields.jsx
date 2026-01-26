import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { auth } from '../firebase/firebaseConfig';
import {Map} from '../components/Map'

export const ConsultantFields = () => {
    const { user } = useAuth();
    const [producerEmail, setProducerEmail] = useState('');
    const { fetchData, loading, error, setError } = useFetch();
    const [parcels, setParcels] = useState([]);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
//  console.log('antes del useeffet')
    const getParcels = async () => {
      if (!user?.uid) return;

      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          console.error('No hay usuario autenticado en Firebase');
          return;
        }
        
        const token = await firebaseUser.getIdToken();
        console.log('llamada')
        const response = await fetchData(
          `${backendUrl}/consultant/dashboard/${producerEmail}`,
          'GET',
          null,
          token
        );
        
        console.log('Datos de todas las parcelas:', response);
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

    const handleSearch = (e) => {
        e.preventDefault();
        getParcels();
    };
  return (
    <>
        {loading && <p>Cargando parcelas...</p>}
        {error && <p>Error al cargar parcelas: {error}</p>}
        {<section className='flexContainer CenteredContent'>
        <form className='report-form' onSubmit={handleSearch}>
            <input
                type="email"
                placeholder="Email del productor"
                value={producerEmail}
                onChange={(e) => setProducerEmail(e.target.value)}
            />
            <button type="submit">Buscar</button>
        </form>
        
      {parcels.length === 0 ? (
        <p>No tienes parcelas registradas.</p>
      ) : (
        <article>
          {parcels.map((parcel, index) => (
            <Link 
              key={parcel.uid_parcel || index} 
              to={`/producer/fields/${parcel.uid_parcel}`}
            >
              <div className='clickable'>
                <h3>Parcela: {parcel.name_parcel || 'Sin nombre'}</h3>
                <pre>{JSON.stringify(parcel, null, 2)}</pre>
              </div>
            </Link>
          ))}
        </article>
      )}   
    </section>}
    {!loading && <Map parcels= {parcels}/>}
    </>
  );
}

