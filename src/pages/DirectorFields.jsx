import { useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { auth } from '../firebase/firebaseConfig';
import { Map } from '../components/Map';
import { MapsContext } from '../contexts/MapsContext';
import '../components/ParcelDetails.css'
import './DirectorFields.css'
import { ParcelDetails } from '../components/ParcelDetails';
import { PopUp } from '../components/PopUp';


import './ProducerSeeFields.css';
import { VegetationIndex } from '../components/Map/VegetationIndex';

export const DirectorFields = () => {
  
  const { user } = useAuth();
  const { fetchData, loading, error, setError } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [parcelsBack, setParcelsBack] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupParcel, setPopupParcel] = useState(null);
  const { parcels, setParcels, parcel, selectedParcelId, vegetation, setSelectedParcelId, setParcel, setVegetation } = useContext(MapsContext)
  const [selectedProducerEmail, setSelectedProducerEmail] = useState('');
  const [producers, setProducers] = useState([]);
  const [showMap, setShowMap] = useState(false); // Para alternar tabla/mapa

  // Fetch todas las parcelas
  useEffect(() => {
    const getParcels = async () => {
      if (!user?.uid) return;

      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) return;

        const token = await firebaseUser.getIdToken();
        const response = await fetchData(
          `${backendUrl}/director/dashboard/${user.uid}`,
          'GET',
          null,
          token
        );

        const data = response.data || [];
        setParcelsBack(data);
        setParcels(data)

        // Obtener lista de productores únicos para el select
        const uniqueProducers = Array.from(
          new Set(data.map(p => p.email_user))
        ).map(email => {
          const producerParcel = data.find(p => p.email_user === email);
          return {
            email_user: email,
            name_user: producerParcel?.name_user || 'Sin nombre'
          };
        });
        setProducers(uniqueProducers);

      } catch (err) {
        setParcelsBack([]);
        if (err.message?.includes('403') || err.message?.includes('permiso')) {
          setError('No tienes permiso para ver estas parcelas');
        } else {
          setError('Error al obtener parcelas');
        }
      }
    };

    getParcels();
  }, [user, backendUrl, fetchData]);

  // Filtrar parcelas según el productor seleccionado
  const filteredParcels = selectedProducerEmail
    ? parcelsBack.filter(p => p.email_user === selectedProducerEmail)
    : parcelsBack;

  // Agrupar parcelas por productor para la tabla
  const groupedParcels = filteredParcels.reduce((acc, parcel) => {
    const email = parcel.email_user || 'Sin email';
    if (!acc[email]) acc[email] = [];
    acc[email].push(parcel);
    return acc;
  }, {});

  const mostrarCoords = (parcel) => {
    setPopupParcel(parcel);
  };
  const cerrarPopup = () => setPopupParcel(null);

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
  }, [selectedProducerEmail]);

  return (
    <section className='page-container'>
      <h1 className='centeredText'>Parcelas</h1>

      {loading && <p>Cargando parcelas...</p>}
      {error && <p>Error al cargar parcelas: {error}</p>}

      {/* SELECT DE PRODUCTORES */}
      <div className="producer-select">
        <h2>Mis productores</h2>
        <select
          value={selectedProducerEmail}
          onChange={e => setSelectedProducerEmail(e.target.value)}
        >
          <option value="">Todos los productores</option>
          {producers.map(prod => (
            <option key={prod.email_user} value={prod.email_user}>
              {prod.name_user} ({prod.email_user})
            </option>
          ))}
        </select>
      </div>

      {/* BOTÓN PARA ALTERNAR TABLA / MAPA */}
      <div style={{ margin: '15px 0' }}>
        <button onClick={() => setShowMap(prev => !prev)}>
          {showMap ? 'Ver tabla' : 'Ver mapa'}
        </button>
      </div>
      <section id='seeFieldsContainer'>
        {showMap ? (
          <article id='mapBox'>
            {!loading && <Map key={selectedProducerEmail || 'all'} parcels={filteredParcels} />}
            {parcel && (
              <div className="article-card" id="vegetation-section">
                <VegetationIndex vegetation={vegetation} />
              </div>
            )}
          </article>
        ) : (
          filteredParcels.length > 0 && (
            <table className="parcel-table">
              <thead>
                <tr>
                  <th>Parcela</th>
                  <th>Coordenadas</th>
                  <th>Cultivo</th>
                  <th>Variedad</th>
                  <th>Rendimiento en Kg/m&sup2;</th>
                </tr>
              </thead>
              <tbody>
                {filteredParcels.map((parcel, index) => (
                  <tr key={parcel.uid_parcel || index}>
                    <td data-label="Parcela">{parcel.name_parcel}</td>
                    <td data-label="Coordenadas">
                      <button onClick={() => mostrarCoords(parcel)}>
                        Mostrar Coordenadas
                      </button>
                    </td>
                    <td data-label="Cultivo">{parcel.nombre_cultivo}</td>
                    <td data-label="Parcela">{parcel.nombre_variedad}</td>
                    <td data-label="Rendimiento Kg/m²">{parcel.rendimiento_teorico}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}

        {/* Detalles de la parcela solo se muestran en el mapa */}
        {showMap && parcel && (
          <article id='detailsParcelBox'>
            <ParcelDetails />
          </article>
        )}
      </section>
    {popupParcel && (
      <PopUp isOpen={true} onClose={cerrarPopup}>
        {popupParcel.coordinates_parcel}
      </PopUp>
    )}
    </section>
  );
  
};

