import React, { useState } from 'react';
import { ArrowLeft, Fingerprint, AtSign, Lock, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getHomeByTipoConta, login } from '../api/auth';
import './Auth.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const usuario = await login({ email, senha: password });
      navigate(getHomeByTipoConta(usuario.tipoConta));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-glow" />
      
      {/* Top Navigation */}
      <header className="auth-nav" style={{ justifyContent: 'center' }}>
        <button
          type="button"
          className="auth-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Voltar para a página anterior"
          title="Voltar"
        >
          <ArrowLeft size={18} />
        </button>
        <a href="/" className="auth-logo">
          <span style={{ border: '2px solid #00e5ff', padding: '2px 4px', borderRadius: '4px', fontSize: '1rem' }}>&#62;_</span>
          NEXUS-TECH
        </a>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className="auth-card">
          <div className="auth-card-icon">
            <Fingerprint size={28} />
          </div>
          
          <h1 className="auth-title">Acesso ao Sistema</h1>
          <p className="auth-subtitle">Autentique-se para acessar o terminal do marketplace.</p>

          <form onSubmit={handleLogin} className="auth-form">
            <div>
              <div className="auth-field-header">
                <label className="auth-label">Vetor de Identidade</label>
              </div>
              <div className="auth-input-group">
                <AtSign className="auth-input-icon" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="auth-input"
                  placeholder="user@nexus-tech.com"
                />
              </div>
            </div>

            <div>
              <div className="auth-field-header">
                <label className="auth-label">Chave de Segurança</label>
                <a href="#" className="auth-forgot">ESQUECEU A SENHA?</a>
              </div>
              <div className="auth-input-group">
                <Lock className="auth-input-icon" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="auth-input"
                  placeholder="••••••••••••"
                />
                <Eye 
                  className="auth-input-icon-right" 
                  size={18} 
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>
            </div>

            <div className="auth-checkbox-group">
              <input type="checkbox" id="keep-connected" />
              <label htmlFor="keep-connected" className="auth-checkbox-label">
                Manter conectado neste terminal
              </label>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit-btn">
              {loading ? 'Validando...' : 'Inicializar Conexão'}
            </button>
          </form>

          <div className="auth-bottom-text">
            Novo por aqui?{' '}
            <button onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} className="auth-link">
              Criar Credenciais
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <div>© 2026 NEXUS-TECH<br/>GLOBAL<br/>VER: 2.0.4-STABLE</div>
        <div className="auth-footer-links">
          <span>PROTOCOLO</span>
          <span>PRIVACIDADE</span>
          <span>AJUDA</span>
        </div>
        <div style={{ width: '100px' }}></div> {/* Spacer for centering links */}
      </footer>
    </div>
  );
};

export default LoginPage;
