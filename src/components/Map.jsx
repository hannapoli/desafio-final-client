import React, { useContext, useEffect} from 'react'
import MapView from './Map/MapView'
import wellknown from 'wellknown';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { userMap } from '../hooks/userMap';
import { MapsContext } from '../contexts/MapsContext';


export const Map = ({parcels}) => {
  console.log({parcels}, 'desde map')

  const {havePolygons} = useContext(MapsContext)
  

 
  useEffect(() => { 
    havePolygons(parcels)
  }, [parcels, havePolygons])

  return (
    <div>
        
        <MapView/>
       
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