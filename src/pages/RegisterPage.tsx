import React, { useState } from 'react';
import { ArrowLeft, User, AtSign, Lock, ShieldCheck, Terminal, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';
import './Auth.css';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<'empresa' | 'talento'>('empresa');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas precisam ser iguais.');
      return;
    }

    setLoading(true);

    try {
      await register({
        nome: formData.name,
        email: formData.email,
        senha: formData.password,
        tipoConta: accountType === 'talento' ? 'prestador' : 'cliente',
      });
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível criar a conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-bg-glow" />
      
      {/* Top Navigation */}
      <header className="auth-nav">
        <button
          type="button"
          className="auth-back-btn inline"
          onClick={() => navigate(-1)}
          aria-label="Voltar para a página anterior"
          title="Voltar"
        >
          <ArrowLeft size={18} />
        </button>
        <a href="/" className="auth-logo">
          NEXUS-TECH
        </a>
        <div className="auth-nav-center">
          <a href="#marketplace">Marketplace</a>
          <a href="#solucoes">Soluções</a>
          <a href="#empresa">Empresa</a>
        </div>
        <div className="auth-nav-right">
          <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer' }} className="auth-nav-link">
            Entrar
          </button>
          <button className="auth-nav-btn">
            Cadastrar-se
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="auth-main">
        <div className="auth-card">
          <h1 className="auth-title" style={{ textAlign: 'left', marginTop: 0 }}>Criar Conta Nexus</h1>
          <p className="auth-subtitle" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            Junte-se ao ecossistema de soluções tecnológicas de alta performance.
          </p>

          <form onSubmit={handleRegister} className="auth-form">
            <div>
              <div className="auth-field-header">
                <label className="auth-label">NOME COMPLETO</label>
              </div>
              <div className="auth-input-group">
                <User className="auth-input-icon" size={18} />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="auth-input"
                  placeholder="Digite seu nome legal"
                />
              </div>
            </div>

            <div>
              <div className="auth-field-header">
                <label className="auth-label">ENDEREÇO DE E-MAIL</label>
              </div>
              <div className="auth-input-group">
                <AtSign className="auth-input-icon" size={18} />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="auth-input"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div>
              <div className="auth-field-header">
                <label className="auth-label">TIPO DE CONTA</label>
              </div>
              <div className="auth-type-selection">
                <div 
                  className={`auth-type-btn ${accountType === 'talento' ? 'active' : ''}`}
                  onClick={() => setAccountType('talento')}
                >
                  <Bot size={24} />
                  <span className="auth-type-text">Prestador</span>
                </div>
                <div 
                  className={`auth-type-btn ${accountType === 'empresa' ? 'active' : ''}`}
                  onClick={() => setAccountType('empresa')}
                >
                  <Terminal size={24} />
                  <span className="auth-type-text">Cliente</span>
                </div>
              </div>
            </div>

            <div className="auth-row">
              <div>
                <div className="auth-field-header">
                  <label className="auth-label">SENHA</label>
                </div>
                <div className="auth-input-group">
                  <Lock className="auth-input-icon" size={18} />
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    className="auth-input"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <div className="auth-field-header">
                  <label className="auth-label">CONFIRMAR SENHA</label>
                </div>
                <div className="auth-input-group">
                  <ShieldCheck className="auth-input-icon" size={18} />
                  <input
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    className="auth-input"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {error && <p className="auth-error">{error}</p>}

            <button type="submit" className="auth-submit-btn">
              {loading ? 'Criando conta...' : 'Inicializar Registro'}
            </button>
          </form>

          <p className="auth-protocol-text">
            Ao se registrar, você concorda com os <a href="#">Termos do Nexus</a> e a <a href="#">Política de Segurança</a>.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="auth-footer">
        <div>© 2026 NEXUS-TECH</div>
        <div className="status-indicator">
          <div className="status-dot"></div>
          <span>STATUS DO SISTEMA: ONLINE</span>
        </div>
        <div className="auth-footer-links">
          <span>DOCUMENTAÇÃO</span>
          <span>PRIVACIDADE</span>
          <span>SUPORTE</span>
        </div>
      </footer>
    </div>
  );
};

export default RegisterPage;
