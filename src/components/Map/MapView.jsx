import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, useMapEvents, ImageOverlay } from 'react-leaflet';
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

const json= {
  "id": "Field_1_2",
  "date": "2026-01-17",
  "type": "NDVI",
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [-72.60537242850114, -37.216194509829975],
        [-72.60463428471121, -37.2192156098624],
        [-72.60284900612896, -37.220596252953385],
        [-72.59610271480051, -37.220596252953385],
        [-72.59459209415944, -37.2187918426762],
        [-72.60537242850114, -37.216194509829975]
      ]
    ]
  },
  "image_bounds": [
    [-37.220596252953385, -72.60537242850114],
    [-37.216194509829975, -72.59459209415944]
  ],
  "image_data": "data:image/png;base64,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",
  "legend": {
    "title": "\u00cdndice NDVI",
    "min": 0.0,
    "max": 1.0,
    "palette": [
      {
        "value": 0.0,
        "color": "#a50026",
        "label": "Suelo desnudo/Muerto"
      },
      {
        "value": 0.25,
        "color": "#f98e52",
        "label": "Poco vigor"
      },
      {
        "value": 0.5,
        "color": "#feffbe",
        "label": "Vigor medio"
      },
      {
        "value": 0.75,
        "color": "#84ca66",
        "label": "Vigor alto"
      },
      {
        "value": 1.0,
        "color": "#006837",
        "label": "Muy alto vigor"
      }
    ]
  }
}

const ndviData = {
  "image_data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF8AAAAzCAY...", // (tu base64 largo)
  "image_bounds": [
    [-37.220596252953385, -72.60537242850114], // Esquina inferior izquierda (Southwest)
    [-37.216194509829975, -72.59459209415944]  // Esquina superior derecha (Northeast)
  ]
};

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
     if(polygon.length != 0) {
      addParcel(polygon)
      bboxCenter(polygons)
     }
    }, [polygon])

    // -------------------------------OVER LAY PRUEBA ---------------------
    
  // const imageGeoJson = "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"
  //   var imageUrl = 'data: image/png; base64,' + imageGeoJson
//    const centroOverLay = [
//   [-37.217, -72.606], // southwest
//   [-37.215, -72.605]  // northeast
// ];
// const delta = 0.005; // tamaño del overlay
// const centroOverLay = [
//   [center[0] - delta, center[1] - delta], // southwest
//   [center[0] + delta, center[1] + delta]  // northeast
// ];
// const centroOverLay = [
//   [-37.220596252953385, -72.60537242850114], // southwest
//   [-37.216194509829975, -72.59459209415944]  // northeast
// ];

// 2. Definimos la URL de la imagen y los límites
  // const imageUrl = json.image_data;
  // const imageBounds = json.image_bounds;

// var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
// var altText = 'Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection.';
// var latLngBounds = L.latLngBounds([[40.799311, -74.118464], [40.68202047785919, -74.33]]);

// var imageOverlay = L.imageOverlay(imageUrl, centroOverLay)



  return (
    <>
    {!center && <p>Cargando mapa...</p>}
      {center &&
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: '400px', width: '100%' }}
      >
        
        <TileLayer {...tileLayers[currentLayer]}        />
        
        <DrawControl onPolygonCreated={setPolygon} />
        <MapClickPopup/> 
        
       
        
        <LayerSwitcherControl setCurrentLayer={setCurrentLayer} />
        {/* <ImageOverlay
          url={imageUrl}
          bounds={imageBounds}
          opacity={0.8}
          // errorOverlayUrl={errorOverlayUrl}
          // alt={altText}
          interactive
        /> */}
        <Polygon 
            positions={json.geometry.coordinates[0].map(coord => [coord[1], coord[0]])} 
            pathOptions={{ color: 'black', fillOpacity: 0, weight: 1 }}
          />
<ClickablePolygon positions={polygons} />

      </MapContainer>
}

      {/* <pre>{JSON.stringify(polygon, null, 2)}</pre> */}

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