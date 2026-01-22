import './App.css'
import { Footer } from './components/Footer'
import { AuthProvider } from './contexts/AuthProvider'
import { AppRoutes } from './routes/AppRoutes'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import 'leaflet-draw';
import { MapsProvider } from './contexts/MapsProvider';
window.L = L
function App() {

  return (
    <>
      <AuthProvider>
        <MapsProvider>
          <AppRoutes />
       </MapsProvider>
      </AuthProvider>
      <Footer />
    </>
  )
}

export default App
