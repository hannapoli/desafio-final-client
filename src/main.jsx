import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import './index.css';
import App from './App.jsx';
import 'leaflet/dist/leaflet.css';

import { NavProvider } from './contexts/NavProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <NavProvider>
        <App />
      </NavProvider>
    </BrowserRouter>
  </StrictMode>
)
