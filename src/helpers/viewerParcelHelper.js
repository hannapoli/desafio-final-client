/**
 * Función que convierte coodenadas 2D(x, y) en posición 3D para poder ser interpretado por A-Frame
 * @param {Number} x Coordinada X
 * @param {Number} y Coordinada y
 * @returns Posición 3D en formato string
 */
export const positionFor = ({ x, y }) => {
   
    // Normalizar valores de x e y
    const nx = (x / 2048) * 4 - 2; // [-2, 2] Rango más pequeño para centrar el punto
    const ny = (y / 2048) * 2;     // [0, 2] Rango más pequeño para centrar el punto
    
    // Fija la profundidad del punto
    const nz = -3;

    return `${nx} ${ny} ${nz}`;
};


