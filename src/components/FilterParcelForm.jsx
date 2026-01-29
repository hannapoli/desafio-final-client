import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import { MapsContext } from '../contexts/MapsContext';
import './FilterParcelForm.css'


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



export const FilterParcelForm = ({ allParcels }) => {
  const [nameSearch, setNameSearch] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const { setParcels, setAlerts, havePolygons, setAlertas, polygons } = useContext(MapsContext)

  const handleSubmit = (e) => {
    e.preventDefault();

    const filtered = allParcels.filter(parcel => {
      const name = parcel.nombre_parcela || parcel.name_parcel || parcel.name || '';
      const matchesName = name.toLowerCase().includes(nameSearch.toLowerCase());
      const matchesCrop = !selectedOption || selectedOption.value === "" || parcel.id_cultivo === selectedOption.value;
      return matchesName && matchesCrop;
    });

    setParcels(filtered);

    const allowedParcelIds = new Set(filtered.map(p => p.id || p.uid_parcel));
    setAlerts(prevAlerts => prevAlerts.filter(alert => allowedParcelIds.has(alert.uid_parcel)));
    havePolygons(filtered);
  };

  
  const handleReset = () => {
    setNameSearch('');
    setSelectedOption(null);
    setParcels(allParcels);
    havePolygons(allParcels);
    setAlerts([]); // Si quieres restaurar todas las alertas originales, deberías guardar el estado inicial en otro lado
    setAlertas(alerts.filter(a=>a.alerta_helada || a.alerta_inundacion || a.alerta_plaga || a.alerta_sequia ));
    setPolygons
    }
  

  return (
    <form onSubmit={handleSubmit} className="filter-form-container" style={{ display: 'flex', gap: '15px', padding: '20px', alignItems: 'center' }}>
      <div style={{ flex: 1 }}>
        <input
          type="text"
          placeholder="Nombre de parcela"
          value={nameSearch}
          onChange={(e) => setNameSearch(e.target.value)}
          style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ flex: 1 }}>
        <Select
          id="cultivo"
          options={options}
          value={selectedOption}
          onChange={setSelectedOption}
          placeholder="Selecciona un cultivo"
          isSearchable={true}
          isClearable={true}
        />
      </div>

      <button type="submit" className="login-button" style={{ padding: '8px 20px', cursor: 'pointer' }}>
        Buscar
      </button>

      <button type="button" onClick={handleReset} style={{ padding: '8px', background: 'none', border: 'none', color: 'gray', cursor: 'pointer' }}>
        Limpiar
      </button>
    </form>
  );
};