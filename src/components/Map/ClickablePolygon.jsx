import { useContext, useEffect, useState } from 'react';
import { Polygon, useMap, Popup, GeoJSON, ImageOverlay } from 'react-leaflet';
import { MapsContext } from '../../contexts/MapsContext'
import { userMap } from '../../hooks/userMap'
import { Legend } from './Legend';
import './Legend.css'


export const ClickablePolygon = ({ parcels }) => {

  const { setParcel, setSelectedParcelId, setInfoMeteo } = useContext(MapsContext)
  const { HealthMap, getInfoMeteoByParcel, deleteParcelApi, deleteParcelBack } = userMap()
  const [healthData, setHealthData] = useState(null);
  const [selectedLayerType, setSelectedLayerType] = useState('NDVI');
  const [loading, setLoading] = useState(false)


  const map = useMap();

  // console.log({parcels}, 'desde clickable polygon')

  //   const parcela = parcels.filter(p => JSON.parse(p.coordinates_parcel)  == positions )
  //  console.log({parcela}, 'on clickable polygon')

  // CÁLCULO DE LA CAPA ACTIVA (Fuera de cualquier función para que el render la vea)


  const handleClick = async (e, p) => {
    console.log('Entra en el hadleClick')
    const zoomToFeature = (e) => {
      const bounds = e.target.getBounds();
      map.fitBounds(bounds, {
        padding: [5, 5],
        maxZoom: 25,
        animate: true,
      });
    };

    zoomToFeature(e)


    setSelectedParcelId(p.uid_parcel);

    const data = await getInfoMeteoByParcel(p.uid_parcel)
    console.log({ data })
    setInfoMeteo(data.data)
    setParcel(p)
    overLay(p.uid_parcel)
    // setUnmark(p.uid_parcel)
    // console.log({p},'desde el polígono')
  }


  const overLay = async (uid_parcel) => {

    const respuesta = await HealthMap(uid_parcel)
    if (respuesta.error) setLoading(true)
    console.log('Health map', { respuesta })
    setHealthData(respuesta)
  }


  useEffect(() => {
    if (healthData) {
      console.log('healthData actualizado:', healthData);

    }

  }, [healthData]);
  const activeLayer = healthData?.layers?.find(l => l.type === selectedLayerType);
  return (
    <>
      {parcels.map(p => (
        <Polygon
          key={`${p.uid_parcel}`}
          positions={JSON.parse(p.coordinates_parcel)}
          eventHandlers={{//no se puede utilizar onClick con react-leaflet
            click: (e) => handleClick(e, p),
          }}
        >

          {/* <Popup>
         
        <button onClick={()=>}>Ver salud del campo</button>
       {errorEliminar ? (
          <p>{errorEliminar}</p>
        ) : (
          <>
            <p>Detalle del campo:</p>
            <p>Nombre del campo: {p.name_parcel}</p>
            <p>Cultivo: {p.id_cultivo}</p>

            {infoMeteo && (
              <InfoMeteo p={p} infoMeteo={infoMeteo} />
            )}
          </>
        )}

      </Popup> */}


        </Polygon>))}
      {activeLayer && healthData.image_bounds && healthData.image_bounds.length === 2 && (
        <ImageOverlay
          url={activeLayer.image_data}
          bounds={healthData.image_bounds}
          opacity={0.7}
          interactive={false}
          zIndex={500}
        />
      )}
      {!loading && healthData && activeLayer && (
        <div className='select-overlay' >
          <select
            value={selectedLayerType}
            onChange={(e) => setSelectedLayerType(e.target.value)}
          >
            {healthData.layers.map(l => (
              <option key={l.type} value={l.type}>{l.type}</option>
            ))}
          </select>
        </div>
      )
    
    
    }
      {activeLayer && <Legend data={activeLayer.legend} />}



    </>

  );
}
