import { Route, Routes, Navigate } from 'react-router';

import { AppLayout } from '../pages/templates/AppLayout';
import { PublicLayout } from '../pages/templates/PublicLayout';
import { AuthLayout } from '../pages/templates/AuthLayout';
import { ChatLayout } from '../pages/templates/ChatLayout';


import {
  HomePage, LoginPage, ConsultantReports, RegisterPage, ProducerDashboard, DistributorDashboard, ConsultantDashboard, AnalystDashboard, DirectorDashboard, ProducerLayout, DistributorLayout, ConsultantLayout, AnalystLayout, DirectorLayout, ProducerSeeFields, ProducerManageFields, ProducerFieldInfo, ProducerReports, DirectorReports
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

      {/* ================= ZONA APP (CON FOOTER) ================= */}
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
          <Route path='reports' element={<ConsultantReports />} />
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
        </Route>

      </Route>

      {/* ================= CHAT (SIN FOOTER) ================= */}
      <Route element={<ChatLayout />}>

        <Route
          path='/producer/messages'
          element={
            <PrivateRoutes allowedRoles={['productor']}>
              <Chats />
            </PrivateRoutes>
          }
        />

        <Route
          path='/consultant/messages'
          element={
            <PrivateRoutes allowedRoles={['asesor']}>
              <Chats />
            </PrivateRoutes>
          }
        />

        <Route
          path='/analyst/messages'
          element={
            <PrivateRoutes allowedRoles={['analista']}>
              <Chats />
            </PrivateRoutes>
          }
        />

        <Route
          path='/director/messages'
          element={
            <PrivateRoutes allowedRoles={['director']}>
              <Chats />
            </PrivateRoutes>
          }
        />

        <Route
          path='/distributor/messages'
          element={
            <PrivateRoutes allowedRoles={['distribuidor']}>
              <Chats />
            </PrivateRoutes>
          }
        />

      </Route>

      {/* ================= FALLBACK ================= */}
      <Route path='*' element={<Navigate to='/' />} />

    </Routes>
  );
};