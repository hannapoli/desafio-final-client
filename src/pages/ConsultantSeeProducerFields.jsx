import { useContext, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';
import { auth } from '../firebase/firebaseConfig';
import { Map } from '../components/Map';
import { MapsContext } from '../contexts/MapsContext';
import { ParcelDetails } from '../components/ParcelDetails';
import { VegetationIndex } from '../components/Map/VegetationIndex';

/**
 * ConsultantSeeProducerFields component.
 *
 * Vista que permite al Consultor analizar
 * las parcelas de un productor concreto.
 *
 * @component
 * @returns {JSX.Element}
 */

export const ConsultantSeeProducerFields = ({ producer }) => {
  const { fetchData, loading, error, setError } = useFetch();
  const { parcels, setParcels, parcel, selectedParcelId, vegetation, setSelectedParcelId, setParcel, setVegetation } = useContext(MapsContext)

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const getParcels = async () => {
      if (!producer?.email_user) return;

      try {
        const token = await auth.currentUser.getIdToken();

        const response = await fetchData(
          `${backendUrl}/consultant/dashboard/${producer.email_user}`,
          'GET',
          null,
          token
        );

        setParcels(response.data || []);
      } catch {
        setParcels([]);
        setError('Error al cargar parcelas');
      }
    };

    // reset al cambiar productor
    setParcels([]);
    getParcels();

  }, [producer]);

  useEffect(() => {
    setParcels([]);
    setSelectedParcelId(null);
    setParcel(null);
    setVegetation(null);
  }, []);
  
  useEffect(() => {
    setSelectedParcelId(null);
    setParcel(null);
    setVegetation(null);
  }, [parcels]);

  if (!producer) return null;

  return (
    <section id="seeFieldsContainer">
      {loading && <p>Cargando parcelas...</p>}
      {error && <p>{error}</p>}

      <article id="mapBox">
        {!loading && parcels.length > 0 && <Map parcels={parcels} />}

        {parcel && (
          <div className="article-card">
            <VegetationIndex vegetation={vegetation} />
          </div>
        )}
      </article>

      {parcel && (
        <article id="detailsParcelBox">
          <ParcelDetails readOnly />
        </article>
      )}
    </section>
  );
};
