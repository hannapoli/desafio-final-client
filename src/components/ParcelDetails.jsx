import { useContext, useEffect, useState } from 'react'
import { MapsContext } from '../contexts/MapsContext'
import { userMap } from '../hooks/userMap'
import { useFetch } from '../hooks/useFetch'
import { auth } from '../firebase/firebaseConfig'
import { InfoMeteo } from './InfoMeteo'
import { VegetationIndex } from './Map/VegetationIndex'
import './ParcelDetails.css'
import { PopUp } from './PopUp'
import { ViewerPopup } from './ViewerPopup'
import { Report } from '../components/Report'
import { ViewerParcelProducer } from './ViewerParcelProducer'
import { useAuth } from '../hooks/useAuth'


export const ParcelDetails = () => {
  const { parcel,alert, setAlert, infoMeteo, setVegetation, crop, setCrop, selectedParcelId, deleteParcel} = useContext(MapsContext)
  const { getAlertByParcel, getParcelCrops, getParcelVegetation, deleteParcelApi, deleteParcelBack } = userMap()
  const { fetchData } = useFetch()
  const { user } = useAuth();
  const isProducer = user?.role === 'productor';
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState(null)
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
    const getDatos = async () => {

      const alerta = await getAlertByParcel(parcel.uid_parcel)
      // console.log({alerta})
      setAlert(alerta.data)

      const vegetacion = await getParcelVegetation(parcel.uid_parcel)
      // console.log({vegetacion})
      setVegetation(vegetacion.data)

      const cultivo = await getParcelCrops(parcel.uid_parcel)
      // console.log({cultivo})
      setCrop(cultivo.data)
      console.log({ parcel })
    }
    getDatos()
    // return funcionPrueba()
  }, [parcel])

  // FETCH PARA OBTENER LOS PUNTOS A PINTAR EN EL COMPONENTE DEL VISOR 360º
  useEffect(() => {
    const getDataPoints = async () => {
      if (!parcel?.photo_url) {
        setDataPoints(null);
        return;
      }

      try {
        // Add a timeout to prevent hanging
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const responsePoints = await fetchData(
          infoParcelUrl,
          'POST',
          { image_url: parcel.photo_url }
        );

        clearTimeout(timeoutId);

        const receivedPoints = responsePoints.data;
        console.log('Points received:', receivedPoints);

        if (receivedPoints?.error || receivedPoints?.status === 'error') {
          console.error('Error del servidor:', receivedPoints);
          throw new Error(receivedPoints.error || receivedPoints.message || 'Error desconocido del servidor');
        }

        if (!receivedPoints || typeof receivedPoints !== 'object' || Object.keys(receivedPoints).length === 0) {
          console.warn('No se recibieron puntos válidos del servidor');
          setDataPoints([]);
          return;
        }

        // Convertir a array para mapear
        const pointsToPrint = Object.entries(receivedPoints)
          .filter(([key, value]) => value?.aframe_position) 
          .map(([key, value]) => {
            const { x, y, z } = value.aframe_position;

            return {
              id: key,
              position: `${x} ${y} ${z}`
            }
          });

        setDataPoints(pointsToPrint);
      } catch (err) {
        console.warn("No se pudieron cargar los puntos de interés - el servidor puede estar caído:", err.message);
        // Set empty array instead of null so the image still shows
        setDataPoints([]);
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
          console.error('No hay usuario autenticado');
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

  const handleOpenViewer = () => {
    if (!parcel) {
      setError('Por favor, selecciona una parcela en el mapa primero');
      return;
    }
    setIsViewerOpen(true);
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

  const eliminarParcela = async(p) => {
      if(!p.uid_parcel) return
      try {
        // const resp1 = await deleteParcelApi(p.uid_parcel)
        const resp1= {res: 'ok'}
        if(resp1.res === 'Error'){
          setErrorEliminar(resp1.info)}
        if(!resp1){
          setErrorEliminar('Error al eliminar la parcela')
        
        } else {
          const resp = await deleteParcelBack(p.uid_parcel)
          // console.log({resp}, 'delete')
           if (!resp.ok) {
              setErrorEliminar(resp.msg);
            } else {
              console.log({resp})
              setErrorEliminar(null);
              deleteParcel(p)
              console.log('parcela eliminada' , resp)
            }
        }
        
      } catch (error) {
        console.log(error)
        setErrorEliminar(error)
      }
    }
    

  if (!parcel) {
    return <p>Cargando detalles de la parcela...</p>;
  }

  return (
    <section id="parcel-section">
      <h2 className="parcel-title">{parcel.name_parcel}</h2>

      <article className="article-card">
        {alert?.name_user && <p>👤 Productor: {alert.name_user}</p>}
        {crop && <p className="product-info">Producto: {crop.nombre_cultivo}</p>}
        {crop && <p className="product-info">Variedad: {crop.nombre_variedad}</p>}

        {alert?.alerta_plaga && <p className="alert alert-plaga">⚠️ Alerta de plagas: {alert.alerta_plaga}</p>}
        {alert?.alerta_inundacion && <p className="alert alert-inundacion">⚠️ Alerta de inundación: {alert.alerta_inundacion}</p>}
        {alert?.alerta_helada && <p className="alert alert-helada">⚠️ Alerta de helada: {alert.alerta_helada}</p>}
        {alert?.alerta_sequia && <p className="alert alert-sequia">⚠️ Alerta de sequía: {alert.alerta_sequia}</p>}
      </article>

      {infoMeteo && <article className="article-card" id="meteo-section">
        <h3 className="meteo-title">Información meteorológica</h3>
        <InfoMeteo p={parcel} infoMeteo={infoMeteo} />
      </article>}

      <article className="visor-reporte">

        <button
          className="login-button"
          onClick={handleOpenViewer}
          style={{ cursor: parcel ? 'pointer' : 'not-allowed' }}
          disabled={!parcel}
        >
          Ver la parcela 360°
        </button>

          

        {/* CREAR UN REPORTE */}
        {isProducer && (
          <>
            <div className='btn-container'>
              <p className='description-text'>
                Selecciona la parcela en el mapa para crear un reporte
              </p>

              <button
                onClick={handleOpenPopup}
                className='login-button'
                style={{
                  cursor: selectedParcelId ? 'pointer' : 'not-allowed'
                }}
                disabled={!selectedParcelId}
              >
                Crear un reporte
              </button>

              {selectedParcelId && (
                <p className='selectedParcel'>
                  Parcela seleccionada: {selectedParcelId}
                </p>
              )}
            </div>

            <PopUp isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)}>
              <h2>Crear reporte</h2>
              {submitSuccess && (
                <p className='successMessage'>¡Reporte creado exitosamente!</p>
              )}
              {submitError && (
                <p className='errorMessage'>{submitError}</p>
              )}
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
          </>
        )}

        {/* Visor 360° Popup */}
        <ViewerPopup isOpen={isViewerOpen} onClose={() => setIsViewerOpen(false)}>
          <div className='heading-container'>
            <h2 className='heading2'>
              Vista 360° - {parcel?.name_parcel || 'Parcela'}
            </h2>
            {parcel && parcel.photo_url ? (
              <div className='viewer-container'>
                <ViewerParcelProducer
                  imageUrl={parcel.photo_url}
                  points={dataPoints || []}
                  dataPhoto={dataPhoto}
                />
              </div>
            ) : (
              <p className='loading'>
                No hay imagen 360° disponible para esta parcela
              </p>
            )}
          </div>
        </ViewerPopup>
          {isProducer && (
          <button className="eliminar-parcela" id='btn-eliminar-parcela' onClick={()=>eliminarParcela(parcel)}>Eliminar parcela</button>)}
  </article>


    </section>


  )
}
