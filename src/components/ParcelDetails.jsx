import { useContext } from 'react'
import { MapsContext } from '../contexts/MapsContext'

export const ParcelDetails = ({parcel}) => {
    const {parcels, setparcels, meteo, alerts} = useContext(MapsContext)
  return (
    <div>ParcelDetails</div>
  )
}
