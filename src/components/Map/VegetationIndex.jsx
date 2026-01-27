import React from 'react';
import './VegetationIndex.css';

export const VegetationIndex = ({ data }) => {
  const legends = {
    ndvi: [
      { v: 0.0,  c: "#a50026", l: "Suelo desnudo" },
      { v: 0.25, c: "#f98e52", l: "Poco vigor" },
      { v: 0.5,  c: "#feffbe", l: "Vigor medio" },
      { v: 0.75, c: "#84ca66", l: "Vigor alto" },
      { v: 1.0,  c: "#006837", l: "Muy alto vigor" }
    ],
    ndwi: [
      { v: -1.0, c: "#a50026", l: "Muy Seco" },
      { v: -0.5, c: "#f98e52", l: "Seco" },
      { v: 0.0,  c: "#feffc0", l: "Neutro" },
      { v: 0.5,  c: "#8ec2dc", l: "Húmedo" },
      { v: 1.0,  c: "#313695", l: "Agua" }
    ],
    savi: [
      { v: 0.0, c: "#a50026", l: "Bajo" },
      { v: 0.2, c: "#f98e52", l: "Medio-Bajo" },
      { v: 0.4, c: "#feffbe", l: "Medio" },
      { v: 0.6, c: "#84ca66", l: "Alto" },
      { v: 0.8, c: "#006837", l: "Muy Alto" }
    ]
  };
  legends.gndvi = legends.ndvi;

  const getInfo = (key, value) => {
    const palette = legends[key.toLowerCase()] || legends.ndvi;
    return palette.reduce((prev, curr) => (value >= curr.v ? curr : prev));
  };

  // Calcula el porcentaje para la barra (Normaliza según el rango del índice)
  const getPercentage = (key, value) => {
    if (key === 'ndwi') return ((value + 1) / 2) * 100; // Rango -1 a 1
    return Math.min(Math.max(value * 100, 0), 100);    // Rango 0 a 1
  };

  if (!data) return null;

  return (
    <div className="indices-grid">
      {Object.entries(data).map(([key, val]) => {
        const info = getInfo(key, val);
        const percentage = getPercentage(key.toLowerCase(), val);

        return (
          <div 
            key={key} 
            className="index-card" 
            style={{ borderTopColor: info.color }}
          >
            <div className="index-header">
              <span className="index-name">{key}</span>
            </div>
            
            <div className="index-value" style={{ color: info.color }}>
              {val.toFixed(3)}
            </div>

            <div className="index-status">
              {info.label}
            </div>

            <div className="progress-container">
              <div 
                className="progress-bar" 
                style={{ 
                  width: `${percentage}%`, 
                  backgroundColor: info.color 
                }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

