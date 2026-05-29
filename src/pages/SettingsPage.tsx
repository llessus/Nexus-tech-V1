import React, { useState } from 'react';
import { Camera, LogOut, Save, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { getUsuarioLogado, logout } from '../api/auth';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();
  const [activeTab, setActiveTab] = useState('perfil');

  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [ocupacao, setOcupacao] = useState('');
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [salvo, setSalvo] = useState(false);

  if (!usuario) {
    navigate('/login');
    return null;
  }

  const handleSalvar = () => {
    // Atualiza o nome no localStorage se foi alterado
    const atualizado = { ...usuario, nome };
    localStorage.setItem('nexus:user', JSON.stringify(atualizado));
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Gera iniciais do nome para o avatar
  const iniciais = nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  const tipoLabel =
    usuario.tipoConta === 'prestador'
      ? 'Prestador'
      : usuario.tipoConta === 'admin'
      ? 'Administrador'
      : 'Cliente';

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
                    <div className="settings-avatar-iniciais">
                      {iniciais || <UserCircle size={40} />}
                    </div>
                    <div className="settings-avatar-edit">
                      <Camera size={16} />
                    </div>
                  </div>
                  <div className="settings-avatar-info">
                    <h3>{nome}</h3>
                    <p>{tipoLabel} · {usuario.email}</p>
                  </div>
                  <button
                    type="button"
                    className="settings-logout-btn"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sair da conta
                  </button>
                </div>

                <div className="settings-form-grid">
                  <div className="settings-form-group">
                    <label className="settings-label">Nome de Exibição</label>
                    <input
                      type="text"
                      className="settings-input"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-label">Ocupação Profissional</label>
                    <input
                      type="text"
                      className="settings-input"
                      value={ocupacao}
                      onChange={(e) => setOcupacao(e.target.value)}
                      placeholder="Ex: Full Stack Developer"
                    />
                  </div>
                  
                  <div className="settings-form-group full-width">
                    <label className="settings-label">Biografia</label>
                    <textarea
                      className="settings-textarea"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Conte um pouco sobre você e sua experiência..."
                    ></textarea>
                  </div>
                </div>

                <h3 className="settings-section-title">Links Sociais</h3>
                <div className="settings-form-grid">
                  <div className="settings-form-group">
                    <label className="settings-label">LinkedIn</label>
                    <input
                      type="text"
                      className="settings-input"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="linkedin.com/in/seu-perfil"
                    />
                  </div>
                  <div className="settings-form-group">
                    <label className="settings-label">GitHub</label>
                    <input
                      type="text"
                      className="settings-input"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="github.com/seu-usuario"
                    />
                  </div>
                  <div className="settings-form-group full-width">
                    <label className="settings-label">Portfólio URL</label>
                    <input
                      type="text"
                      className="settings-input"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="https://seu-portfolio.com"
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                  {salvo && <span className="settings-saved-msg">✓ Salvo com sucesso!</span>}
                  <button
                    className="auth-submit-btn"
                    style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}
                    onClick={handleSalvar}
                  >
                    <Save size={18} />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'conta' && (
              <div className="settings-card">
                <h2 className="settings-card-title">Conta & Segurança</h2>
                <div className="settings-form-grid">
                  <div className="settings-form-group full-width">
                    <label className="settings-label">E-mail</label>
                    <input type="email" className="settings-input" value={usuario.email} disabled />
                  </div>
                  <div className="settings-form-group full-width">
                    <label className="settings-label">Tipo de Conta</label>
                    <input type="text" className="settings-input" value={tipoLabel} disabled />
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'notificacoes' || activeTab === 'pagamento') && (
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
