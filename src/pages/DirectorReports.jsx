import { auth } from '../firebase/firebaseConfig';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { normalizeFileData } from '../helpers/normalizeFileData';
import '../components/List.css';
import { Disease } from '../components/Disease';

export const DirectorReports = () => {
  const { user } = useAuth();
  const { fetchData, loading, error, setError } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const diseaseUrl = import.meta.env.VITE_API_DISEASE_URL;

  const [showDiseasePopup, setShowDiseasePopup] = useState(false);
  const [productores, setProductores] = useState([]);
  const [selectedProducer, setSelectedProducer] = useState('');
  const [reports, setReports] = useState([]);
  const [disease, setDisease] = useState(null);

  // Obtener productores
  useEffect(() => {
    const fetchProductores = async () => {
      if (!user?.uid) return;

      try {
        const token = user.token || await auth.currentUser?.getIdToken();
        const response = await fetchData(
          `${backendUrl}/director/productor/getAll/${user.uid}`,
          'GET',
          null,
          token
        );
        setProductores(response.data || []);
      } catch (err) {
        setError('Error al obtener productores');
      }
    };

    fetchProductores();
  }, [user]);

  // Obtener reportes (solo al submit)
  const fetchReports = async () => {
    if (!selectedProducer) return;

    setReports([]);

    try {
      const token = user.token || await auth.currentUser?.getIdToken();
      const response = await fetchData(
        `${backendUrl}/director/reports/getAll/${selectedProducer}`,
        'GET',
        null,
        token
      );

      const reportsData = Array.isArray(response.data)
        ? response.data
        : response.data
        ? [response.data]
        : [];

      const normalizedReports = reportsData.map(report => ({
        ...report,
        attached: normalizeFileData(report.attached)
      }));

      setReports(normalizedReports);
    } catch (err) {
      setError('Error al obtener los reportes');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const handleSelectChange = (e) => {
    setSelectedProducer(e.target.value);
    setReports([]); // limpia reportes anteriores al cambiar productor
  };

  const handleDownload = async (id) => {
    try {
      const token = user.token || await auth.currentUser?.getIdToken();
      const res = await fetch(`${backendUrl}/producer/reports/download/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Error al descargar el reporte');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_${id}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log('ERROR:', error);
      alert(error);
    }
  };

  const handleDisease = async (url) => {
    try {
      const res = await fetchData(`${diseaseUrl}/analyze`, 'POST', {
        image_url: url,
      });
      setDisease(res);
      setShowDiseasePopup(true);
    } catch (error) {
      console.log('ERROR:', error);
      alert(error);
    }
  };

  const sortedReports = [...reports].sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0;
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <section className='page-container'>
      <div>
        <h1 className='centeredText'>Mis reportes</h1>
        {loading && <p>Cargando...</p>}
        {error && <p className='errorMessage'>{error}</p>}

        {/* SELECT + SUBMIT */}
        <form className='report-form' onSubmit={handleSubmit}>
          <select value={selectedProducer} onChange={handleSelectChange}>
            <option value=''>Selecciona un productor</option>
            {productores.map((producer) => (
              <option key={producer.email_user} value={producer.email_user}>
                {producer.name_user} ({producer.email_user})
              </option>
            ))}
          </select>

          <button type='submit' disabled={!selectedProducer}>
            Ver reportes
          </button>
        </form>

        <ul className='report-list'>
          {sortedReports.map((report) => (
            <li className='report-list-item' key={report.uid_report}>
              <div>Parcela: {report.uid_parcel}</div>
              <div>De: {report.email_creator}</div>
              <div>Para: {report.email_receiver}</div>
              <div>Mensaje: {report.content_message}</div>

              {report.attached && report.attached.length > 0 && (
                <div>
                  Archivos adjuntos ({report.attached.length}):
                  <ul>
                    {report.attached.map((fileUrl, index) => (
                      <li key={index}>
                        <a
                          href={fileUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Archivo {index + 1}
                        </a>
                        <button
                          className='api-btn'
                          onClick={() => handleDisease(fileUrl)}
                        >
                          Predicción enfermedades
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className='report-actions'>
                <button
                  className='download-btn'
                  onClick={() => handleDownload(report.uid_report)}
                >
                  Descargar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {showDiseasePopup && disease && (
        <Disease
          setShowDiseasePopup={setShowDiseasePopup}
          disease={disease}
        />
      )}
    </section>
  );
};
