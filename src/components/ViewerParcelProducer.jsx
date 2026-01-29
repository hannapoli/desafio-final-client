import "aframe";
import { useState } from "react";
import "./ViewerParcelProducer.css";

/**
 * ViewerParcelProducer component.
 *
 * Visualizador 360º de parcelas agrícolas para productores.
 * Muestra una imagen panorámica usando A-Frame e incluye hotspots
 * interactivos que despliegan información contextual asociada a la imagen.
 *
 * @component
 * @param {Object} props
 * @param {string} props.imageUrl - URL de la imagen panorámica 360º
 * @param {Array<{ id: string, position: string }>} props.points - Hotspots a renderizar dentro de la escena
 * @param {Object} props.dataPhoto - Datos asociados a la imagen (cielo, suelo, cultivo)
 * @returns {JSX.Element} Visor 360º de parcela con hotspots interactivos
 */
export const ViewerParcelProducer = ({ imageUrl, points, dataPhoto }) => {
    const [activeHotspot, setActiveHotspot] = useState(null);
    // Normalizar para que nunca sea null
    const pointsToPrint = Array.isArray(points) ? points : [];

    const dataMap = {
        sky: "dataSky",
        soil: "dataSoil",
        crop: "dataCrop"
    }

/**
 * ViewerParcelProducer component.
 *
 * Visualizador 360º de parcelas agrícolas para productores.
 * Muestra una imagen panorámica usando A-Frame e incluye hotspots
 * interactivos que despliegan información contextual asociada a la imagen.
 *
 * @component
 * @param {Object} props
 * @param {string} props.imageUrl - URL de la imagen panorámica 360º
 * @param {Array<{ id: string, position: string }>} props.points - Hotspots a renderizar dentro de la escena
 * @param {Object} props.dataPhoto - Datos asociados a la imagen (cielo, suelo, cultivo)
 * @returns {JSX.Element} Visor 360º de parcela con hotspots interactivos
 */
    const handleHotspotClick = (id) => {
        const key = dataMap[id]; 
        const info = key && dataPhoto?.[key][0]; // primer objeto del array 
        console.log(dataPhoto, "DATAPHOTO <============================>");
        console.log(info, "INFO <================================>");
        
        setActiveHotspot({ id, data: info || null })
    };

    return (
        <article className="viewer-container">
            {/*Si no hay imagen*/}
            {!imageUrl && (
                <p>No hay imagen disponible para mostrar</p>
            )}

            {/*Si hay imagen*/}
            {imageUrl && (
                <>
                    <div className="viewer-box">
                        <a-scene embedded> {/*Embedded - Hace que la escena no ocupe toda la pantalla */}
                            {/* Cámara centrada */}
                            <a-entity id="camara" position="0 0 0">
                                <a-camera
                                    position="0 0 0" 
                                    look-controls="reverseMouseDrag: true"
                                ></a-camera>
                            </a-entity>

                            {/* Cursor + Raycaster */}
                            <a-entity
                                cursor="rayOrigin: mouse"
                                raycaster="objects: .hotspot"
                            ></a-entity>

                            {/* Imagen 360 */}
                            <a-sky src={imageUrl} rotation= "0 -90 0"></a-sky>

                            {/* Contenedor con los hotspots*/}
                            <a-entity>
                                {pointsToPrint?.map(({ id, position }) => (
                                    <a-image
                                        key={id}
                                        className="hotspot"
                                        src="/logo-hotspot-visor360.png"
                                        width="1.5"
                                        height="1.5"
                                        position={position}
                                        onClick={() => handleHotspotClick(id)}
                                        // onClick={() => console.log({id, data})}
                                    ></a-image>
                                ))}
                            </a-entity>

                        </a-scene>

                        {/* Popup */}
                        {activeHotspot && (
                            <div className="viewer-panel">
                                <h3>{activeHotspot.id}</h3>

                                {activeHotspot.data ? (
                                    <ul>
                                        {Object.entries(activeHotspot.data).map(([key, value]) => (
                                            <li key={key}>
                                                <strong>{key}:</strong> {String(value)}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No hay información disponible</p>
                                )}

                                <button onClick={() => setActiveHotspot(null)}>
                                    Cerrar
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </article>
    );
};

/* Position= 0 0 0 - Cámara en el centro de la esfera
look-controls="reverseMouseDrag: true" - Invierte los controles del mouse para que sea más natural 360
*/