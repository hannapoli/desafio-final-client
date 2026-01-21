// IMPORTACIONES PROPIAS
import { ViewerParcelProducer } from "../components/ViewerParcelProducer"

export const ProducerDashboard = () => {

  const imageUrl = "https://res.cloudinary.com/dbi5thf23/image/upload/v1769010767/bloem_field_sunrise_4k_e3mlls.jpg"
  // Pendiente fetch para traer la imagen
  const points = { 
    sky: { x: 2045, y: 513 }, 
    soil: { x: 2047, y: 1523 }, 
    crop: { x: 1024, y: 900 }, };
  return (
    <>
    <ViewerParcelProducer imageUrl={imageUrl} points={points}/>
    </>
  )
}
