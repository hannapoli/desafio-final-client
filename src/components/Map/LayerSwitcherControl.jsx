
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "./LayerSwitcherControl.css";

export default function LayerSwitcherControl({ setCurrentLayer }) {
  const map = useMap();
  const controlRef = useRef(null);

  useEffect(() => {
    if (!controlRef.current) return;

    const Control = L.Control.extend({
      options: { position: "topright" },
      onAdd: () => controlRef.current
    });

    const controlInstance = new Control();
    map.addControl(controlInstance);

    return () => {
      map.removeControl(controlInstance);
    };
  }, [map]);

  const layers = [
    { name: "OSM", key: "osm" },
    { name: "Carto Light", key: "cartoLight" },
    { name: "Carto Dark", key: "cartoDark" },
    { name: "Topo", key: "topo" }
  ];

  return (
    <div
      ref={controlRef}
      className="layer-switcher leaflet-bar leaflet-control"
      onClick={(e) => e.stopPropagation()}
    >
      {layers.map(layer => (
        <button
          key={layer.key}
          className="layer-switcher__button"
          onClick={() => setCurrentLayer(layer.key)}
        >
          {layer.name}
        </button>
      ))}
    </div>
  );
}
