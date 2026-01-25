// Icons.jsx
const icons = {
  search: (
    <path d="M11 19a8 8 0 100-16 8 8 0 000 16zM21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  ),
  trash: (
    <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T560-120H280Zm400-600H280v520h280v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
  ),
  // Puedes añadir más aquí: mail, settings, etc.
};

export const Icon = ({ name, color = "currentColor", size = 20, className = "" }) => {
  const isSearch = name === 'search';
  
  return (
    <svg
      xmlns="http://www.w3.org"
      width={size}
      height={size}
      viewBox={isSearch ? "0 0 24 24" : "0 -960 960 960"} // Ajusta el viewport según el icono
      fill={isSearch ? "none" : color}
      stroke={isSearch ? color : "none"}
      className={className}
    >
      {icons[name]}
    </svg>
  );
};
