import React, { useState } from 'react';
import { Camera, Save } from 'lucide-react';
import Topbar from '../components/Topbar';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('perfil');

  return (
    <div className="settings-container">
      <Topbar />

      <main className="settings-main">
        <div className="settings-header">
          <h1 className="settings-title">Configurações de Perfil</h1>
          <p className="settings-subtitle">Gerencie suas informações pessoais, notificações e segurança da conta.</p>
        </div>

        <div className="settings-grid">
          <div className="settings-menu">
            <button 
              className={`settings-menu-item ${activeTab === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveTab('perfil')}
            >
              Perfil Público
            </button>
            <button 
              className={`settings-menu-item ${activeTab === 'conta' ? 'active' : ''}`}
              onClick={() => setActiveTab('conta')}
            >
              Conta & Segurança
            </button>
            <button 
              className={`settings-menu-item ${activeTab === 'notificacoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notificacoes')}
            >
              Notificações
            </button>
            <button 
              className={`settings-menu-item ${activeTab === 'pagamento' ? 'active' : ''}`}
              onClick={() => setActiveTab('pagamento')}
            >
              Pagamento & Faturamento
            </button>
          </div>

          <div className="settings-content">
            {activeTab === 'perfil' && (
              <div className="settings-card">
                <h2 className="settings-card-title">Informações do Perfil</h2>

                <div className="settings-avatar-section">
                  <div className="settings-avatar-wrapper">
                    <img 
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" 
                      alt="Kendrick Lamar" 
                      className="settings-avatar"
                    />
                    <div className="settings-avatar-edit">
                      <Camera size={16} />
                    </div>
                  </div>
                  <div className="settings-avatar-info">
                    <h3>Kendrick Lamar</h3>
                    <p>São Paulo, SP</p>
                  </div>
                </div>

                <div className="settings-form-grid">
                  <div className="settings-form-group">
                    <label className="settings-label">Nome de Exibição</label>
                    <input type="text" className="settings-input" defaultValue="Kendrick Lamar" />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-label">Ocupação Profissional</label>
                    <input type="text" className="settings-input" defaultValue="Lead UX Designer" />
                  </div>
                  
                  <div className="settings-form-group full-width">
                    <label className="settings-label">Biografia</label>
                    <textarea 
                      className="settings-textarea" 
                      defaultValue="UX/UI Designer apaixonado por criar experiências digitais memoráveis. Especialista em design systems e acessibilidade."
                    ></textarea>
                  </div>
                </div>

                <h3 className="settings-section-title">Links Sociais</h3>
                <div className="settings-form-grid">
                  <div className="settings-form-group">
                    <label className="settings-label">LinkedIn</label>
                    <input type="text" className="settings-input" defaultValue="linkedin.com/in/kendricklamar" />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-label">GitHub</label>
                    <input type="text" className="settings-input" defaultValue="github.com/kendricklamar" />
                  </div>
                  <div className="settings-form-group full-width">
                    <label className="settings-label">Portfólio URL</label>
                    <input type="text" className="settings-input" defaultValue="https://kendrick.design" />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
                  <button className="auth-submit-btn" style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}>
                    <Save size={18} />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            )}

            {activeTab !== 'perfil' && (
              <div className="settings-card">
                <p style={{ color: '#a1a1aa' }}>Esta seção está em desenvolvimento.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
