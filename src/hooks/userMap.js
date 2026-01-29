import { useCallback, useContext } from "react"
import { MapsContext } from "../contexts/MapsContext"
import {useFetch} from './useFetch'
import { useAuth } from "./useAuth";
import { auth } from '../firebase/firebaseConfig';

/**
 * Hook de servicios para la gestión de datos geoespaciales y meteorológicos.
 * 
 * Proporciona métodos para interactuar con la API de datos agrícolas (Sentinel),
 * servicios meteorológicos y la persistencia de parcelas en el backend.
 * 
 * @function userMap
 * @category Hooks
 * @returns {Object} Funciones de gestión de parcelas, alertas y mapas de salud.
 */
export const userMap = () => { 
    const { user } = useAuth();
     const { fetchData, loading, error, setError } = useFetch();
     const backendUrl = import.meta.env.VITE_BACKEND_URL;
     const apiDataUrl = import.meta.env.VITE_API_DATA_URL
    

    /**
     * Obtiene información meteorológica detallada de una parcela específica.
     * @async
     * @param {string} uid_parcel - Identificador único de la parcela.
     * @returns {Promise<Object|undefined>} Datos meteorológicos o undefined si falla.
     */
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

/**
 * Obtiene todas las alertas climáticas asociadas a un usuario por su email.
 * @async
 * @param {string} email - Email del usuario.
 * @returns {Promise<Array|undefined>} Listado de alertas activas.
 */
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

  const getAllAlertByUid = useCallback(async (uid_parcel) => {
    if(!uid_parcel) return;
    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return;
      const token = await firebaseUser.getIdToken();

      const response = await fetchData(
        `${backendUrl}/getAlertByParcel/${uid_parcel}`,
        'GET',
        null,
        token
      );

      console.log(`esta es la alerta de la parcela con uid ${uid_parcel}`, response);
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

      
    /**
     * Solicita a la API externa el procesamiento de alertas para una nueva parcela.
     * @async
     * @param {string} uid_parcel - Identificador único de la parcela.
     * @returns {Promise<string|undefined>} 'OK' si el proceso de guardado fue exitoso.
     */
      const saveAlertsByParcel = async (uid_parcel) => {
        if(!uid_parcel) return
        try {
          console.log('LLAMANDO A LA TIERRA, ESPERANDO CONTESTACIÓN <==============================>');
          const body = {uid_parcela: uid_parcel}
          // console.log('llamada')
          const response = await fetchData(
          
            `${apiDataUrl}/alertas_tiempo_parcela`,
            'POST',
            body,
            null
          );
          if(response === 'OK') {
            console.log('Se han guardado las alertas de la parcela creada:', response);
            console.log('RESPUESTA CORRECETA PABLO <==============================>');
                return response
          } else {
            setError("No Se ha podido guardar las alertas de la parcela creada")
            console.log('Problemas en guardar alertas en la parcela creada')
            return 
          }
            } catch (error) {
              console.log(error, 'Error al guardar las  alertas de las parcela')
                setError('Error al guardar las  alertas de las parcela')        }
      }

    /**
     * Obtiene las URLs de las imágenes PNG (Sentinel-2) que representan la salud del campo.
     * @async
     * @param {string} uid_parcel - Identificador único de la parcela.
     * @returns {Promise<Object|undefined>} Objeto con rutas a imágenes de índices de vegetación.
     */
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
    /**
     * Registra una nueva parcela en la API de procesamiento de datos geoespaciales.
     * @async
     * @param {string} nombrecampo - Alias o nombre de la parcela.
     * @param {Object} shape - Objeto GeoJSON o estructura de coordenadas de la parcela.
     * @returns {Promise<Object|undefined>} Respuesta de confirmación de la API de datos.
     */
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
    /**
     * Persiste la creación de una parcela en el backend propio, incluyendo metadatos y fotografía.
     * Utiliza `FormData` para el envío de archivos multimedia.
     * 
     * @async
     * @param {string} uid_parcel - UID generado para la parcela.
     * @param {string} uid_producer - UID del productor propietario.
     * @param {string} name_parcel - Nombre descriptivo.
     * @param {number} id_cultivo - ID del tipo de cultivo seleccionado.
     * @param {Array} coordinates_parcel - Array de coordenadas geográficas.
     * @param {File|null} photo - Archivo de imagen de la parcela.
     * @returns {Promise<Object>} Respuesta del servidor backend.
     */
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
          console.log('entra en create Parcel', {formData})
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

    const getParcelVegetation = async (uid_parcel) => {
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
                      `${backendUrl}/alerts/getParcelVegetation/${uid_parcel}`,
                      'GET',
                      null,
                      token
                    );
                    
                    console.log('Vegetación de la parcela seleccionada:', response);
                    return response
                } catch (error) {
                    setError('Error al cargar lavegetación parcela')        
                }
    }

    const getParcelCrops = useCallback(async (uid_parcel) => {
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
                      `${backendUrl}/alerts/getParcelCrops/${uid_parcel}`,
                      'GET',
                      null,
                      token
                    );
                    
                    console.log('Tipo de cultivo de la parcela seleccionada:', response);
                    return response
                } catch (error) {
                    setError('Error al cargar el tipo de cultivo parcela')        }
    })
    


      
    
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
        bboxCenter,
        getAlertByParcel,
        getParcelVegetation,
        getParcelCrops,
        saveAlertsByParcel
        }

    
}

