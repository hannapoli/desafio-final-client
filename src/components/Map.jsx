import React from 'react'
import MapView from './Map/MapView'
import wellknown from 'wellknown';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';


export const Map = () => {

  return (
    <div>
        {/* <MapView geojson={geojson}/> */}
        <MapView  centroid={centroid}
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