import { Route, Routes, Navigate } from 'react-router'
import { HomePage, LoginPage, RegisterPage, ProducerDashboard  } from '../pages'

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path='/' element={<HomePage />} />
        <Route path='/auth/register' element={<RegisterPage />} />
        <Route path='/auth/login' element={<LoginPage />} />

        <Route path='/producer/dashboard' element={<ProducerDashboard />} />

        {/* Ruta de redirección */}
        <Route path='/*' element={<Navigate to={'/'} />} />
      </Routes>
    </>
  )
}