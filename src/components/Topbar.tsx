import React, { useState } from 'react';
import { ArrowLeft, Search, Bell, Settings, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsuarioLogado } from '../api/auth';
import './Topbar.css';

interface TopbarProps {
  onShowContratacoes?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onShowContratacoes }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const usuario = getUsuarioLogado();
  const initials = usuario?.nome
    ? usuario.nome
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase()
    : '';

  return (
    <header className="dash-topbar">
      <div className="dash-logo-nav">
        <button
          type="button"
          className="dash-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Voltar para a página anterior"
          title="Voltar"
        >
          <ArrowLeft size={18} />
        </button>
        <div className="dash-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          Nexus-Tech
        </div>
        <nav className="dash-nav-links hidden-mobile">
          <a href="#" className="active" onClick={() => navigate('/dashboard')}>Marketplace</a>
          <a href="#">Talentos</a>
          <a href="#">Serviços</a>
          <a href="#">Analytics</a>
        </nav>
      </div>

      <div className="dash-search-container hidden-mobile">
        <Search className="dash-search-icon" size={18} />
        <input
          type="text"
          placeholder="Buscar talentos, tecnologias ou projetos..."
          className="dash-search-input"
        />
      </div>

      <div className="dash-actions">
        {usuario?.tipoConta === 'cliente' ? (
          <button 
            className="auth-submit-btn hidden-mobile" 
            style={{ padding: '0.5rem 1rem', marginTop: 0, width: 'auto' }}
            onClick={onShowContratacoes}
          >
            Serviços Contratados
          </button>
        ) : (
          <button className="auth-submit-btn hidden-mobile" style={{ padding: '0.5rem 1rem', marginTop: 0, width: 'auto' }}>
            Publicar Projeto
          </button>
        )}
        
        <div style={{ position: 'relative' }}>
          <button 
            className="dash-action-btn"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <div className="notification-dot"></div>
          </button>

          {/* Notification Dropdown Overlay */}
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notificações</h3>
                <span className="notifications-count">2 Novas</span>
              </div>
              <div className="notifications-list">
                <div className="notification-item unread">
                  <div className="notification-icon-wrapper blue">
                    <MessageSquare size={14} />
                  </div>
                  <div className="notification-content">
                    <p><strong>Sabrina Carpinteira</strong> enviou uma mensagem.</p>
                    <span className="notification-time">Há 5 min</span>
                  </div>
                </div>
                <div className="notification-item unread">
                  <div className="notification-icon-wrapper green">
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>$</span>
                  </div>
                  <div className="notification-content">
                    <p>Pagamento aprovado para <strong>Consultoria UX</strong>.</p>
                    <span className="notification-time">Há 2 horas</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div className="notification-icon-wrapper gray">
                    <Settings size={14} />
                  </div>
                  <div className="notification-content">
                    <p>Seu perfil foi atualizado com sucesso.</p>
                    <span className="notification-time">Ontem</span>
                  </div>
                </div>
              </div>
              <div className="notifications-footer">
                Ver todas as notificações
              </div>
            </div>
          )}
        </div>

        <button className="dash-action-btn" onClick={() => navigate('/settings')}><Settings size={20} /></button>
        {usuario ? (
          <div 
            className="dash-avatar-iniciais" 
            onClick={() => navigate('/settings')}
            style={{ cursor: 'pointer' }}
          >
            {initials}
          </div>
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" 
            alt="User Avatar" 
            className="dash-avatar" 
            onClick={() => navigate('/settings')}
            style={{ cursor: 'pointer' }}
          />
        )}
      </div>
    </header>
  );
};

export default Topbar;
