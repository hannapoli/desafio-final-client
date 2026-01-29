import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { auth } from '../firebase/firebaseConfig';
import { ConsultantSeeProducerFields } from './ConsultantSeeProducerFields';

export const ConsultantFields = () => {
  const { user } = useAuth();
  const { fetchData, loading, error, setError } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [productores, setProductores] = useState([]);
  const [selectedProducer, setSelectedProducer] = useState(null);

  useEffect(() => {
    const getProductores = async () => {
      if (!user?.uid) return;

      try {
        const token = await auth.currentUser.getIdToken();
        const response = await fetchData(
          `${backendUrl}/consultant/producers/${user.uid}`,
          'GET',
          null,
          token
        );
        setProductores(response.data || []);
      } catch (err) {
        setError('Error al obtener productores');
      }
    };

    getProductores();
  }, [user]);

  const handleSelectChange = (e) => {
    const selectedEmail = e.target.value;
    const producer = productores.find(p => p.email_user === selectedEmail);
    setSelectedProducer(producer || null);
  };

  return (
    <>
      <h1 className='centeredText'>Parcelas de mis productores</h1>
      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      {/* SELECT DE PRODUCTORES */}

      <div className="producer-select">
        <h2>Productores asignados</h2>
        <select value={selectedProducer?.email_user || ''} onChange={handleSelectChange}>
          <option value="">Selecciona un productor</option>
          {productores.map((producer) => (
            <option key={producer.email_user} value={producer.email_user}>
              {producer.name_user} ({producer.email_user})
            </option>
          ))}
        </select>
      </div>

      {/* Mostrar parcelas del productor seleccionado */}
      {selectedProducer && (
        <ConsultantSeeProducerFields producer={selectedProducer} />
      )}
    </>
  );
};
