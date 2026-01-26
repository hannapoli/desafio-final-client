import { Route, Routes, Navigate } from 'react-router';

import { AppLayout } from '../pages/templates/AppLayout';
import { PublicLayout } from '../pages/templates/PublicLayout';
import { AuthLayout } from '../pages/templates/AuthLayout';

import {
  HomePage, LoginPage, ConsultantFields, DirectorFields, ConsultantReports, RegisterPage, ProducerDashboard, DistributorDashboard, ConsultantDashboard, AnalystDashboard, DirectorDashboard, ProducerLayout, DistributorLayout, ConsultantLayout, AnalystLayout, DirectorLayout, ProducerSeeFields, ProducerManageFields, ProducerFieldInfo, ProducerReports, DirectorReports
} from '../pages';

import { Chats } from '../components/Chats';
import { PrivateRoutes } from './PrivateRoutes';

export const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= ZONA PÚBLICA ================= */}
      <Route element={<PublicLayout />}>
        <Route path='/' element={<HomePage />} />
      </Route>

      {/* ================= AUTH (SIN NAV) ================= */}
      <Route element={<AuthLayout />}>
        <Route path='/auth/login' element={<LoginPage />} />
        <Route path='/auth/register' element={<RegisterPage />} />
      </Route>

      {/* ================= ZONA CON HEADER / NAV ================= */}
      <Route element={<AppLayout />}>

        {/* ---------- PRODUCER ---------- */}
        <Route
          path='/producer'
          element={
            <PrivateRoutes allowedRoles={['productor']}>
              <ProducerLayout />
            </PrivateRoutes>
          }
        >
          <Route path='dashboard' element={<ProducerDashboard />} />
          <Route path='fields/all' element={<ProducerSeeFields />} />
          <Route path='fields/manage' element={<ProducerManageFields />} />
          <Route path='fields/:id' element={<ProducerFieldInfo />} />
          <Route path='messages' element={<Chats />} />
          <Route path='reports' element={<ProducerReports />} />
        </Route>

        {/* ---------- CONSULTANT ---------- */}
        <Route
          path='/consultant'
          element={
            <PrivateRoutes allowedRoles={['asesor']}>
              <ConsultantLayout />
            </PrivateRoutes>
          }
        >
          <Route path='dashboard' element={<ConsultantDashboard />} />
          <Route path='messages' element={<Chats />} />
          <Route path='reports' element={<ConsultantReports />} />
          <Route path='fields' element={<ConsultantFields />} />
        </Route>

        {/* ---------- ANALYST ---------- */}
        <Route
          path='/analyst'
          element={
            <PrivateRoutes allowedRoles={['analista']}>
              <AnalystLayout />
            </PrivateRoutes>
          }
        >
          <Route path='dashboard' element={<AnalystDashboard />} />
          <Route path='messages' element={<Chats />} />
        </Route>

        {/* ---------- DIRECTOR ---------- */}
        <Route
          path='/director'
          element={
            <PrivateRoutes allowedRoles={['director']}>
              <DirectorLayout />
            </PrivateRoutes>
          }
        >
          <Route path='dashboard' element={<DirectorDashboard />} />
          <Route path='fields' element={<DirectorFields />} />
          <Route path='messages' element={<Chats />} />
          <Route path='reports' element={<DirectorReports />} />
        </Route>

        {/* ---------- DISTRIBUTOR ---------- */}
        <Route
          path='/distributor'
          element={
            <PrivateRoutes allowedRoles={['distribuidor']}>
              <DistributorLayout />
            </PrivateRoutes>
          }
        >
          <Route path='dashboard' element={<DistributorDashboard />} />
          <Route path='messages' element={<Chats />} />
        </Route>

      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path='*' element={<Navigate to='/' />} />

    </Routes>
  );
};
