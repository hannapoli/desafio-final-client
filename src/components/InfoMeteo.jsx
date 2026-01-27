import React from 'react'

export const InfoMeteo = ({p, infoMeteo}) => {
  return (
    <div>
            <p>Temperatura: {infoMeteo.temperature} </p>
            <p>Humedad Relativa: {infoMeteo.relative_humidity} </p>
            <p>Precipitación: {infoMeteo.precipitation}</p>
            <p>Nublado: {infoMeteo.cloud_cover}%</p>
            <p>Velocidad del viento: {infoMeteo.wind_speed}</p>
            <p>Dirección del viento: {infoMeteo.wind_direction}</p>
    </div>
  )
}
