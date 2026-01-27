import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import { useContext, useEffect, useState } from 'react';
import DrawControl from './DrawControl';
import L from 'leaflet';
import { ClickablePolygon } from './ClickablePolygon';
import LayerSwitcherControl from './LayerSwitcherControl';
import { MapsContext } from '../../contexts/MapsContext';
import { AuthContext } from '../../contexts/AuthContext';
import { userMap } from '../../hooks/userMap';
import { AddParcel } from '../AddParcel';

export default function MapView({ alertas }) {
  const [polygon, setPolygon] = useState([]);
  const [currentLayer, setCurrentLayer] = useState('osm');
  const [popupPosition, setPopupPosition] = useState(null);
  // const [createParcel, setCreateParcel] = useState(null);
  const [unmark, setUnmark] = useState(null)
  
  const {bboxCenter, addParcelApi, createParcel} = userMap()
  const { polygons, addParcel, addPolygon, center, alert, setAlert, parcel } = useContext(MapsContext);
  const {user} = useContext(AuthContext)

  
  const tileLayers = {
    osm: {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
      maxZoom: 19,
    },
    cartoLight: {
      url: 'https://basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/">OSM</a>',
      maxZoom: 20,
    },
    cartoDark: {
      url: 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; <a href="https://www.carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    },
    topo: {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/">OSM</a>, <a href="https://opentopomap.org/">OpenTopoMap</a>',
      subdomains: 'abc',
      maxZoom: 17,
    },
  };

  // console.log({alertas}, `alertas`)

  const cornIcon = L.divIcon({
    html: '🌽',
    className: 'corn-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
    


  const alertIcon = L.divIcon({
  html: '⚠️',
  className: 'alert-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20] // centrado
});
  
  const handlePolygonCreated = (coords) => {
    if (!coords || coords.length === 0) return;

    setPolygon(coords);

    // Calcular el centro del polígono para el popup
    const center = coords.reduce(
      (acc, [lat, lng]) => [acc[0] + lat, acc[1] + lng],
      [0, 0]
    ).map((c) => c / coords.length);

    setPopupPosition(center);
  };

  useEffect(() => {
    if (polygon.length !== 0) {
      addPolygon(polygon);
      // bboxCenter([polygon]);
    }
  }, [polygon]);

  const handleAlerta = (a) => {
    // console.log('alerta', e.target)
    setAlert(a)}
    

  
  // console.log({unmark})
  if (!center) return <p>Cargando mapa...</p>;

  return (
    
<div>
    <MapContainer center={center} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer {...tileLayers[currentLayer]} />

      <DrawControl onPolygonCreated={handlePolygonCreated} />

      
      {popupPosition && (
        <Popup 
          key={polygon.length}
          autoClose={false}
          position={popupPosition}
          closeOnClick={false}
          closeButton={true}
        >
          <AddParcel polygon={polygon}/>
        </Popup>
      )}
      

      {Array.isArray(alertas) && alertas.map(a => {
        const coords = typeof a.coordinates_parcel === 'string' 
              ? JSON.parse(a.coordinates_parcel) 
              : a.coordinates_parcel;
                return (
                  
        <Marker onClick={handleAlerta(a)}
          key={a.uid_parcel} 
          position={bboxCenter([coords])} 
          icon={alertIcon} 
        >
          
        </Marker>
      ); })}
      {/* {Array.isArray(alertas) && alertas.map(a => {
        const coords = typeof a.coordinates_parcel === 'string'
          ? JSON.parse(a.coordinates_parcel)
          : a.coordinates_parcel;

        if (unmark === a.uid_parcel) return null;

        return (
          
          <Marker
            key={a.uid_parcel}
            position={bboxCenter([coords])}
            icon={alertIcon}
            eventHandlers={{
              click: () => handleAlerta(a),
            }}
          />
        );
      })} */}

      
    

      <LayerSwitcherControl setCurrentLayer={setCurrentLayer} />
      {/* 
      <ClickablePolygon positions={polygons} onClick={() => setUnmark(alert.uid_parcel)} /> */}
      <ClickablePolygon positions={polygons}  />
    </MapContainer>
     {/* <pre>{JSON.stringify(polygon, null, 2)}</pre>  */}
     </div>
  );
}

// // ¿Qué es un TileLayer?
// // Un TileLayer es una capa de imágenes en mosaico (tiles) que:
// // Vienen de un servidor de mapas (OpenStreetMap, Google, etc.)
// // Se descargan dinámicamente
// // Se organizan por niveles de zoom

// // Las llaves:
// // {z} → nivel de zoom
// // {x} {y} → coordenadas del tile


/* <Popup>
            <div style={{ minWidth: '150px' }}>
              <h3 style={{ margin: '0 0 5px 0' }}>{a.name_parcel}</h3>
              <hr />
              <p><strong>📦 Producto:</strong> {a.product_parcel}</p>
              <p><strong>📅 Fecha:</strong> {new Date(a.fecha).toLocaleDateString()}</p>
              <p><strong>👤 productor:</strong> {a.name_user}</p>
              {a.alerta_plaga && <p><strong>⚠️ Alerta de plagas:</strong> {a.alerta_plaga}</p>}
              {a.alerta_inundacion && <p><strong>⚠️ Alerta de inundación:</strong> {a.alerta_inundacion}</p>}
              {a.alerta_helada && <p><strong>⚠️ Alerta de helada:</strong> {a.alerta_helada}</p>}
              {a.alerta_sequia && <p><strong>⚠️ Alerta_ de sequía:</strong> {a.alerta_sequia}</p>}
              
              {/* Si quieres un botón para ejecutar alguna acción adicional */
          //     {/* <button onClick={() => console.log("Detalles de:", a.uid_parcel)}>
          //       Ver más detalles
          //     </button> */}
          //   </div>
          // </Popup> */