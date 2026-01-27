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
                    return response

                } catch (error) {
                  console.log(error)
                    setError('Error al crear la parcela')    
                }
      }

      const createParcel = async (uid_parcel, uid_producer,name_parcel,id_cultivo,coordinates_parcel, photo) => {
        
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
            formData.append('id_cultivo', id_cultivo);
            formData.append('coordinates_parcel', JSON.stringify(coordinates_parcel));
            if (photo) formData.append('photo', photo);
          // console.log('entra en create Parcel', {formData})
            const response = await fetch(`${backendUrl}/producer/createParcel`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: formData,
            });

            // console.log(response, 'create parcels');

            // if (!response.ok) {
            //   let errorMsg = 'Error al crear parcela';
            //   try {
            //     const err = await response.json();
            //     errorMsg = err.msg || errorMsg;
            //   } catch (_) {}
            //   throw new Error(errorMsg);
            // }
            
            return await response.json();

          } catch (error) {
            console.error('createParcel error:', error);
            throw error; 
          }
        };


      const deleteParcelApi = async (uid_parcel) => {
       
        try {
            const firebaseUser = auth.currentUser;
                 if (!firebaseUser) {
                   console.error('No hay usuario autenticado en Firebase');
                  return;
                 }                   
            
            const response = await fetchData(`${apiDataUrl}/eliminarlote?lote=${uid_parcel}`)

              
                    
                  console.log('llamada a la api para eliminar parcela', response);
                  return response

         } catch (error) {
             setError('Error al elimminar la parcela')    
         }
      }

      const deleteParcelBack = async (uid_parcel) => {
        try {
            const firebaseUser = auth.currentUser;
                 if (!firebaseUser) {
                   console.error('No hay usuario autenticado en Firebase');
                  return;
                 }
                    
                 const token = await firebaseUser.getIdToken();
                    
            
            const response = await fetchData(`${backendUrl}/producer/deleteParcel/${uid_parcel}`,
                                              'DELETE',
                                              null,
                                              token
                                            )
                    
                  console.log('llamada al back para eliminar parcela', response);
                  return response

         } catch(error) {
              console.log(error)
              return error
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
        getInfoMeteoByParcel,
        getAlertByParcel,
        getAllAlertsByUser,
        getAllInfoMeteoByUser,
        HealthMap,
        addParcelApi,
        createParcel,
        deleteParcelApi,
        deleteParcelBack,
        bboxCenter
        }

    
}

