import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { auth } from '../firebase/firebaseConfig';
import { ViewerParcelProducer } from "../components/ViewerParcelProducer";
import { Report } from '../components/Report';


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

  const [dataPoints, setDataPoints] = useState(null);
  const [dataPhoto, setDataPhoto] = useState(null);

  const infoParcelUrl = import.meta.env.VITE_API_DATA_URL_POINTS;

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
        if (err.message?.includes('403') || err.message?.includes('permiso')) {
          setError('No tienes permiso para ver esta parcela');
        } else {
          setError('Error al obtener la parcela');
        }
      }
    };

    getParcel();
  }, [user, backendUrl, fetchData, id]);

  // FETCH PARA OBTENER LOS PUNTOS A PINTAR EN EL COMPONENTE
  useEffect(() => {
    const getDataPoints = async () => {
      try {
        const responsePoints = await fetchData(
          `${infoParcelUrl}/analyze`,
          'POST',
          { image_url: parcel.photo_url }
        );

        const receivedPoints = responsePoints.data;
        console.log(receivedPoints)

        // Convertir a array para mapear
        const pointsToPrint = Object.entries(receivedPoints).map(([key, value]) => {
          const { x, y, z } = value.aframe_position;

          return {
            id: key,
            position: `${x} ${y} ${z}`
          }

        });

        setDataPoints(pointsToPrint)
        setError(null);

      } catch (err) {
        setDataPoints(null)
        setError("Error al obtener los puntos de la imagen");
      }
    }

    getDataPoints();
  }, [parcel]);

  // FETCH PARA OBTENER DATOS DE LA IMAGEN 360
  useEffect(() => {
    const getDataPhoto = async () => {
      try {

        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          setSubmitError('No hay usuario autenticado');
          return;
        }

        const token = await firebaseUser.getIdToken();
        console.log(token);
        
        const response = await fetch(
        `${backendUrl}/producer/parcel/data/${id}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
        const result = await response.json();
        setDataPhoto(result.data || null);
        setError(null);

      } catch (err) {
        setDataPhoto(null)
        setError("Error al obtener la información de los datos de la parcela");
      }
    }

    getDataPhoto();
  }, [parcel]);

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
    const files = e.target.files;
    setReportData(currentData => ({
      ...currentData,
      attached: files && files.length > 0 ? Array.from(files) : null
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
        if (Array.isArray(reportData.attached)) {
          reportData.attached.forEach((file) => {
            formData.append('attached', file);
          });
        } else {
          formData.append('attached', reportData.attached);
        }
      }

      const response = await fetch(
        `${backendUrl}/producer/reports/create/${user.email}/${id}`,
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
        <>
          <article >
            <h2>Detalles de la Parcela</h2>
            <pre>{JSON.stringify(parcel, null, 2)}</pre>
          </article>

          {!dataPoints && <p>Cargando hotspots</p>}
          
          {dataPoints && (
            <ViewerParcelProducer imageUrl={parcel.photo_url} points={dataPoints} dataPhoto={dataPhoto}/>
          )}
        </>
      )}
      <article className='flexColumn centeredContent'>
        <h2>Crear Reporte</h2>

        {submitSuccess && <p className='successMessage'>¡Reporte creado exitosamente!</p>}
        {submitError && <p className='errorMessage'>{submitError}</p>}

        <Report reportData={reportData}
          onChange={handleInputChange}
          onFileChange={handleFileChange}
          onSubmit={handleSubmitReport}
          submitLoading={submitLoading}
          submitLabel='Crear Reporte'
          disabledFields={{ email_creator: true }}
        />
      </article>
    </section>
  );
}
