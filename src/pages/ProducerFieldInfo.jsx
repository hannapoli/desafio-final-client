import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { auth } from '../firebase/firebaseConfig';

export const ProducerFieldInfo = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { fetchData, loading, error, setError } = useFetch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [parcel, setParcel] = useState(null);
  const [reportData, setReportData] = useState({
    email_creator: '',
    email_receiver: '',
    content_message: '',
    attached: null
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const getParcel = async () => {
      if (!user?.uid || !id) return;

      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          console.error('No hay usuario autenticado en Firebase');
          return;
        }
        
        const token = await firebaseUser.getIdToken();
        
        const response = await fetchData(
          `${backendUrl}/producer/parcel/${id}`,
          'GET',
          null,
          token
        );
        setParcel(response.data || null);
        // console.log('Datos de la parcela elegida:', response);
      } catch (err) {
        setParcel(null);
        setError('Error al obtener la parcela');
      }
    };

    getParcel();
  }, [user, backendUrl, fetchData, id]);

  useEffect(() => {
    if (user?.email) {
      setReportData(currentData => ({
        ...currentData,
        email_creator: user.email
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReportData(currentData => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setReportData(currentData => ({
      ...currentData,
      attached: e.target.files[0]
    }));
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        setSubmitError('No hay usuario autenticado');
        return;
      }

      const token = await firebaseUser.getIdToken();

      const formData = new FormData();
      formData.append('email_creator', reportData.email_creator);
      formData.append('email_receiver', reportData.email_receiver);
      formData.append('content_message', reportData.content_message);
      if (reportData.attached) {
        formData.append('attached', reportData.attached);
      }

      const response = await fetch(
        `${backendUrl}/producer/reports/create/${user.email}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error(`Error al mandar el reporte: ${response.status}`);
      }

      const result = await response.json();
      // console.log('Reporte creado:', result);
      setSubmitSuccess(true);
      
      setReportData({
        email_creator: user.email,
        email_receiver: '',
        content_message: '',
        attached: null
      });
      
      // Resetear las entradas del formulario y el archivo
      e.target.reset();
    } catch (err) {
      setSubmitError('Error al crear el reporte. Inténtalo de nuevo.');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <section className='flexColumn centeredContent'>
      <h1>Información de la Parcela</h1>
      
      {loading && <p>Cargando la información de la parcela...</p>}
      {error && <p>Error al cargar la parcela: {error}</p>}
      
      {parcel && (
        <article >
          <h2>Detalles de la Parcela</h2>
          <pre>{JSON.stringify(parcel, null, 2)}</pre>
        </article>
      )}

      <article className='flexColumn centeredContent'>
        <h2>Crear Reporte</h2>
        
        {submitSuccess && <p className='successMessage'>¡Reporte creado exitosamente!</p>}
        {submitError && <p className='errorMessage'>{submitError}</p>}
        
        <form onSubmit={handleSubmitReport} className='flexColumn'>
          <div className='flexColumn'>
            <label htmlFor='email_creator'>Email de remitente:</label>
            <input
              type='email'
              name='email_creator'
              id='email_creator'
              value={reportData.email_creator}
              onChange={handleInputChange}
              readOnly
              noValidate
            />
          </div>

          <div className='flexColumn'>
            <label htmlFor='email_receiver'>Email de receptor:</label>
            <input
              type='email'
              name='email_receiver'
              id='email_receiver'
              placeholder='Email del receptor'
              value={reportData.email_receiver}
              onChange={handleInputChange}
              noValidate
            />
          </div>

          <div className='flexColumn'>
            <label htmlFor='content_message'>Contenido del Mensaje:</label>
            <textarea
              name='content_message'
              id='content_message'
              placeholder='Escribe el contenido del reporte...'
              value={reportData.content_message}
              onChange={handleInputChange}
              rows={6}
              noValidate
            />
          </div>

          <div className='flexColumn'>
            <label htmlFor='attached'>Archivo Adjunto (opcional):</label>
            <input
              type='file'
              name='attached'
              id='attached'
              onChange={handleFileChange}
            />
          </div>

          <button 
            type='submit' 
            disabled={submitLoading}
          >
            {submitLoading ? 'Enviando...' : 'Crear Reporte'}
          </button>
        </form>
      </article>
    </section>
  );
}
