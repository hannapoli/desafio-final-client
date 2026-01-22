import { useContext, useState } from 'react';
import { Polygon, useMap, Popup, GeoJSON, ImageOverlay } from 'react-leaflet';
import { MapsContext } from '../../contexts/MapsContext'
import {userMap} from '../../hooks/userMap'
import { Legend } from './Legend';



export const  ClickablePolygon = ({ positions })  => {
  const {deleteParcel} = useContext(MapsContext)
  const {simulaciónLlamadaApiSaludDelCampo} = userMap()
  const [healthData, setHealthData] = useState(null);
  const [selectedLayerType, setSelectedLayerType] = useState('NDVI');



  const map = useMap();

  // CÁLCULO DE LA CAPA ACTIVA (Fuera de cualquier función para que el render la vea)
  const activeLayer = healthData?.layers?.find(l => l.type === selectedLayerType);

  const zoomToFeature = (e) => {
    const bounds = e.target.getBounds();
    map.fitBounds(bounds, {
      padding: [5, 5],
      maxZoom: 25,
      animate: true,
    });
  };

  const overLay = async (p) => {
    
    const respuesta = simulaciónLlamadaApiSaludDelCampo()
    setHealthData(respuesta[0])
  }
console.log("Capa activa:", activeLayer);
console.log("Bounds:", healthData?.image_bounds);


  return (
    <>
     {positions.map(p => (
      <Polygon
        key={`${p[0]}`}
        positions={p}
        eventHandlers={{ //no se puede utilizar onClick con react-leaflet
          click: zoomToFeature,
        }}
      >
      <Popup>
        <button onClick={()=>deleteParcel(p)}>Eliminar</button>
        <button onClick={()=>overLay(p)}>Detalles</button>
        {healthData && (
                <select 
                  value={selectedLayerType} 
                  onChange={(e) => setSelectedLayerType(e.target.value)}
                >
                  {healthData.layers.map(l => (
                    <option key={l.type} value={l.type}>{l.type}</option>
                  ))}
                </select>
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
      {activeLayer && <Legend data={activeLayer.legend} />}

    </Polygon>))}
    </>
    
  );
}
