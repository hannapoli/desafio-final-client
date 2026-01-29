

import React, { useContext, useMemo } from 'react';
import './VegetationIndex.css';

export const VegetationIndex = ({ vegetation }) => {
  

  const legends = {
    ndvi: [
      { v: 0.0,  color: "#a50026", label: "Suelo desnudo" },
      { v: 0.25, color: "#f98e52", label: "Poco vigor" },
      { v: 0.5,  color: "#feffbe", label: "Vigor medio" },
      { v: 0.75, color: "#84ca66", label: "Vigor alto" },
      { v: 1.0,  color: "#006837", label: "Muy alto vigor" }
    ],
    ndwi: [
      { v: -1.0, color: "#a50026", label: "Muy seco" },
      { v: -0.5, color: "#f98e52", label: "Seco" },
      { v: 0.0,  color: "#feffc0", label: "Neutro" },
      { v: 0.5,  color: "#8ec2dc", label: "Húmedo" },
      { v: 1.0,  color: "#313695", label: "Agua" }
    ],
    savi: [
      { v: 0.0, color: "#a50026", label: "Bajo" },
      { v: 0.2, color: "#f98e52", label: "Medio-bajo" },
      { v: 0.4, color: "#feffbe", label: "Medio" },
      { v: 0.6, color: "#84ca66", label: "Alto" },
      { v: 0.8, color: "#006837", label: "Muy alto" }
    ]
  };

  legends.gndvi = legends.ndvi;

  const INDEX_KEYS = [
    { key: 'ndvi',  desc: 'Vigor y densidad de la vegetación verde' },
    { key: 'gndvi', desc: 'Clorofila y actividad fotosintética temprana' },
    { key: 'ndwi',  desc: 'Contenido hídrico de vegetación o suelo' },
    { key: 'savi',  desc: 'Vigor vegetal corrigiendo influencia del suelo' }
  ];

  const getInfo = (key, value) => {
    const palette = legends[key] || legends.ndvi;
    return palette.reduce((prev, curr) =>
      value >= curr.v ? curr : prev
    );
  };

  const getPercentage = (key, value) => {
    if (key === 'ndwi') return ((value + 1) / 2) * 100;
    return Math.min(Math.max(value * 100, 0), 100);
  };

  const cards = useMemo(() => { //parecido al useEffect pero para calcular cosas
    if (!vegetation) return [];

    return INDEX_KEYS.map(({ key, desc }) => {
      const val = Number(vegetation[key]);
      if (Number.isNaN(val)) return null;

      const info = getInfo(key, val);
      const percentage = getPercentage(key, val);

      return {
        key,
        desc,
        val,
        info,
        percentage
      };
    }).filter(Boolean);
  }, [vegetation]);

  if (!cards.length) return null;

  return (
    <div className="indices-grid">
      {cards.map(({ key, desc, val, info, percentage }) => (
        <div
          key={key}
          className="index-card"
          style={{ borderTopColor: info.color }}
        >
          <div className="index-header">
            <span className="index-name">{key.toUpperCase()}</span>
            <hr />
            <p className="index-desc">{desc}</p>
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
            />
          </div>
        </div>
      ))}
    </div>
  );
};
