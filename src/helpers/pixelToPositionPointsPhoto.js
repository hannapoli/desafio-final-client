export const pixelToPositionPointsPhoto = ({ x, y, z }, kind, scale = 1) => {
  // 1. Partimos del vector original
  let vx = x * scale;
  let vy = y * scale;
  let vz = -z * scale; // A‑Frame mira hacia -Z

  // 2. Rotación solo para soil y crop
  if (kind === "soil" || kind === "crop") {
    const angle = Math.PI / 2; // 90º
    const cos = Math.cos(angle); // -1
    const sin = Math.sin(angle); // 0

    const rx = vx * cos + vz * sin; // -vx
    const rz = -vx * sin + vz * cos; // -vz

    vx = rx;
    vz = rz;
  }

  return `${vx} ${vy} ${vz}`;
};
