import React, { useContext, useEffect, useState} from 'react'
import MapView from './Map/MapView'
import wellknown from 'wellknown';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { userMap } from '../hooks/userMap';
import { MapsContext } from '../contexts/MapsContext';
import { AuthContext } from '../contexts/AuthContext';


/**
 * Map component.
 *
 * Componente contenedor del sistema de mapas.
 * Se encarga de:
 * - Inicializar las parcelas en el contexto global
 * - Obtener y filtrar alertas asociadas al usuario autenticado
 * - Pasar la información necesaria al componente MapView
 *
 * Este componente actúa como puente entre la autenticación,
 * la lógica de negocio del mapa y la visualización.
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.parcels - Listado de parcelas del usuario
 * @returns {JSX.Element} Vista principal del mapa
 */
export const Map = ({parcels}) => {
  
  const { user } = useContext(AuthContext);
  const {havePolygons, setParcels} = useContext(MapsContext)
  const {getAllAlertsByUser, getAllInfoMeteoByUser, bboxCenter} = userMap()
  const [alertas, setAlertas] = useState({})
  
  /**
   * Obtiene las alertas del usuario autenticado y
   * filtra únicamente las alertas relevantes.
   */
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

  /**
   * Inicializa las parcelas en el contexto global
   * y genera los polígonos correspondientes.
   */
  useEffect(() => { 
    havePolygons(parcels)
    setParcels(parcels)
  }, [setParcels, havePolygons])

  return (
    
        
        <MapView alertas={alertas}/>
        
       
    
  )
}

