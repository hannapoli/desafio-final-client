import './Legend.css'

export const Legend = ({ data }) => {
  if (!data) return null;
  return (
    <div className="c-legend">
      <h4 className="c-legend__title">{data.title}</h4>
      <div className="c-legend__list">
        {data.palette.map((item, i) => (
          <div key={i} className="c-legend__item">
            <div 
              className="c-legend__color-box" 
              style={{ '--accent-color': item.color }}
              aria-hidden="true"
            />
            <div className="c-legend__content">
              <span className="c-legend__label">{item.label}</span>
              <span className="c-legend__value">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
    // <div className='legend' >
    //   <strong>{data.title}</strong>
    //   {data.palette.map((item, i) => (
    //     <div key={i} style={{ display: 'flex', alignItems: 'center', marginTop: '4px' }}>
    //       <div style={{ width: '15px', height: '15px', background: item.color, marginRight: '8px' }}></div>
    //       <span style={{ fontSize: '12px' }}>{item.label} ({item.value})</span>
    //     </div>
    //   ))}
    // </div>
  
};