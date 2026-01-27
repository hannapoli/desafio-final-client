import { useContext, useEffect } from 'react'
import { MapsContext } from '../contexts/MapsContext'
import { userMap } from '../hooks/userMap'
import { InfoMeteo } from './InfoMeteo'

export const ParcelDetails = () => {
    const {parcel, setparcels, meteo, alert, setAlert, infoMeteo, vegetation, setVegetation, crop, setCrop} = useContext(MapsContext)
    const {getAlertByParcel, getParcelCrops, getParcelVegetation} = userMap()

    useEffect(() => {
        const getDatos = async () => {

            const alerta = await getAlertByParcel(parcel.uid_parcel)
            setAlert(alerta)

            const vegetacion = await getParcelVegetation(parcel.uid_parcel)
            // console.log({vegetacion})
            setVegetation(vegetacion)

            const cultivo = await getParcelCrops(parcel.uid_parcel)
            // console.log({cultivo})
            setCrop(cultivo)

        }
        getDatos()
    }, [parcel])

 
    
  return (
    <section>
      <h2>{parcel.name_parcel}</h2>
      <article >
          <hr />
          {crop && (<p> Producto: {crop.nombre_cultivo}</p>)}
          {crop && (<p> Variedad: {crop.nombre_variedad}</p>)}
          
          {/* <p>📅 Fecha: {new Date(parcel.fecha).toLocaleDateString()}</p> */}
          <p>👤 productor: {parcel.name_user}</p>
          {alert.alerta_plaga && <p className='alert'>⚠️ Alerta de plagas: {alert.alerta_plaga}</p>}
          {alert.alerta_inundacion && <p className='alert'>⚠️ Alerta de inundación: {alert.alerta_inundacion}</p>}
          {alert.alerta_helada && <p className='alert'>⚠️ Alerta de helada: {alert.alerta_helada}</p>}
          {alert.alerta_sequia && <p className='alert'>⚠️ Alerta_ de sequía: {alert.alerta_sequia}</p>} 
      </article>

      <article>
        <h3>Información meteorologica</h3>
        {infoMeteo && (
                <InfoMeteo p={parcel} infoMeteo={infoMeteo} />
              )}
      </article>
    </section>
  )
}
