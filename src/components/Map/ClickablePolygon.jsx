import { useContext, useEffect, useState } from 'react';
import { Polygon, useMap, Popup, GeoJSON, ImageOverlay } from 'react-leaflet';
import { MapsContext } from '../../contexts/MapsContext'
import {userMap} from '../../hooks/userMap'
import { Legend } from './Legend';
import './Legend.css'


export const  ClickablePolygon = ()  => {

  const {parcel, parcels, setParcel, setSelectedParcelId,  setInfoMeteo} = useContext(MapsContext)
  const {HealthMap, getInfoMeteoByParcel, deleteParcelApi, deleteParcelBack} = userMap()
  const [healthData, setHealthData] = useState(null);
  const [selectedLayerType, setSelectedLayerType] = useState('NDVI');


  const map = useMap();


  // CÁLCULO DE LA CAPA ACTIVA (Fuera de cualquier función para que el render la vea)
  const activeLayer = healthData?.layers?.find(l => l.type === selectedLayerType);

  const zoomToFeature = (e) => {
        const bounds = e.target.getBounds();
        map.fitBounds(bounds, {
          padding: [5, 5],
          maxZoom: 30,
          animate: true,
        });
      };


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
  

  const overLay = async (uid_parcel) => {
    
    const respuesta = await HealthMap(uid_parcel)
    console.log('Health map' ,{respuesta})
    setHealthData(respuesta)
    // console.log({healthData})
    
  }
    useEffect(() => {
  if (healthData) {
    console.log('healthData actualizado:', healthData);
  }
}, [healthData]);
  
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
