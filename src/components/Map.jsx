import React, { useContext, useEffect} from 'react'
import MapView from './Map/MapView'
import wellknown from 'wellknown';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { userMap } from '../hooks/userMap';
import { MapsContext } from '../contexts/MapsContext';


export const Map = () => {

   const {simulacionLlamadaBack} = userMap()
  const {havePolygons} = useContext(MapsContext)
   

  useEffect(() => {
        const respuesta = simulacionLlamadaBack()
        // Parsear y validar polígonos, asegurando formato [lat, lng]
        havePolygons(respuesta)
    }, [])


  return (
    <div>
        {/* <MapView geojson={geojson}/> */}
        <MapView 
        //  bboxPolygon={bboxPolygon}
         />
       
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