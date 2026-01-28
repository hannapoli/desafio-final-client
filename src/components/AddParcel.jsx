import React, { useContext, useState } from 'react'
import Select from 'react-select'
import { userMap } from '../hooks/userMap';
import { MapsContext } from '../contexts/MapsContext';
import { AuthContext } from '../contexts/AuthContext';


const options = [
  { value: 1, label: "Uva de Mesa - Crimson Seedless" },
  { value: 2, label: "Uva de Mesa - Thompson Seedless" },
  { value: 3, label: "Uva de Mesa - Red Globe" },
  { value: 4, label: "Uva de Mesa - Flame Seedless" },
  { value: 5, label: "Cereza - Lapins" },
  { value: 6, label: "Cereza - Santina" },
  { value: 7, label: "Cereza - Bing" },
  { value: 8, label: "Cereza - Regina" },
  { value: 9, label: "Aguacate - Hass" },
  { value: 10, label: "Aguacate - Edranol" },
  { value: 11, label: "Aguacate - Fuerte" },
  { value: 12, label: "Arándano - Duke" },
  { value: 13, label: "Arándano - Legacy" },
  { value: 14, label: "Arándano - Brigitta" },
  { value: 15, label: "Manzana - Royal Gala" },
  { value: 16, label: "Manzana - Granny Smith" },
  { value: 17, label: "Manzana - Fuji" },
  { value: 18, label: "Manzana - Pink Lady" },
  { value: 19, label: "Pera - Packhams Triumph" },
  { value: 20, label: "Pera - Abate Fetel" },
  { value: 21, label: "Mandarina - W. Murcott" },
  { value: 22, label: "Mandarina - Clementina" },
  { value: 23, label: "Naranja - Fukumoto" },
  { value: 24, label: "Limón - Eureka" },
  { value: 25, label: "Limón - Génova" },
  { value: 26, label: "Ciruela - Angeleno" },
  { value: 27, label: "Melocotón - August Red" },
  { value: 28, label: "Nectarina - Big Top" },
  { value: 29, label: "Albaricoque - Dina" },
  { value: 30, label: "Nogal - Chandler" },
  { value: 31, label: "Nogal - Serr" },
  { value: 32, label: "Almendro - Nonpareil" },
  { value: 33, label: "Kiwi - Hayward" },
  { value: 34, label: "Kiwi - Jintao" },
  { value: 35, label: "Granada - Wonderful" },
  { value: 36, label: "Frambuesa - Heritage" },
  { value: 37, label: "Mora - Lochness" },
  { value: 38, label: "Tomate - Limachino" },
  { value: 39, label: "Tomate - Larga Vida" },
  { value: 40, label: "Tomate - Industrial" },
  { value: 41, label: "Pimiento - Cuatro Cascos" },
  { value: 42, label: "Guindilla/Ají - Cacho de Cabra" },
  { value: 43, label: "Maíz - Choclo Pastelero" },
  { value: 44, label: "Maíz - Dulce" },
  { value: 45, label: "Patata - Desiree" },
  { value: 46, label: "Patata - Yagana" },
  { value: 47, label: "Cebolla - Valenciana" },
  { value: 48, label: "Ajo - Chino/Rosado" },
  { value: 49, label: "Calabaza - Camote" },
  { value: 50, label: "Calabacín - Italiano" },
  { value: 51, label: "Melón - Tuna (Verde)" },
  { value: 52, label: "Melón - Calameño/Cantaloup" },
  { value: 53, label: "Sandía - Klondike" },
  { value: 54, label: "Lechuga - Escarola" },
  { value: 55, label: "Judía - Granado" },
];


export const AddParcel = ({polygon}) => {

    const [selectedOption, setSelectedOption] = useState(null);

      const {bboxCenter, addParcelApi, createParcel, saveAlertsByParcel} = userMap()
      const { polygons, setPolygons, addParcel, addPolygon, center,setCenter} = useContext(MapsContext);
      const {user} = useContext(AuthContext)

      const [errorCrear, setErrorCrear] = useState(null)
      const [imagen, setImagen] = useState(null);
      const [createdParcel, setCreatedParcel] = useState(false)

    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        const form = e.target;
        const nombreparcela = form.nombreparcela.value;
        // const cultivo = form.cultivo.value;    
        const id_cultivo = selectedOption.value;    
        // console.log({id_cultivo})
        try {
          console.log('entra en crear')
          const crear = await addParcelApi(nombreparcela, polygon);
    
          if (crear.res === 'error') {
            setError(crear.info);
            console.log({error})
            return;
          }
          console.log({crear}, 'es la resp de addParcel')
    
          const polygonClosed = [...polygon, polygon[0]];
        
          const respuesta = await createParcel(
            crear.id_lote,
            // 89983433,
            user.uid,
            nombreparcela,
            id_cultivo,
            polygonClosed,
            imagen
          );
          console.log({respuesta}, 'create')
          if (!respuesta.ok) {
            setErrorCrear(respuesta.msg);
          } else {
            await saveAlertsByParcel(crear.id_cultivo)
            
            setErrorCrear(null);
            setCreatedParcel(true);
            addPolygon(polygon)
            // setCenter(bboxCenter(polygons))
            addParcel(respuesta.data);
          }

    
          console.log('Parcela creada:', respuesta);
        //   setPopupPosition(null);
    
        } catch (error) {
          console.error(error);
          setErrorCrear(error.message);
        }
      };
    
  return (
    <>
    {errorCrear && (<p>{errorCrear}</p>)}
    {createdParcel
     ? <p>Parcela creada correctamente</p>
     : <form onSubmit={handleSubmit} className="form-crear-parcela">
                <input
                  type="text"
                  name="nombreparcela"
                  placeholder="Nombre de la parcela"
                  required
                />
                <Select
                    id="cultivo"
                    name="cultivo"                   
                    options={options}
                    value={selectedOption}
                    onChange={setSelectedOption}
                    placeholder="Selecciona un cultivo"
                    isSearchable={true}
                    required
                />
                <label htmlFor="photo" className="label-imagen-articulo">Imagen del Artículo</label>
                <input
                        type="file"
                        id="photo"
                        name="photo"
                        accept="photo/*"
                        onChange={(e) => setImagen(e.target.files[0])}
                        required
                    />
                <button type="submit" className="login-button">Guardar parcela</button>
         </form>
    }
    
    </>
  )
}
