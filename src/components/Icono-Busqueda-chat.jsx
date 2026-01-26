// Icons.jsx
const icons = {
  search: {
    path: <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: true
  },
  trash: {
    path: <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T560-120H280Zm400-600H280v520h280v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />,
    viewBox: "0 -960 960 960",
    fill: "currentColor",
    stroke: false
  },
  airplane: { 
    path: <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fillRule="evenodd" />, 
    viewBox: "0 0 24 24",
    fill: "currentColor",
    stroke: false
  }
};

export const Icon = ({ name, color = "currentColor", size = 20, className = "" }) => {
  const icon = icons[name];
  if (!icon) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox={icon.viewBox}
      className={className}
      style={{ display: 'block', flexShrink: 0 }} // Evita que flexbox lo colapse
    >
      <g 
        fill={icon.fill === "none" ? "none" : color} 
        stroke={icon.stroke ? color : "none"}
      >
        {icon.path}
      </g>
    </svg>
  );
};
