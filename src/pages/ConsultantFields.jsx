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

  return (
    <>
      <h1>Mis productores</h1>

      {loading && <p>Cargando...</p>}
      {error && <p>{error}</p>}

      <section className="producer-list">
        {productores.map((producer) => (
          <div key={producer.email_user}>
            <h3>{producer.name_user}</h3>
            <p>{producer.email_user}</p>
            <button onClick={() => setSelectedProducer(producer)}>
              Ver parcelas
            </button>
          </div>
        ))}
      </section>

      {/* 🔥 AQUÍ se llama al otro */}
      {selectedProducer && (
        <ConsultantSeeProducerFields producer={selectedProducer} />
      )}
    </>
  );
};
