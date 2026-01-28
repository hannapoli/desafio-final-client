import React, { useContext, useEffect, useState} from 'react'
import MapView from './Map/MapView'
import wellknown from 'wellknown';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { userMap } from '../hooks/userMap';
import { MapsContext } from '../contexts/MapsContext';
import { AuthContext } from '../contexts/AuthContext';


export const Map = ({parcels}) => {
  
  const { user } = useContext(AuthContext);
  const {havePolygons, setParcels} = useContext(MapsContext)
  const {getAllAlertsByUser, getAllInfoMeteoByUser, bboxCenter} = userMap()
  const [alertas, setAlertas] = useState({})
  
  useEffect(() => {
  const fetchAlerts = async () => {
    if (user?.email) {
      const data = await getAllAlertsByUser(user.email);
      setAlertas(data.data.filter(a=>a.alerta_helada || a.alerta_inundacion || a.alerta_plaga || a.alerta_sequia ));
    }
  };

  fetchAlerts();
}, [user?.email]);

// console.log({alertas})


  useEffect(() => { 
    havePolygons(parcels)
    setParcels(parcels)
  }, [setParcels, havePolygons])

  return (
    
        
        <MapView alertas={alertas}/>
        
       
    
  )
}

