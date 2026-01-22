export const Legend = ({ data }) => {
  if (!data) return null;
  return (
    <div style={{
      position: 'absolute', bottom: '20px', right: '20px', zIndex: 1000,
      background: 'white', padding: '10px', borderRadius: '5px', border: '1px solid gray'
    }}>
      <strong>{data.title}</strong>
      {data.palette.map((item, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
          <div style={{ width: '15px', height: '15px', background: item.color, marginRight: '8px' }}></div>
          <span style={{ fontSize: '12px' }}>{item.label} ({item.value})</span>
        </div>
      ))}
    </div>
  );
};