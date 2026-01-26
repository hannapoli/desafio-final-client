import { useContext, useState } from 'react';
import { Polygon, useMap, Popup, GeoJSON, ImageOverlay } from 'react-leaflet';
import { MapsContext } from '../../contexts/MapsContext'
import {userMap} from '../../hooks/userMap'
import { Legend } from './Legend';



export const  ClickablePolygon = ({ positions })  => {
  const {deleteParcel, parcels} = useContext(MapsContext)
  const {HealthMap, getInfoMeteoByParcel} = userMap()
  const [healthData, setHealthData] = useState(null);
  const [infoMeteo, setInfoMeteo] = useState(null)
  const [selectedLayerType, setSelectedLayerType] = useState('NDVI');

  const map = useMap();

  // console.log({parcels}, 'desde clickable polygon')
  
//   const parcela = parcels.filter(p => JSON.parse(p.coordinates_parcel)  == positions )
//  console.log({parcela}, 'on clickable polygon')

  // CÁLCULO DE LA CAPA ACTIVA (Fuera de cualquier función para que el render la vea)
  const activeLayer = healthData?.layers?.find(l => l.type === selectedLayerType);

 const handleClick = async(e, p) => {
 console.log('Entra en el hadleClick')
    const zoomToFeature = (e) => {
      const bounds = e.target.getBounds();
      map.fitBounds(bounds, {
        padding: [5, 5],
        maxZoom: 25,
        animate: true,
      });
    };
    zoomToFeature(e)

    const data = await getInfoMeteoByParcel(p.uid_parcel)
    console.log({data})
    setInfoMeteo(data.data)
    
 }
  

  const overLay = async (uid_parcel) => {
    
    const respuesta = await HealthMap(uid_parcel)
    console.log({respuesta})
    setHealthData(respuesta)
  }
// console.log("Capa activa:", activeLayer);
// console.log("Bounds:", healthData?.image_bounds);
 

  return (
    <>
     {parcels.map(p => (
      <Polygon
        key={`${p.uid_parcel}`}
        positions={JSON.parse(p.coordinates_parcel)}
        eventHandlers={{//no se puede utilizar onClick con react-leaflet
          click: (e) => handleClick(e, p),
        }}
      >
        
      <Popup>
        <button onClick={()=>deleteParcel(p.uid_parcel)}>Eliminar</button>
        <button onClick={()=>overLay(p.uid_parcel)}>Ver salud del campo</button>
        <p>Detalle del campo: </p>
        <p>Nombre del campo: {p.name_parcel} </p>
        <p>Cultivo: {p.product_parcel}</p>
        {infoMeteo && (
          <div>
          <p>Temperatura: {infoMeteo.temperature} </p>
        <p>Humedad Relativa: {infoMeteo.relative_humidity} </p>
        <p>Precipitación: {infoMeteo.precipitation}</p>
        <p>Nublado: {infoMeteo.cloud_cover}%</p>
        <p>Velocidad del viento: {infoMeteo.wind_speed}</p>
        <p>Dirección del viento: {infoMeteo.wind_direction}</p>
        </div>
        )}
      </Popup>
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
        <div style={{
                      position: 'absolute', bottom: '160px', right: '20px', zIndex: 1001,
                      padding: '10px', borderRadius: '5px'
                    }}>
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

    </Polygon>))}
    </>
    
  );
}
