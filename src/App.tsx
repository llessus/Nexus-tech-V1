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
import { ProdutosDemo } from './components/ProdutosDemo';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/provider" element={<ProviderDashboardPage />} />
        <Route path="/talent/:id" element={<TalentProfilePage />} />
        <Route path="/hire/:id" element={<HireTalentPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/demo" element={<ProdutosDemo />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
