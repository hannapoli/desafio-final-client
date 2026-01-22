import { useEffect, useState } from 'react';
import { MapsContext} from './MapsContext'


export const MapsProvider = ({ children }) => {
    const [polygons, setPolygons] = useState([])
    const [center, setCenter] = useState([-37.21619, -72.60537 ])
    const [geoPng, setGeoPng] = useState('')


    const havePolygons = (respuesta) => {
    //     setPolygons(
    //         respuesta.data
    //             .map(parcel => {
    //                 try {
    //                     const coords = JSON.parse(parcel.coordinates_parcel);
    //                     // Validar que sea array de arrays y no contenga null
    //                     if (Array.isArray(coords) && coords.every(pair => Array.isArray(pair) && pair.length === 2 && pair.every(Number.isFinite))) {
    //                         return coords;
    //                     }
    //                 } catch {
    //                     return null;
    //                 }
    //                 return null;
    //             })
    //             .filter(Boolean)
    //     )
    // }
    setPolygons(respuesta.data
        .map(parcel => {
            try {
                const coords = typeof parcel.coordinates_parcel === 'string' 
                    ? JSON.parse(parcel.coordinates_parcel) 
                    : parcel.coordinates_parcel;

                // Validación robusta
                const isValid = Array.isArray(coords) && 
                    coords.every(p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite));

                if (!isValid) return null;

                // IMPORTANTE: Si tu API viene en [Lng, Lat], inviértelos para Leaflet:
                // return coords.map(([lng, lat]) => [lat, lng]);
                
                return coords; 
            } catch (e) {
                console.error("Error parseando parcela:", parcel.id, e);
                return null;
            }
        })
        .filter(Boolean) // Elimina los null
)}

    const addParcel = (polygono) => {
        setPolygons([...polygons, polygono])
    }

    const deleteParcel = (polygono) => {
        setPolygons(prev => //prev es la versión már reciente del estado
            prev.filter(pol => pol !== polygono))
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



     return (
            <MapsContext.Provider value={{polygons, addParcel, deleteParcel, bboxCenter, center, geoPng, havePolygons}}>
                {children}
            </MapsContext.Provider>
        )
    }