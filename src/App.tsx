import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminPage from './pages/AdminPage';
import DashboardPage from './pages/DashboardPage';
import ProviderDashboardPage from './pages/ProviderDashboardPage';
import TalentProfilePage from './pages/TalentProfilePage';
import HireTalentPage from './pages/HireTalentPage';
import SettingsPage from './pages/SettingsPage';
import ClientProfilePage from './pages/ClientProfilePage';
import ProfileRedirect from './pages/ProfileRedirect';
import ChatPage from './pages/ChatPage';
import { ProdutosDemo } from './components/ProdutosDemo';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute allowedRoles={['cliente', 'admin']}>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/provider" 
          element={
            <ProtectedRoute allowedRoles={['prestador', 'admin']}>
              <ProviderDashboardPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/talent/:id" 
          element={
            <ProtectedRoute>
              <TalentProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/client/:id" 
          element={
            <ProtectedRoute>
              <ClientProfilePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <ProfileRedirect />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/hire/:id" 
          element={
            <ProtectedRoute allowedRoles={['cliente', 'admin']}>
              <HireTalentPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/demo" element={<ProdutosDemo />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
