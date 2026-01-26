import { useCallback, useContext } from "react"
import { MapsContext } from "../contexts/MapsContext"
import {useFetch} from './useFetch'
import { useAuth } from "./useAuth";
import { auth } from '../firebase/firebaseConfig';

export const userMap = () => { 
    const { user } = useAuth();
     const { fetchData, loading, error, setError } = useFetch();
     const backendUrl = import.meta.env.VITE_BACKEND_URL;
     const apiDataUrl = import.meta.env.VITE_API_DATA_URL
    


      const getInfoMeteoByParcel = async (uid_parcel) => {
        if(!uid_parcel) return
        try {
             const firebaseUser = auth.currentUser;
                    if (!firebaseUser) {
                      console.error('No hay usuario autenticado en Firebase');
                      return;
                    }
                    
                    const token = await firebaseUser.getIdToken();
                    // console.log('llamada')
                    const response = await fetchData(
                      `${backendUrl}/alerts/getInfoMeteoByParcel/${uid_parcel}`,
                      'GET',
                      null,
                      token
                    );
                    
                    console.log('Datos meteorológicos de la parcela seleccionada:', response);
                    return response
                } catch (error) {
                    setError('Error al cargar los datos de las parcela')        }
      }

      const getAllInfoMeteoByUser = async (email) => {
        if(!email) return
        try {
             const firebaseUser = auth.currentUser;
                    if (!firebaseUser) {
                      console.error('No hay usuario autenticado en Firebase');
                      return;
                    }
                    
                    const token = await firebaseUser.getIdToken();
                    // console.log('llamada')
                    const response = await fetchData(
                      `${backendUrl}/alerts/getAllInfoMeteoByUser/${email}`,
                      'GET',
                      null,
                      token
                    );
                    
                    console.log('Datos meteorológicos de tus parcelas', response);
                    return response
                } catch (error) {
                    setError('Error al cargar los datos de la parcela')        }
      }

    
const getAllAlertsByUser = useCallback(async (email) => {
    if(!email) return;
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;
      const token = await firebaseUser.getIdToken();

      const response = await fetchData(
        `${backendUrl}/alerts/getAllAlertsByUser/${email}`,
        'GET',
        null,
        token
      );

      console.log('Estas son las alertas de tus parcelas', response);
      return response;
    } catch (error) {
      setError('Error al cargar las alertas de la parcela');
    }
  }, [fetchData, setError, backendUrl]);
      
       const getAlertByParcel = async (uid_parcel) => {
        if(!uid_parcel) return
        try {
             const firebaseUser = auth.currentUser;
                    if (!firebaseUser) {
                      console.error('No hay usuario autenticado en Firebase');
                      return;
                    }
                    
                    const token = await firebaseUser.getIdToken();
                    // console.log('llamada')
                    const response = await fetchData(
                      `${backendUrl}/alerts/getAlertByParcel/${uid_parcel}`,
                      'GET',
                      null,
                      token
                    );
                    
                    console.log('Alertas de la parcela seleccionada:', response);
                    return response
                } catch (error) {
                    setError('Error al cargar las  alertas de las parcela')        }
      }

    
      const HealthMap = async (uid_parcel) => {
        if(!uid_parcel) return
        try {
            const body = {uid_parcel}
            const response = await fetchData(
                `${apiDataUrl}/maps_sentinel`,
                'POST',
                body,
                null
                );
                    
                    console.log('Estos son los png de la salud del campo:', response);
                    return response
                } catch (error) {
                    setError('Error al cargar las  alertas de las parcela')    
                }
      }

      const addParcelApi = async (nombrecampo, shape) => {
        if(!nombrecampo || !shape) return
        try {
                              
            const body = {nombrecampo, shape}
                const response = await fetchData(
                    `${apiDataUrl}/agregarlote`,
                    'POST',
                    body,
                    null
                    );
                    
                    console.log('respuesta al crear parcela', response);
                    // aquí debería ir la llamada al back para crear
                    return response

                } catch (error) {
                  console.log(error)
                    setError('Error al crear la parcela')    
                }
      }

      const createParcel = async (uid_parcel, uid_producer,name_parcel,product_parcel,coordinates_parcel, photo) => {
        
          try {
            const firebaseUser = auth.currentUser;

            if (!firebaseUser) {
              throw new Error('No hay usuario autenticado en Firebase');
            }

            const token = await firebaseUser.getIdToken();

            const formData = new FormData();
            formData.append('uid_parcel', uid_parcel);
            formData.append('uid_producer', uid_producer);
            formData.append('name_parcel', name_parcel);
            formData.append('product_parcel', product_parcel);
            formData.append('coordinates_parcel', JSON.stringify(coordinates_parcel));
            if (photo) formData.append('photo', photo);
console.log('entra en create Parcel', {formData})
            const response = await fetch(`${backendUrl}/producer/createParcel`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });

            console.log(response, 'create parcels');

            if (!response.ok) {
              let errorMsg = 'Error al crear parcela';
              try {
                const err = await response.json();
                errorMsg = err.msg || errorMsg;
              } catch (_) {}
              throw new Error(errorMsg);
            }

            return await response.json();

          } catch (error) {
            console.error('createParcel error:', error);
            throw error; // importante: propagar el error al componente
          }
        };


      const deleteParcel = async (uid_parcel) => {
       
        try {
            const firebaseUser = auth.currentUser;
                 if (!firebaseUser) {
                   console.error('No hay usuario autenticado en Firebase');
                  return;
                 }
                    
                 const token = await firebaseUser.getIdToken();
                    
            
            const response = await fetchData(`${backendUrl}/eliminarlote?lote=${uid_parcel}`);
                    
                  console.log('parcela creada correctamente', response);
                  // aquí debería ir la llamada al back para borrar
                  return response

         } catch (error) {
             setError('Error al elimminar la parcela')    
         }
      }

      const bboxCenter = (polygons) =>{
          
       if (polygons.length=== 0) return
        let minLat = Infinity, maxLat = -Infinity;
        let minLng = Infinity, maxLng = -Infinity;

        polygons.forEach(polygon => {
            polygon.forEach(([lat, lng]) => {
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
            });
        });
        const centro = [
            (minLat + maxLat) / 2,
            (minLng + maxLng) / 2   
        ];
         return centro
    }


      
    
    return {
        // simulacionLlamadaBack, 
        // simulaciónLlamadaApiSaludDelCampo,
        getInfoMeteoByParcel,
        getAlertByParcel,
        getAllAlertsByUser,
        getAllInfoMeteoByUser,
        HealthMap,
        addParcelApi,
        createParcel,
        deleteParcel,
        bboxCenter
        }

    
}

//   const simulaciónLlamadaApiSaludDelCampo =() => {
    //     const respuesta = [
    //     {
    //         "id": "Field_1_2",
    //         "date": "2026-01-17",
    //         "geometry": {
    //         "type": "Polygon",
    //         "coordinates": [
    //             [
    //             [
    //                 -72.60537242850114,
    //                 -37.216194509829975
    //             ],
    //             [
    //                 -72.60463428471121,
    //                 -37.2192156098624
    //             ],
    //             [
    //                 -72.60284900612896,
    //                 -37.220596252953385
    //             ],
    //             [
    //                 -72.59610271480051,
    //                 -37.220596252953385
    //             ],
    //             [
    //                 -72.59459209415944,
    //                 -37.2187918426762
    //             ],
    //             [
    //                 -72.60537242850114,
    //                 -37.216194509829975
    //             ]
    //             ]
    //         ]
    //         },
    //         "image_bounds": [
    //         [
    //             -37.220596252953385,
    //             -72.60537242850114
    //         ],
    //         [
    //             -37.216194509829975,
    //             -72.59459209415944
    //         ]
    //         ],
    //         "layers": [
    //         {
    //             "type": "NDVI",
    //             "image_data": "data:image/png;base64,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",
    //             "legend": {
    //             "title": "Índice NDVI",
    //             "min": 0.0,
    //             "max": 1.0,
    //             "palette": [
    //                 {
    //                 "value": 0.0,
    //                 "color": "#a50026",
    //                 "label": "Suelo"
    //                 },
    //                 {
    //                 "value": 0.25,
    //                 "color": "#f98e52",
    //                 "label": "Bajo"
    //                 },
    //                 {
    //                 "value": 0.5,
    //                 "color": "#feffbe",
    //                 "label": "Medio"
    //                 },
    //                 {
    //                 "value": 0.75,
    //                 "color": "#84ca66",
    //                 "label": "Alto"
    //                 },
    //                 {
    //                 "value": 1.0,
    //                 "color": "#006837",
    //                 "label": "Muy Alto"
    //                 }
    //             ]
    //             }
    //         },
    //         {
    //             "type": "NDWI",
    //             "image_data": "data:image/png;base64,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",
    //             "legend": {
    //             "title": "Índice NDWI",
    //             "min": -1.0,
    //             "max": 1.0,
    //             "palette": [
    //                 {
    //                 "value": -1.0,
    //                 "color": "#a50026",
    //                 "label": "Muy Seco"
    //                 },
    //                 {
    //                 "value": -0.5,
    //                 "color": "#f98e52",
    //                 "label": "Seco"
    //                 },
    //                 {
    //                 "value": 0.0,
    //                 "color": "#feffc0",
    //                 "label": "Neutro"
    //                 },
    //                 {
    //                 "value": 0.5,
    //                 "color": "#8ec2dc",
    //                 "label": "Húmedo"
    //                 },
    //                 {
    //                 "value": 1.0,
    //                 "color": "#313695",
    //                 "label": "Agua"
    //                 }
    //             ]
    //             }
    //         },
    //         {
    //             "type": "NDRE",
    //             "image_data": "data:image/png;base64,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",
    //             "legend": {
    //             "title": "Índice NDRE",
    //             "min": 0.0,
    //             "max": 0.8,
    //             "palette": [
    //                 {
    //                 "value": 0.0,
    //                 "color": "#a50026",
    //                 "label": "Bajo"
    //                 },
    //                 {
    //                 "value": 0.2,
    //                 "color": "#f98e52",
    //                 "label": "Medio-Bajo"
    //                 },
    //                 {
    //                 "value": 0.4,
    //                 "color": "#feffbe",
    //                 "label": "Medio"
    //                 },
    //                 {
    //                 "value": 0.6,
    //                 "color": "#84ca66",
    //                 "label": "Alto"
    //                 },
    //                 {
    //                 "value": 0.8,
    //                 "color": "#006837",
    //                 "label": "Muy Alto"
    //                 }
    //             ]
    //             }
    //         },
    //         {
    //             "type": "GNDVI",
    //             "image_data": "data:image/png;base64,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",
    //             "legend": {
    //             "title": "Índice GNDVI",
    //             "min": 0.0,
    //             "max": 1.0,
    //             "palette": [
    //                 {
    //                 "value": 0.0,
    //                 "color": "#a50026",
    //                 "label": "Bajo"
    //                 },
    //                 {
    //                 "value": 0.25,
    //                 "color": "#f98e52",
    //                 "label": "Medio-Bajo"
    //                 },
    //                 {
    //                 "value": 0.5,
    //                 "color": "#feffbe",
    //                 "label": "Medio"
    //                 },
    //                 {
    //                 "value": 0.75,
    //                 "color": "#84ca66",
    //                 "label": "Alto"
    //                 },
    //                 {
    //                 "value": 1.0,
    //                 "color": "#006837",
    //                 "label": "Muy Alto"
    //                 }
    //             ]
    //             }
    //         }
    //         ]
    //     }
    //     ]
    //     return respuesta
    //   }


    //   const simulacionLlamadaBack = () => {
    //     const respuesta ={
    //          "msg": "TODO OK",
    //          "data": [
    //             {
    //             "uid_parcel": "783913",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Field 1_2",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-37.216194509829975, -72.60537242850114], [-37.2192156098624, -72.60463428471121], [-37.220596252953385, -72.60284900612896], [-37.220596252953385, -72.59610271480051], [-37.2187918426762, -72.59459209415944], [-37.216194509829975, -72.60537242850114]]"
    //             },
    //             {
    //             "uid_parcel": "783921",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Field 1_3",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-37.21888753217828, -72.59460925951134], [-37.220555245153534, -72.59593105159001], [-37.22065093148001, -72.59157085366313], [-37.21958469519948, -72.59141635947162], [-37.21888753217828, -72.59460925951134]]"
    //             },
    //             {
    //             "uid_parcel": "783939",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Field 1_1",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-37.216358554497994, -72.62334537427523], [-37.216385895875796, -72.61826419777935], [-37.21909258091111, -72.61831569671631], [-37.21894221173495, -72.62343120496371], [-37.216358554497994, -72.62334537427523]]"
    //             },
    //             {
    //             "uid_parcel": "784108",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Field 1_5",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-37.213692783648334, -72.61253929059602], [-37.21618083952482, -72.60550117414095], [-37.21929762887798, -72.60469436645508], [-37.219288977710505, -72.60539508183416], [-37.21924294926606, -72.60912322919467], [-37.213692783648334, -72.61253929059602]]"
    //             },
    //             {
    //             "uid_parcel": "784109",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Field 1_6",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-37.218245043192915, -72.6324348449707], [-37.218491103607334, -72.62779998779297], [-37.22155312066438, -72.62599754333496], [-37.221484773447806, -72.63411712633388], [-37.218245043192915, -72.6324348449707]]"
    //             },
    //             {
    //             "uid_parcel": "784110",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Field 1_7",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-37.21426695768697, -72.63664054831315], [-37.21672081865802, -72.63915538774744], [-37.218716658034424, -72.63698387132898], [-37.217076246110956, -72.63471794089128], [-37.21426695768697, -72.63664054831315]]"
    //             },
    //             {
    //             "uid_parcel": "784287",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Granja 1_7",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-40.34087892439068, -73.22854614257812], [-40.345471302889614, -73.22743034362793], [-40.34591613225603, -73.23168754499055], [-40.34121911134347, -73.23258018493651], [-40.34087892439068, -73.22854614257812]]"
    //             },
    //             {
    //             "uid_parcel": "784288",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Granja 1_8",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-40.340878924490504, -73.22830581586457], [-40.34052565156049, -73.2240657803777], [-40.34514422084822, -73.22288131687674], [-40.34539280361982, -73.22724151611328], [-40.340878924490504, -73.22830581586457]]"
    //             },
    //             {
    //             "uid_parcel": "784289",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Granja 1_9",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-40.348297226938264, -73.24011611833703], [-40.348244895895185, -73.23534393153386], [-40.352771363506555, -73.23517227015691], [-40.35224808796117, -73.24028777971398], [-40.348297226938264, -73.24011611833703]]"
    //             },
    //             {
    //             "uid_parcel": "784290",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Granja 1_10",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-36.32762826593765, -59.46157836835482], [-36.331887719739726, -59.46671104444249], [-36.333796100714345, -59.464118957257604], [-36.32957823996245, -59.45883178632357], [-36.32762826593765, -59.46157836835482]]"
    //             },
    //             {
    //             "uid_parcel": "784291",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Granja 1_11",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-36.333747700639215, -59.46223926537642], [-36.33510290013266, -59.46025657627616], [-36.3320467535325, -59.456368446481065], [-36.33056012287952, -59.45856571171317], [-36.333747700639215, -59.46223926537642]]"
    //             },
    //             {
    //             "uid_parcel": "784292",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Granja 1_12",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-36.330414915530376, -59.45827388743781], [-36.33188080591633, -59.45622253417967], [-36.328817617408895, -59.452634811270414], [-36.32733784017259, -59.45504665348564], [-36.330414915530376, -59.45827388743781]]"
    //             },
    //             {
    //             "uid_parcel": "784293",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Granja 1_13",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-36.327324010319614, -59.46116638157401], [-36.32923250308041, -59.458711623359704], [-36.32505588612837, -59.4541454309947], [-36.323423901434445, -59.45702934265138], [-36.327324010319614, -59.46116638157401]]"
    //             },
    //             {
    //             "uid_parcel": "784294",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Granja 1_14",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-34.42582907405228, -54.083633421279956], [-34.42908572692301, -54.08624267630512], [-34.431832544851225, -54.08105850062565], [-34.42815122218392, -54.07886123709614], [-34.42582907405228, -54.083633421279956]]"
    //             },
    //             {
    //             "uid_parcel": "784295",
    //             "uid_producer": "fd95604b-b479-4090-8719-fe3ec1336a40",
    //             "name_parcel": "Granja 1_15",
    //             "product_parcel": "No especificado",
    //             "coordinates_parcel": "[[-34.43181838644455, -54.08086967494455], [-34.43382888696835, -54.07630348126985], [-34.42929811376595, -54.07311057992047], [-34.427698125408675, -54.07800292942558], [-34.43181838644455, -54.08086967494455]]"
    //             }
    //          ]
    //         }
    //     return respuesta
    //   }