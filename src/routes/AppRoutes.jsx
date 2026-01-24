import { Route, Routes, Navigate } from 'react-router'
import { HomePage, LoginPage, RegisterPage, ProducerDashboard, DistributorDashboard, ConsultantDashboard, AnalystDashboard, DirectorDashboard, ProducerLayout, DistributorLayout, ConsultantLayout, AnalystLayout, DirectorLayout, ProducerSeeFields, ProducerManageFields, ProducerFieldInfo, ProducerReports, DirectorReports } from '../pages'
import {Chats} from '../components/Chats'
import { PrivateRoutes } from './PrivateRoutes'

export const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route path='/' element={<HomePage />} />
        <Route path='/auth/register' element={<RegisterPage />} />
        <Route path='/auth/login' element={<LoginPage />} />

        {/* Rutas protegidas para cada rol */}
        <Route
          path='/producer'
          element={
            <PrivateRoutes allowedRoles={['productor']}>
              <ProducerLayout />
            </PrivateRoutes>
          }>

          <Route path='dashboard' element={<ProducerDashboard />} />
          <Route path='fields/all' element={<ProducerSeeFields />} />
          <Route path='fields/manage' element={<ProducerManageFields />} />
          <Route path='fields/:id' element={<ProducerFieldInfo />} />
          <Route path='messages' element={<Chats />} />
          <Route path='reports' element={<ProducerReports />} />

        </Route>

        <Route
          path='/consultant'
          element={
            <PrivateRoutes allowedRoles={['asesor']}>
              <ConsultantLayout />
            </PrivateRoutes>
          }>

          <Route path='dashboard' element={<ConsultantDashboard />} />
          <Route path='messages' element={<Chats />} />
        </Route>

        <Route
          path='/analyst'
          element={
            <PrivateRoutes allowedRoles={['analista']}>
              <AnalystLayout />
            </PrivateRoutes>
          }>

          <Route path='dashboard' element={<AnalystDashboard />} />
          <Route path='messages' element={<Chats />} />
        </Route>

        <Route
          path='/director'
          element={
            <PrivateRoutes allowedRoles={['director']}>
              <DirectorLayout />
            </PrivateRoutes>
          }>

          <Route path='dashboard' element={<DirectorDashboard />} />
          <Route path='messages' element={<Chats />} />
          <Route path='reports' element={<DirectorReports />} />
          </Route>
          

        <Route
          path='/distributor'
          element={
            <PrivateRoutes allowedRoles={['distribuidor']}>
              <DistributorLayout />
            </PrivateRoutes>
          }>
          <Route path='dashboard' element={<DistributorDashboard />} />
          <Route path='messages' element={<Chats />} />

        </Route>


        {/* Ruta de redirección */}
        <Route path='/*' element={<Navigate to={'/'} />} />
      </Routes>
    </>
  )
}