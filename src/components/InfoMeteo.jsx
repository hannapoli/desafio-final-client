import React from 'react';


export const InfoMeteo = ({ p, infoMeteo }) => {
  if (!infoMeteo) return null;

  return (
    <div className="meteo-info">
      <p className="meteo-temp">Temperatura: {infoMeteo.temperature} °C</p>
      <p className="meteo-humidity">Humedad Relativa: {infoMeteo.relative_humidity} %</p>
      <p className="meteo-precipitation">Precipitación: {infoMeteo.precipitation} mm</p>
      <p className="meteo-clouds">Nublado: {infoMeteo.cloud_cover} %</p>
      <p className="meteo-wind-speed">Velocidad del viento: {infoMeteo.wind_speed} km/h</p>
      <p className="meteo-wind-dir">Dirección del viento: {infoMeteo.wind_direction}</p>
    </div>
  );
};
