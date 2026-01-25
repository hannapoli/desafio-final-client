import "aframe";
import { useState } from "react";
import "./ViewerParcelProducer.css";

export const ViewerParcelProducer = ({ imageUrl, points }) => {
    const [activeHotspot, setActiveHotspot] = useState(null);
    // Normalizar para que nunca sea null
    const pointsToPrint = Array.isArray(points) ? points : [];

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
                            <a-sky src={imageUrl}></a-sky>

                            {/* Contenedor con los hotspots*/}
                            <a-entity>
                                {pointsToPrint?.map(({ id, position }) => (
                                    <a-image
                                        key={id}
                                        data-id={id}
                                        className="hotspot"
                                        src="/logo.png"
                                        width="1.5"
                                        height="1.5"
                                        position={position}
                                        onClick={() => setActiveHotspot(id)}
                                    ></a-image>
                                ))}
                            </a-entity>

                        </a-scene>

                        {/* Popup */}
                        {activeHotspot && (
                            <div className="viewer-panel">
                                <h3>{activeHotspot}</h3>
                                <p>Pendiente recibir información</p>
                                <button onClick={() => setActiveHotspot(null)}>Cerrar</button>
                            </div>
                        )}
                    </div>

                    {/*Si hay imagen pero no hay puntos */}
                    {imageUrl && pointsToPrint.length === 0 && (
                        <p>No se detectaron hotspots en la imagen</p>
                    )}
                </>
            )}
        </article>
    );
};

/* Position= 0 0 0 - Cámara en el centro de la esfera
look-controls="reverseMouseDrag: true" - Invierte los controles del mouse para que sea más natural 360
*/