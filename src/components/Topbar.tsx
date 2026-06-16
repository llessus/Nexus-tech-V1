import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Bell, Settings, MessageSquare, DollarSign, UserCheck, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsuarioLogado } from '../api/auth';
import { getNotifications, markAllAsRead, getUnreadCount, timeAgo, Notification } from '../utils/notifications';
import './Topbar.css';

interface TopbarProps {
  onShowContratacoes?: () => void;
  onSearch?: (query: string) => void;
  onPublicarProjeto?: () => void;
}

const Topbar: React.FC<TopbarProps> = ({ onShowContratacoes, onSearch, onPublicarProjeto }) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const usuario = getUsuarioLogado();
  const initials = usuario?.nome
    ? usuario.nome
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase()
    : '';

  // Refresh notifications every 2 seconds
  useEffect(() => {
    const refresh = () => {
      setNotifications(getNotifications());
      setUnreadCount(getUnreadCount());
    };
    refresh();
    const interval = setInterval(refresh, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenNotifications = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markAllAsRead();
      setTimeout(() => {
        setNotifications(getNotifications());
        setUnreadCount(0);
      }, 300);
    }
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare size={14} />;
      case 'payment': return <DollarSign size={14} />;
      case 'hire': return <UserCheck size={14} />;
      default: return <Info size={14} />;
    }
  };

  const getNotifColor = (type: string) => {
    switch (type) {
      case 'message': return 'blue';
      case 'payment': return 'green';
      case 'hire': return 'cyan';
      default: return 'gray';
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    onSearch?.(val);
  };

  const handleLogoClick = () => {
    if (usuario) {
      if (usuario.tipoConta === 'prestador') {
        navigate('/provider');
      } else {
        navigate('/dashboard');
      }
    } else {
      navigate('/');
    }
  };

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
        <div className="dash-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          Nexus-Tech
        </div>
        <nav className="dash-nav-links hidden-mobile">
          <a href="#" className="active" onClick={(e) => { e.preventDefault(); navigate('/dashboard'); }}>Marketplace</a>
        </nav>
      </div>


      <div className="dash-search-container hidden-mobile">
        <Search className="dash-search-icon" size={18} />
        <input
          type="text"
          placeholder="Buscar talentos, tecnologias ou projetos..."
          className="dash-search-input"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="dash-actions">
        {usuario?.tipoConta === 'cliente' ? (
          <div className="hidden-mobile" style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              className="auth-submit-btn" 
              style={{ padding: '0.5rem 1rem', marginTop: 0, width: 'auto' }}
              onClick={onShowContratacoes}
            >
              Serviços Contratados
            </button>
            <button 
              style={{ 
                padding: '0.5rem 1rem', marginTop: 0, width: 'auto',
                background: 'transparent', border: '1px solid #00e5ff', color: '#00e5ff',
                borderRadius: '0.5rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={onPublicarProjeto}
            >
              Publicar Projeto
            </button>
          </div>
        ) : (
          <button 
            className="auth-submit-btn hidden-mobile" 
            style={{ padding: '0.5rem 1rem', marginTop: 0, width: 'auto' }}
            onClick={() => navigate('/provider')}
          >
            Meu Painel
          </button>
        )}
        
        <div style={{ position: 'relative' }}>
          <button 
            className="dash-action-btn"
            onClick={handleOpenNotifications}
          >
            <Bell size={20} />
            {unreadCount > 0 && <div className="notification-dot"></div>}
          </button>

          {/* Notification Dropdown Overlay */}
          {showNotifications && (
            <div className="notifications-dropdown">
              <div className="notifications-header">
                <h3>Notificações</h3>
                <span className="notifications-count">
                  {unreadCount > 0 ? `${unreadCount} Nova${unreadCount > 1 ? 's' : ''}` : 'Todas lidas'}
                </span>
              </div>
              <div className="notifications-list">
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#71717a', fontSize: '0.8rem' }}>
                    Nenhuma notificação ainda.
                  </div>
                ) : (
                  notifications.slice(0, 6).map(n => (
                    <div key={n.id} className={`notification-item ${!n.read ? 'unread' : ''}`}>
                      <div className={`notification-icon-wrapper ${getNotifColor(n.type)}`}>
                        {getNotifIcon(n.type)}
                      </div>
                      <div className="notification-content">
                        <p><strong>{n.title}</strong> {n.description}</p>
                        <span className="notification-time">{timeAgo(n.timestamp)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="notifications-footer">
                {notifications.length > 0 ? 'Ver todas as notificações' : 'Suas notificações aparecerão aqui'}
              </div>
            </div>
          )}
        </div>

        <button className="dash-action-btn" onClick={() => navigate('/settings')}><Settings size={20} /></button>
        {usuario ? (
          <div 
            className="dash-avatar-iniciais" 
            onClick={() => navigate('/profile')}
            style={{ cursor: 'pointer', padding: 0, overflow: 'hidden' }}
          >
            {usuario.avatarUrl ? (
              <img src={usuario.avatarUrl} alt={usuario.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initials
            )}
          </div>
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop" 
            alt="User Avatar" 
            className="dash-avatar" 
            onClick={() => navigate('/profile')}
            style={{ cursor: 'pointer' }}
          />
        )}
      </div>
    </header>
  );
};

export default Topbar;
