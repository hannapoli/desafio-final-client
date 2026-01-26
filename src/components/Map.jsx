import React, { useContext, useEffect, useState} from 'react'
import MapView from './Map/MapView'
import wellknown from 'wellknown';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { userMap } from '../hooks/userMap';
import { MapsContext } from '../contexts/MapsContext';
import { AuthContext } from '../contexts/AuthContext';


export const Map = ({parcels}) => {
  
  const { user } = useContext(AuthContext);
  const {havePolygons} = useContext(MapsContext)
  const {getAllAlertsByUser, getAllInfoMeteoByUser, bboxCenter} = userMap()
  const [alertas, setAlertas] = useState({})
  
  useEffect(() => {
  const fetchAlerts = async () => {
    if (user?.email) {
      const data = await getAllAlertsByUser(user.email);
      setAlertas(data.data.filter(a=>a.alerta_helada || a.alerta_inundacion || a.alerta_plaga || a.alerta_sequia ));
    }
  };

  fetchAlerts();
}, [user?.email]);

console.log({alertas})


  useEffect(() => { 
    havePolygons(parcels)
  }, [parcels, havePolygons])

  return (
    <div>
        
        <MapView alertas={alertas}/>
       
    </div>
  )
}

//PARA CONVERTIR COORDENADAS DEL JSON AL GEOJSON
//   const farm = farms.user.farms["227689"]; // tu granja
// const fields = Object.values(farm.fields); // array de fields

// const geojsonFeatures = fields.map(field => {
//   const wkt = field.shapes.current.polygon;
//   const geometry = wellknown.parse(wkt);

//   return {
//     type: "Feature",
//     geometry,
//     properties: { name: field.name, id: field.id },
//   };
// });

// const geojson = {
//   type: "FeatureCollection",
//   features: geojsonFeatures,
// };