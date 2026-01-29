import './Legend.css'

/**
 * Legend component.
 *
 * Muestra una leyenda visual asociada a una capa
 * de datos (por ejemplo índices de vegetación).
 *
 * Recibe una paleta de colores con etiquetas y
 * valores representativos.
 *
 * @component
 * @param {Object} props
 * @param {Object} props.data - Datos de la leyenda
 * @returns {JSX.Element|null}
 */
export const Legend = ({ data }) => {
  if (!data || !data.palette || !Array.isArray(data.palette)) return null;
  return (
    <div className='legend'>
      <strong>{data.title || 'Leyenda'}</strong>
      {data.palette.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', marginTop: '4px', zIndex: '9999' }}>
          <div style={{ width: '15px', height: '15px', background: item.color, marginRight: '8px' }}></div>
          <span style={{ fontSize: '12px' }}>{item.label} ({item.value})</span>
        </div>
      ))}
    </div>
  );
};