import { useContext, useEffect, useState } from 'react'
import { MapsContext } from '../contexts/MapsContext'
import { userMap } from '../hooks/userMap'
import { InfoMeteo } from './InfoMeteo'
import { VegetationIndex } from './Map/VegetationIndex'
import './ParcelDetails.css'
import { PopUp } from './PopUp'
import { ViewerPopup } from './ViewerPopup'
import { Report } from '../components/Report';


export const ParcelDetails = () => {
    const {parcel, setparcels, meteo, alert, setAlert, infoMeteo, vegetation, setVegetation, crop, setCrop, selectedParcelId} = useContext(MapsContext)
    const {getAlertByParcel, getParcelCrops, getParcelVegetation} = userMap()

      const [isPopupOpen, setIsPopupOpen] = useState(false);
      const [isViewerOpen, setIsViewerOpen] = useState(false);
        const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [reportData, setReportData] = useState({
    email_creator: '',
    email_receiver: '',
    content_message: '',
    attached: null
  });
  
  const [dataPoints, setDataPoints] = useState(null);
  const [dataPhoto, setDataPhoto] = useState(null);

    useEffect(() => {
        const getDatos = async () => {

            const alerta = await getAlertByParcel(parcel.uid_parcel)
            setAlert(alerta)

            const vegetacion = await getParcelVegetation(parcel.uid_parcel)
            // console.log({vegetacion})
            setVegetation(vegetacion.data)

            const cultivo = await getParcelCrops(parcel.uid_parcel)
            // console.log({cultivo})
            setCrop(cultivo.data)
       console.log({parcel})
        }
        getDatos()
    }, [parcel])

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
    
  return (
    <section id="parcel-section">
  <h2 className="parcel-title">{parcel.name_parcel}</h2>

  <article className="article-card">
    <p>👤 Productor: {alert.name_user}</p>
    {crop && <p className="product-info">Producto: {crop.nombre_cultivo}</p>}
    {crop && <p className="product-info">Variedad: {crop.nombre_variedad}</p>}
    
    {alert.alerta_plaga && <p className="alert alert-plaga">⚠️ Alerta de plagas: {alert.alerta_plaga}</p>}
    {alert.alerta_inundacion && <p className="alert alert-inundacion">⚠️ Alerta de inundación: {alert.alerta_inundacion}</p>}
    {alert.alerta_helada && <p className="alert alert-helada">⚠️ Alerta de helada: {alert.alerta_helada}</p>}
    {alert.alerta_sequia && <p className="alert alert-sequia">⚠️ Alerta de sequía: {alert.alerta_sequia}</p>}
  </article>

  <article className="article-card" id="meteo-section">
    <h3 className="meteo-title">Información meteorológica</h3>
    {infoMeteo && <InfoMeteo p={parcel} infoMeteo={infoMeteo} />}
  </article>

  <article>
    
          <button
            className="btn-report"
            onClick={handleOpenViewer}
            style={{ cursor: parcel ? 'pointer' : 'not-allowed' }}
            disabled={!parcel}
          >
            Ver la parcela 360°
          </button>
    
          {/* CREAR UN REPORTE */}
          <div className='btn-container'>
            <p className='description-text'>Selecciona la parcela en el mapa para crear un reporte</p>
            <button
              onClick={handleOpenPopup}
              className='btn-report'
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
  </article>

  
</section>

    
  )
}
