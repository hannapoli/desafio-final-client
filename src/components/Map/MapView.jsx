import { MapContainer, TileLayer, Popup, Marker } from 'react-leaflet';
import { useContext, useEffect, useState } from 'react';
import DrawControl from './DrawControl';
import L from 'leaflet';
import { ClickablePolygon } from './ClickablePolygon';
import LayerSwitcherControl from './LayerSwitcherControl';
import { MapsContext } from '../../contexts/MapsContext';
import { AuthContext } from '../../contexts/AuthContext';
import { userMap } from '../../hooks/userMap';

export default function MapView({ alertas }) {
  const [polygon, setPolygon] = useState([]);
  const [currentLayer, setCurrentLayer] = useState('osm');
  const [popupPosition, setPopupPosition] = useState(null);
  const [createParcel, setCreateParcel] = useState(null);
  
  const {bboxCenter} = userMap()
  const { polygons, addParcel, addPolygon, center } = useContext(MapsContext);
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

  console.log({alertas}, `alertas`)

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
    iconAnchor: [30, 30]
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;
    const nombreparcela = form.nombreparcela.value;
    const cultivo = form.cultivo.value;

    addParcel({
      nombreparcela,
      cultivo,
      polygon,
    });

    addParcel(nombreparcela, cultivo, user.uid, polygon)
 
    setPopupPosition(null);
    
    
  };

  const alertasConCentro = alertas
  .filter(a => a.alerta_helada || a.alerta_inundacion || a.alerta_plaga || a.alerta_sequia)
  .map(a => ({
    ...a,
    centro: bboxCenter(JSON.parse(a.coordinates_parcel)) // <-- aquí parseamos
  }));
  console.log(alertas[0].coordinates_parcel)


  if (!center) return <p>Cargando mapa...</p>;

  return (
    <MapContainer center={center} zoom={15} style={{ height: '400px', width: '100%' }}>
      <TileLayer {...tileLayers[currentLayer]} />

      <DrawControl onPolygonCreated={handlePolygonCreated} />

      {popupPosition && (
        <Popup position={popupPosition}>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nombreparcela"
              placeholder="Nombre de la parcela"
              required
            />
            <input type="text" name="cultivo" placeholder="Cultivo" required />
            <button type="submit">Guardar parcela</button>
          </form>
        </Popup>
      )}
      {Array.isArray(alertas) && alertas.map(a => {
      const coordsArray = [JSON.parse(a.coordinates_parcel)]
      return (
        <Marker 
          key={a.uid_parcel} 
          position={bboxCenter(coordsArray)} 
          icon={alertIcon} 
        />
      );
    })}





      <LayerSwitcherControl setCurrentLayer={setCurrentLayer} />
      <ClickablePolygon positions={polygons} />
    </MapContainer>
    /* <pre>{JSON.stringify(polygon, null, 2)}</pre> */
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


