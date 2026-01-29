import { useMapEvents } from 'react-leaflet';
import React from 'react';

export const MapClickHandler = ({ onClickOutside }) => {
   
  useMapEvents({
    click(e) {
      onClickOutside(e);
    },
  });

  return null;
}



