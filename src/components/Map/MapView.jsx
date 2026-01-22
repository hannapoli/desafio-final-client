import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMapEvents } from 'react-leaflet';
import { useContext, useEffect, useState } from 'react';
import DrawControl from './DrawControl';
import {ClickablePolygon} from './ClickablePolygon'
import L from 'leaflet';
import LayerSwitcherControl from './LayerSwitcherControl';
// L es el namespace global de Leaflet.
// Ahí dentro están todas sus funciones:
// L.map() → crear un mapa
// L.tileLayer() → capa base
// L.geoJSON() → cargar GeoJSON
// L.marker() → puntos
// L.polygon() → polígonos
// L.popup() → popups
import {MapsContext} from '../../contexts/MapsContext'


export default function MapView({ centroid} ) {
  
  const [polygon, setPolygon] = useState([]);
  const [currentLayer, setCurrentLayer] = useState("osm")
  const {polygons, addParcel, bboxCenter, center} = useContext(MapsContext)


    const tileLayers = {
    osm: {
      url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 19
    },
    cartoLight: {
      url: "https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/">OSM</a>',
      maxZoom: 20
    },
    cartoDark: {
        url: "https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
      attribution: '&copy; <a href="https://www.carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: "abcd",
      maxZoom: 20
    },
    // stamenToner: {
    //   url: "http://tile.stamen.com/toner/{z}/{x}/{y}.png", 
    //   attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="https://www.openstreetmap.org/">OSM</a>',
    //   maxZoom: 20
    // },
    topo: {
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/">OSM</a>, <a href="https://opentopomap.org/">OpenTopoMap</a>',
    subdomains: "abc",
    maxZoom: 17
    }
    

  };


    function MapClickPopup() {
    useMapEvents({
      click(e) {
        L.popup()
          .setLatLng(e.latlng)
          .setContent(`Hiciste clic en ${e.latlng.lat}, ${e.latlng.lng}`)
          .openOn(e.target);
      },
    });
    return null;
  }


  const cornIcon = L.divIcon({
    html: '🌽',
    className: 'corn-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });

 
    useEffect(()=>{
     if(polygon) {
      addParcel(polygon)
      bboxCenter(polygons)
     }
    }, [polygon])

    console.log({polygons})


  console.log(center)

  return (
    <>
    {!center && <p>Cargando mapa...</p>}
      {center &&
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
      >
        
        <TileLayer {...tileLayers[currentLayer]}        />
        
        <DrawControl onPolygonCreated={setPolygon} />
        <MapClickPopup/> 
        
       <ClickablePolygon positions={polygons} />
        
        <LayerSwitcherControl setCurrentLayer={setCurrentLayer} />

      </MapContainer>
}

      <pre>{JSON.stringify(polygon, null, 2)}</pre>

    </>
  );
}

// ¿Qué es un TileLayer?
// Un TileLayer es una capa de imágenes en mosaico (tiles) que:
// Vienen de un servidor de mapas (OpenStreetMap, Google, etc.)
// Se descargan dinámicamente
// Se organizan por niveles de zoom

// Las llaves:
// {z} → nivel de zoom
// {x} {y} → coordenadas del tile


// // Solución al problema de iconos en React
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
//   iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
//   shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
// });
// // esto te elimina el icono del marcador que viene por defecto y te crea otro
// 

//       {/* <Circle
//         center={[51.508, -0.11]}
//         radius={500}
//         pathOptions={{ color: 'red', fillColor: '#f03', fillOpacity: 0.5 }}
//       >
//         <Popup>Soy un círculo</Popup>
//       </Circle> */}
// {/* <Marker position={centroid} icon={cornIcon} > */}
        //   {/* <Popup>
        //     <b>Hello world!</b><br />Soy un popup
        //   </Popup>
        // </Marker> */} 
        // 
        
        // <Marker position={centroid} icon={cornIcon} >
//         <Popup>
//           <b>Hello world!</b><br />Soy un popup
//         </Popup>
//       </Marker>