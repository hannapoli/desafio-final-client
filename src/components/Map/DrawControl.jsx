import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect, useState } from 'react';

export default function DrawControl({ onPolygonCreated }) {
  const map = useMap();
  

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false
      },
    //   edit: 
    //    {
    //     featureGroup: drawnItems
    //   }
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;
    //   drawnItems.addLayer(layer);

      const latlngs = layer.getLatLngs()[0];
      const coords = latlngs.map(p => [p.lat, p.lng]);//coords transforma cada LatLng en un array [lat, lng].
      onPolygonCreated(coords); 
    });

    return () => {
      map.removeControl(drawControl);
    //   map.removeLayer(drawnItems);
    };
  }, [map]);

  return null;
}
