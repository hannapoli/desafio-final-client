import { useEffect, useState } from 'react';
import { MapsContext} from './MapsContext'


export const MapsProvider = ({ children }) => {
    const [polygons, setPolygons] = useState([])
    const [center, setCenter] = useState([-72.60537, -37.21619])

    useEffect(() => {
        // Simulación de respuesta
        const respuesta = {
            ok: true,
            msg: "TODO OK",
            data: [
                {
                    uid_parcel: "parcel002",
                    uid_producer: "0ZodTLyMMaQ49pecJsthqPzfdh03",
                    name_parcel: "Parcela A",
                    product_parcel: "Maíz",
                    // Formato correcto: [[lat, lng], ...]
                    coordinates_parcel: "[[-37.21619, -72.60537], [-37.22059, -72.60284], [-37.22059, -72.59610], [-37.21879, -72.59459], [-37.21619, -72.60537]]"
                }
            ]
        };
        // Parsear y validar polígonos, asegurando formato [lat, lng]
        setPolygons(
            respuesta.data
                .map(parcel => {
                    try {
                        const coords = JSON.parse(parcel.coordinates_parcel);
                        // Validar que sea array de arrays y no contenga null
                        if (Array.isArray(coords) && coords.every(pair => Array.isArray(pair) && pair.length === 2 && pair.every(Number.isFinite))) {
                            return coords;
                        }
                    } catch {
                        return null;
                    }
                    return null;
                })
                .filter(Boolean)
        );
    }, [])

    const addParcel = (polygono) => {
        setPolygons([...polygons, polygono])
    }

    const deleteParcel = (polygono) => {
        setPolygons(prev => //prev es la versión már reciente del estado
            prev.filter(pol => pol !== polygono))
        if(polygons.length) bboxCenter()
    }

    const bboxCenter = (polygons) =>{
          

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
            <MapsContext.Provider value={{polygons, addParcel, deleteParcel, bboxCenter, center}}>
                {children}
            </MapsContext.Provider>
        )
    }