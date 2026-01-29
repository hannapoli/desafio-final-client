import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

export const FitAllPolygons = ({ polygons }) => {
  const map = useMap();

  useEffect(() => {
    if (!polygons || polygons.length === 0) return;

    const bounds = L.latLngBounds(polygons); // crea un bounding box

    map.fitBounds(bounds, {
      padding: [5, 5], 
      maxZoom: 18,       
      animate: true
    });
  }, [polygons, map]);

  return null;
};
