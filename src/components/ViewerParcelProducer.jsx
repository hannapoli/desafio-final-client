// IMPORTACIONES DE TERCEROS
import "aframe";
import { useEffect, useState } from "react";

// IMPORTACIONES PROPIAS
import "./ViewerParcelProducer.css";
import { positionFor } from "../helpers/viewerParcelHelper";

export const ViewerParcelProducer = ({ imageUrl, points }) => {

    // Estados
    const [activeHotspot, setActiveHotspot] = useState(null);

    useEffect(() => {
        const scene = document.querySelector("a-scene");

        const handleClick = (event) => {
            const hotspot = event.target.closest(".hotspot");

            const id = hotspot.getAttribute("data-id");
            
            setActiveHotspot(id);
        };

        scene.addEventListener("click", handleClick); // Evento secundario
    }, []); // Cada vez que se carga la página

    return (
        <section className="viewer-container">
            <div className="viewer-box">
                <a-scene embedded>
                    <a-entity
                        cursor="rayOrigin: mouse"
                        raycaster="objects: [data-raycastable]"
                    ></a-entity>

                    <a-sky src={imageUrl}></a-sky>

                    {points &&
                        Object.entries(points).map(([id, point]) => (
                            <a-sphere
                                key={id}
                                className={`hotspot hotspot--${id}`}
                                data-raycastable
                                data-id={id}
                                radius="0.25"
                                position={positionFor(point)}
                            ></a-sphere>
                        ))}
                </a-scene>

                {activeHotspot && (
                    <div className="viewer-panel">
                        <h3>{activeHotspot}</h3>
                        <p>Pendiente información a recibir</p>

                        <button
                            onClick={() => setActiveHotspot(null)}
                            className="viewer-close-btn"
                        >
                            Cerrar
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};
