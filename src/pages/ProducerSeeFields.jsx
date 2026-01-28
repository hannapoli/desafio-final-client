import { useContext, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFetch } from '../hooks/useFetch';
import { auth } from '../firebase/firebaseConfig';
import { Map } from '../components/Map'
import { userMap } from '../hooks/userMap';
import { MapsContext } from '../contexts/MapsContext';
import { ParcelDetails } from '../components/ParcelDetails';
import { PopUp } from '../components/PopUp';
import { ViewerPopup } from '../components/ViewerPopup';
import { Report } from '../components/Report';
import { ViewerParcelProducer } from "../components/ViewerParcelProducer";

import './ProducerSeeFields.css';

export const ProducerSeeFields = () => {
  const { user } = useAuth();
  const { fetchData, loading, error, setError } = useFetch();
  // const [parcels, setParcels] = useState([]);
  const { getAllAlertsByUser, getAllInfoMeteoByUser } = userMap()
  const { parcels, setParcels, parcel, selectedParcelId } = useContext(MapsContext)
  
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
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

  // FETCH PARA OBTENER LOS PUNTOS A PINTAR EN EL COMPONENTE DEL VISOR 360º
  useEffect(() => {
    const getDataPoints = async () => {
      if (!parcel?.photo_url) {
        setDataPoints(null);
        return;
      }

      try {
        const responsePoints = await fetchData(
          `${infoParcelUrl}/analyze`,
          'POST',
          { image_url: parcel.photo_url }
        );

        const receivedPoints = responsePoints.data;
        console.log('Points received:', receivedPoints);

        // Convertir a array para mapear
        const pointsToPrint = Object.entries(receivedPoints).map(([key, value]) => {
          const { x, y, z } = value.aframe_position;

          return {
            id: key,
            position: `${x} ${y} ${z}`
          }
        });

        setDataPoints(pointsToPrint);
        setError(null);
      } catch (err) {
        setDataPoints(null);
        setError("Error al obtener los puntos de la imagen");
      }
    }

    getDataPoints();
  }, [parcel, infoParcelUrl, fetchData]);

  // FETCH PARA OBTENER DATOS DE LA IMAGEN 360
  useEffect(() => {
    const getDataPhoto = async () => {
      if (!parcel?.uid_parcel) {
        setDataPhoto(null);
        return;
      }

      try {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser) {
          setError('No hay usuario autenticado');
          return;
        }

        const token = await firebaseUser.getIdToken();

        const response = await fetch(
          `${backendUrl}/producer/parcel/data/${parcel.uid_parcel}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        const result = await response.json();
        setDataPhoto(result.data || null);
      } catch (err) {
        setDataPhoto(null);
        console.error("Error al obtener la información de los datos de la parcela:", err);
      }
    }

    getDataPhoto();
  }, [parcel, backendUrl]);

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

    if (!selectedParcelId) {
      setSubmitError('No se ha seleccionado ninguna parcela.');
      return;
    }
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
        `${backendUrl}/producer/reports/create/${user.email}/${selectedParcelId}`,
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
      setTimeout(() => {
        setIsPopupOpen(false);
        setSubmitSuccess(false);
      }, 2000);
    } catch (err) {
      setSubmitError('Error al crear el reporte. Inténtalo de nuevo.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleOpenPopup = () => {
    if (!selectedParcelId) {
      alert('Por favor, selecciona una parcela en el mapa primero');
      return;
    }
    setIsPopupOpen(true);
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  const handleOpenViewer = () => {
    if (!parcel) {
      setError('Por favor, selecciona una parcela en el mapa primero');
      return;
    }
    setIsViewerOpen(true);
  };

  return (
    <>
      {loading && <p>Cargando parcelas...</p>}
      {error && <p>Error al cargar parcelas: {error}</p>}
      <section className='flexContainer CenteredContent'>
        <h1 className='centeredText'>Mis parcelas</h1>

        {/* {parcels.length === 0 ? (
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
      )}    */}
      </section>
      {!loading && <Map parcels={parcels} />}

      {parcel && <ParcelDetails />}
      <div className="btn-container">
        <button
        className="login-button button-360"
        onClick={handleOpenViewer}
        style={{ cursor: parcel ? 'pointer' : 'not-allowed' }}
        disabled={!parcel}
      >
        Ver la parcela 360°
      </button>
      </div>


      {/* CREAR UN REPORTE */}
      <div className='btn-container'>
        <p className='description-text'>Selecciona la parcela en el mapa para crear un reporte</p>
        <button
          onClick={handleOpenPopup}
          className='login-button'
          style={{
            cursor: selectedParcelId ? 'pointer' : 'not-allowed'
          }}
          disabled={!selectedParcelId}
        >Crear un reporte</button>
        {selectedParcelId && (
          <p className='selectedParcel'>
            Parcela seleccionada: {selectedParcelId}
          </p>
        )}
      </div>
      <PopUp isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
        <h2>Crear Reporte</h2>
        {submitSuccess && <p className='successMessage'>¡Reporte creado exitosamente!</p>}
        {submitError && <p className='errorMessage'>{submitError}</p>}
        <Report
          reportData={reportData}
          onChange={handleInputChange}
          onFileChange={handleFileChange}
          onSubmit={handleSubmitReport}
          submitLoading={submitLoading}
          submitLabel='Crear Reporte'
          disabledFields={{ email_creator: true }}
        />
      </PopUp>

      {/* Visor 360° Popup */}
      <ViewerPopup isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)}>
        <div className='heading-container'>
          <h2 className='heading2'>
            Vista 360° - {parcel?.name_parcel || 'Parcela'}
          </h2>
          {!dataPoints && (
            <p className='loading'>
              Cargando hotspots...
            </p>
          )}
          {parcel && dataPoints && (
            <div className='viewer-container'>
              <ViewerParcelProducer
                imageUrl={parcel.photo_url}
                points={dataPoints}
                dataPhoto={dataPhoto}
              />
            </div>
          )}
        </div>
      </ViewerPopup>
    </>
  );
}