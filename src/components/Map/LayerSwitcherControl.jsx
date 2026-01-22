import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function LayerSwitcherControl({ setCurrentLayer }) {
  const map = useMap();

  useEffect(() => {
    const controlDiv = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");

    controlDiv.style.background = "white";
    controlDiv.style.padding = "5px";
    controlDiv.style.display = "flex";
    controlDiv.style.flexDirection = "column";

    const layers = [
      { name: "OSM", key: "osm" },
      { name: "Carto Light", key: "cartoLight" },
      { name: "Carto Dark", key: "cartoDark" },
      { name: "Topo", key: "topo" }
    ];

    layers.forEach(layer => {
      const button = L.DomUtil.create("button", "", controlDiv);
      button.innerText = layer.name;
      button.style.margin = "2px";
      button.style.cursor = "pointer";
      button.style.fontSize = "12px";

      L.DomEvent.on(button, "click", (e) => {
        e.stopPropagation();
        setCurrentLayer(layer.key);
      });
    });

    const customControl = L.Control.extend({
      options: { position: "topright" },
      onAdd: () => controlDiv
    });

    const instance = new customControl();
    map.addControl(instance);

    return () => map.removeControl(instance); // limpieza al desmontar
  }, [map, setCurrentLayer]);

  return null; // no renderiza nada en JSX
}
