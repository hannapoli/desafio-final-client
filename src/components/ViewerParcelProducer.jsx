import "aframe";
import { useEffect, useState } from "react";
import "./ViewerParcelProducer.css";

export const ViewerParcelProducer = ({ imageUrl, points }) => {
    {/*Pendiente como hacer el tema de los puntos*/ }

    const [activeHotspot, setActiveHotspot] = useState(null);

    useEffect(() => {
        const scene = document.querySelector("a-scene");

        const handleClick = (event) => {
            const hotspot = event.target.closest(".hotspot");

            const id = hotspot.getAttribute("data-id");

            setActiveHotspot(id);
        };

        scene.addEventListener("click", handleClick); // Evento secundario
    }, []);

    return (
        <article className="viewer-container">
            <div className="viewer-box">
                <a-scene embedded> {/*Para que la escena no ocupe toda la pantalla*/}
                    <a-entity cursor="rayOrigin: mouse" raycaster="objects: [data-raycastable]"></a-entity> {/*Cursor: Convierte el mouse en un puntero 3D / Raycaster: Para detectar solo objetos con el atributo data-raycastable (hotspot) */}

                    <a-sky src={imageUrl}></a-sky> {/*Para crear una esfera gigante alrededor de la cámara con la imagen pasada por Props*/}
                    {/*Si hay puntos - Marcarlos en el mapa*/}
                    {points && (
                        points.map(({ id, position }) => 
                        <a-image
                            key={id}
                            data-id={id}
                            data-raycastable
                            src="/logo.png"
                            className="hotspot"
                            width="1.5"
                            height="1.5"
                            position={position}
                        ></a-image>
                    ))}
                </a-scene>
                {/*Si hay hotspot seleccionado, muestra la data*/}
                {activeHotspot && (
                    <div className="viewer-panel">
                        <h3>{activeHotspot}</h3>
                        <p>Pendiente información a recibir</p>

                        <button onClick={() => setActiveHotspot(null)}>Cerrar</button>
                    </div>
                )}
            </div>
        </article>
    );
};
