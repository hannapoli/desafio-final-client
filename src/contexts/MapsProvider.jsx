import { useCallback, useEffect, useState } from 'react';
import { MapsContext} from './MapsContext'

export const MapsProvider = ({ children }) => {
    const [polygons, setPolygons] = useState([])
    const [center, setCenter] = useState([-37.21619, -72.60537 ])
    const [geoPng, setGeoPng] = useState('')
    const [alerts, setAlerts] = useState([])
    const [meteo, setMeteo] = useState([])
    const [parcels, setParcels] = useState([])

  const havePolygons = useCallback((respuesta) => {
    if (!respuesta || !respuesta.length) return;

    const parsed = respuesta
      .map(parcel => {
        try {
          const coords =
            typeof parcel.coordinates_parcel === 'string'
              ? JSON.parse(parcel.coordinates_parcel)
              : parcel.coordinates_parcel;

          const isValid =
            Array.isArray(coords) &&
            coords.every(
              p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite)
            );

          return isValid ? coords : null;
        } catch (e) {
          console.log('Error parseando parcela', parcel.id, e);
          return null;
        }
      })
      .filter(Boolean);

    setPolygons(parsed); // 🚀 Ya no hay confusión, solo actualiza el estado
  }, []);

//     const havePolygons = (respuesta) => {
//     console.log({respuesta}, 'desde haveopolygons provider')
//     setPolygons(respuesta
//         .map(parcel => {
//             try {
//                 const coords = typeof parcel.coordinates_parcel === 'string' 
//                     ? JSON.parse(parcel.coordinates_parcel) 
//                     : parcel.coordinates_parcel;

              
//                 const isValid = Array.isArray(coords) && 
//                     coords.every(p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite));

//                 if (!isValid) return null;

                
//                 return coords; 
//             } catch (error) {
//                 console.log("Error parseando parcela:", parcel.id, error);
//                 return null;
//             }
//         })
//         .filter(Boolean) // Elimina los null
// )
// console.log({polygons})
// }

    const addPolygon = (polygono) => {
        setPolygons([...polygons, polygono])
    }

    const addParcel = (parcela) => {
        setParcels([...parcels, parcela])
    }

    const deleteParcel = (parcel) => {
      setParcels(prev =>
        prev.filter(par => par !== parcel)
      )
        setPolygons(prev => //prev es la versión már reciente del estado
            prev.filter(pol => pol !== parcel.coordinates_parcel))
        if(polygons.length) bboxCenter()
    }

    
    const bboxCenter = (polygons) =>{
          
       if (polygons.length=== 0) return
        let minLat = Infinity, maxLat = -Infinity;
        let minLng = Infinity, maxLng = -Infinity;

        polygons.forEach(polygon => {
            polygon.forEach(([lat, lng]) => {
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
            });
        });
        const centro = [
            (minLat + maxLat) / 2,
            (minLng + maxLng) / 2   
        ];
         setCenter(centro)
    }
    
    const getAlerts = (response) => {
      setAlerts(response.data)
    }

    const getMeteo = (response) => {
      setAlerts(response.data)
    }

    




     return (
            <MapsContext.Provider value={{
                                            polygons, 
                                            setPolygons,
                                            addParcel, 
                                            deleteParcel, 
                                            bboxCenter, 
                                            center, 
                                            geoPng, 
                                            havePolygons,
                                            alerts,
                                            meteo,
                                            parcels,
                                            setParcels,
                                            addPolygon, 
                                            getAlerts,
                                            getMeteo
                                        }}>
                {children}
            </MapsContext.Provider>
        )
    }