import { useContext, useState } from 'react';
import { Polygon, useMap, Popup, GeoJSON } from 'react-leaflet';
import { MapsContext } from '../../contexts/MapsContext'
import geojson from '../../data/geo.json'

export const  ClickablePolygon = ({ positions })  => {
  const {deleteParcel} = useContext(MapsContext)
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [overlayFeature, setOverlayFeature] = useState(null);
  



  const map = useMap();

  const zoomToFeature = (e) => {
    const bounds = e.target.getBounds();
    map.fitBounds(bounds, {
      padding: [5, 5],
      maxZoom: 25,
      animate: true,
    });
  };
function overLay(p) {
  if (!p?.properties?.finca) return; 

  // Filtramos las features que tengan la misma finca
  const featuresOfPolygon = geojson.features.filter(f => 
    f?.properties?.finca === p.properties.finca && f.geometry
  );

  if (featuresOfPolygon.length === 0) {
    console.warn("No se encontraron features para este polígono");
    return;
  }

  // Tomamos la fecha más reciente
  const latestFeature = featuresOfPolygon.reduce((latest, current) => {
    return new Date(current.properties.fecha_img) > new Date(latest.properties.fecha_img)
      ? current
      : latest;
  });

  // Dibujar overlay
  // ejemplo: añadir un GeoJSON encima del mapa
  setOverlayData({
    type: "FeatureCollection",
    features: [latestFeature]
  });

  console.log("Overlay listo:", latestFeature);
}


  return (
    <>
     {positions.map(p => (
      <Polygon
        positions={p}
        eventHandlers={{ //no se puede utilizar onClick con react-leaflet
          click: zoomToFeature,
        }}
      >
      <Popup>
        <button onClick={()=>deleteParcel(p)}>Eliminar</button>
        <button onClick={()=>overLay(p)}>Detalles</button>
      </Popup>

      {overlayFeature && (
  <GeoJSON
    data={overlayFeature}
    style={() => ({
      color: "red",       // color destacado
      weight: 3,
      fillOpacity: 0.3
    })}
    onEachFeature={(feature, layer) => {
      layer.bindPopup(`
        <b>Finca:</b> ${feature.properties.Finca}<br/>
        <b>Fecha más reciente:</b> ${feature.properties.Fecha}<br/>
        <b>NDVI:</b> ${feature.properties.NDVI_Mean.toFixed(2)}
      `);
    }}
  />
)}

    </Polygon>))}
    </>
    
  );
}
