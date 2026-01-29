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
import '../Map.css'
import { MapClickHandler } from './MapClickHandler';
import { FitAllPolygons } from './FitAllPolygons';

/**
 * MapView component.
 *
 * Componente principal de visualización del mapa.
 * Permite mostrar parcelas agrícolas, alertas, cambiar capas base,
 * dibujar nuevos polígonos y gestionar la selección de parcelas.
 *
 * Utiliza React Leaflet junto con varios controles personalizados
 * y estado global proporcionado por MapsContext y AuthContext.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.alertas - Listado de alertas asociadas a parcelas
 * @returns {JSX.Element} Vista interactiva del mapa
 */
export default function MapView({ alertas }) {
  const [polygon, setPolygon] = useState([]);
  const [currentLayer, setCurrentLayer] = useState('osm');
  const [popupPosition, setPopupPosition] = useState(null);
  // const [createParcel, setCreateParcel] = useState(null);
  const [unmark, setUnmark] = useState(null)
  
  const {bboxCenter, addParcelApi, createParcel} = userMap()
  const { polygons, addParcel, addPolygon, center, setCenter, setParcel, setSelectedParcelId, setInfoMeteo } = useContext(MapsContext);
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

  


  useEffect(()=> {
    setCenter(bboxCenter(polygons))
  
  }, [polygons])
  // console.log({alertas}, `alertas`)

  const cornIcon = L.divIcon({
    html: '🌽',
    className: 'corn-marker',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
  });
    
  const handleClickOutside = () => {
    setParcel(null);
    setSelectedParcelId(null);
    setInfoMeteo(null);
    // setPopupPosition(null)
  };


  const alertIcon = L.divIcon({
  html: '⚠️',
  className: 'alert-marker',
  iconSize: [40, 40],
  iconAnchor: [20, 20] // centrado
});
  
  /**
   * Maneja la creación de un nuevo polígono mediante DrawControl.
   *
   * Calcula el centro del polígono para posicionar el popup
   * de creación de parcela.
   *
   * @function
   * @param {Array<Array<number>>} coords - Coordenadas del polígono creado
   * @returns {void}
   */
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

  // useEffect(() => {
  //   if (polygon.length !== 0) {
  //     addPolygon(polygon);
  //     // bboxCenter([polygon]);
  //   }
  // }, [polygon]);


  if (!center) return <p>Cargando mapa...</p>;

  return (
    
<div>
    <MapContainer center={center} zoom={15} id='mapBoard'>
      <TileLayer {...tileLayers[currentLayer]} />

      {/* <MapClickHandler onClickOutside={handleClickOutside} /> */}
      

      <DrawControl onPolygonCreated={handlePolygonCreated} />

      
        {popupPosition && (
          <Popup className="popup-add-parcel"
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
                  
        <Marker 
          key={a.uid_parcel} 
          position={bboxCenter([coords])} 
          icon={alertIcon}
          // eventHandlers={{
          //   click: () => handleAlerta(a)
          // }}
        >
          
        </Marker>
      ); })}
    
    

      <LayerSwitcherControl setCurrentLayer={setCurrentLayer} />
      {/* <ClickablePolygon positions={polygons} onClick={() => setUnmark(alert.uid_parcel)} /> */}
      <ClickablePolygon alertas={alertas}  />
      <FitAllPolygons polygons={polygons} />
    </MapContainer>
     {/* <pre>{JSON.stringify(polygon, null, 2)}</pre>  */}
     </div>
  );
}
