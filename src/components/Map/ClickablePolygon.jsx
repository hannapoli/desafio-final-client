import { useContext, useEffect, useState } from 'react';
import { Polygon, useMap, Popup, GeoJSON, ImageOverlay } from 'react-leaflet';
import { MapsContext } from '../../contexts/MapsContext'
import {userMap} from '../../hooks/userMap'
import { Legend } from './Legend';
import './Legend.css'

/**
 * ClickablePolygon component.
 *
 * Renderiza las parcelas como polígonos interactivos sobre el mapa.
 * Permite seleccionar una parcela, hacer zoom sobre ella y superponer
 * capas de salud del cultivo (NDVI u otras) obtenidas desde el backend.
 *
 * @component
 * @returns {JSX.Element} Conjunto de polígonos interactivos con overlays
 */
export const  ClickablePolygon = ()  => {

  const {parcel, parcels, setParcel, setSelectedParcelId,  setInfoMeteo} = useContext(MapsContext)
  const {HealthMap, getInfoMeteoByParcel, deleteParcelApi, deleteParcelBack} = userMap()
  const [healthData, setHealthData] = useState(null);
  const [selectedLayerType, setSelectedLayerType] = useState('NDVI');


  const map = useMap();


  // CÁLCULO DE LA CAPA ACTIVA (Fuera de cualquier función para que el render la vea)
  const activeLayer = healthData?.layers?.find(l => l.type === selectedLayerType);

    /**
   * Ajusta el mapa para hacer zoom sobre el polígono seleccionado.
   *
   * @function
   * @param {Object} e - Evento de Leaflet asociado al polígono
   * @returns {void}
   */
  const zoomToFeature = (e) => {
        const bounds = e.target.getBounds();
        map.fitBounds(bounds, {
          padding: [5, 5],
          maxZoom: 30,
          animate: true,
        });
      };

  /**
   * Maneja el clic sobre un polígono de parcela.
   *
   * - Hace zoom sobre la parcela
   * - Establece la parcela seleccionada
   * - Obtiene información meteorológica
   * - Carga la capa de salud del cultivo
   *
   * @async
   * @function
   * @param {Object} e - Evento de Leaflet
   * @param {Object} p - Parcela seleccionada
   * @returns {Promise<void>}
   */
 const handleClick = async(e, p) => {
 console.log('Entra en el hadleClick')
   
    zoomToFeature(e)
    const data = await getInfoMeteoByParcel(p.uid_parcel)
    console.log({data})
    setInfoMeteo(data.data)
    setParcel(p);
    setSelectedParcelId(p.uid_parcel);
    overLay(p.uid_parcel)
    // setUnmark(p.uid_parcel)
    // console.log({p},'desde el polígono')
 }
  
  /**
   * Carga los datos de salud del cultivo para una parcela concreta.
   *
   * @async
   * @function
   * @param {string} uid_parcel - Identificador único de la parcela
   * @returns {Promise<void>}
   */
  const overLay = async (uid_parcel) => {
    
    const respuesta = await HealthMap(uid_parcel)
    console.log('Health map' ,{respuesta})
    setHealthData(respuesta)
    // console.log({healthData})
    
  }
  /**
   * Efecto de depuración al actualizar los datos de salud.
   */
    useEffect(() => {
  if (healthData) {
    console.log('healthData actualizado:', healthData);
  }
}, [healthData]);
  
/**
 * Resetea el estado de capas cuando no hay parcela seleccionada.
 */
useEffect(() => {
    if (!parcel) {
      // setHealthData(null);
      setSelectedLayerType('NDVI');
    }
  }, [parcel]);


  return (
    <>
     {parcels.map(p => (
      <Polygon
        key={`${p.uid_parcel}`}
        positions={JSON.parse(p.coordinates_parcel)}
        eventHandlers={{//no se puede utilizar onClick con react-leaflet
          click: (e) => {
                handleClick(e, p)
        }}}
      >   

    </Polygon>))}
    {activeLayer && healthData.image_bounds && healthData.image_bounds.length === 2 &&(
        <ImageOverlay
          url={activeLayer.image_data}
          bounds={healthData.image_bounds}
          opacity={0.7}
          interactive={false}
          zIndex={500}
        />
      )}
      {healthData && (
        <div className='select-overlay' >
                <select 
                  value={selectedLayerType} 
                  onChange={(e) => setSelectedLayerType(e.target.value)}
                >
                  {healthData.layers.map(l => (
                    <option key={l.type} value={l.type}>{l.type}</option>
                  ))}
                </select>
      </div>
              )}
      {activeLayer && <Legend data={activeLayer.legend} />}
 
  

    </>
    
  );
}
