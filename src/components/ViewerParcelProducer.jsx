import "aframe";
import { useEffect, useState } from "react";
import "./ViewerParcelProducer.css";

export const ViewerParcelProducer = ({ imageUrl, points, correctionDegrees = 10 }) => { // CorrectionDegrees para corregir la rotación inicial y que los puntos coincidan
    const [activeHotspot, setActiveHotspot] = useState(null);

    return (
        <article className="viewer-container">
            <div className="viewer-box">

                <a-scene embedded vr-mode-ui="enabled: false">

                    {/* Cámara centrada */}
                    <a-entity id="rig" position="0 0 0">
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

                    {/* Contenedor que rota todos los puntos */}
                    <a-entity rotation={`0 ${correctionDegrees} 0`}>
                        {points?.map(({ id, position }) => (
                            <a-image
                                key={id}
                                data-id={id}
                                class="hotspot"
                                src="/logo.png"
                                width="1.5"
                                height="1.5"
                                position={position}
                                onClick={() => setActiveHotspot(id)}
                            ></a-image>
                        ))}
                    </a-entity>

                </a-scene>

                {/* Panel lateral */}
                {activeHotspot && (
                    <div className="viewer-panel">
                        <h3>{activeHotspot}</h3>
                        <p>Información del punto detectado por IA</p>
                        <button onClick={() => setActiveHotspot(null)}>Cerrar</button>
                    </div>
                )}

            </div>
        </article>
    );
};
