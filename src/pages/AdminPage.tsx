import React, { useState, useEffect } from 'react';
import {
  Activity,
  ArrowLeft,
  BarChart3,
  Bell,
  Briefcase,
  CheckCircle2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsuarioLogado, logout } from '../api/auth';
import { obterDadosAdmin, AdminData } from '../api/admin';
import './AdminPage.css';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dadosAdmin, setDadosAdmin] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Proibir acesso de não-admins
  useEffect(() => {
    if (!usuario || usuario.tipoConta !== 'admin') {
      navigate('/');
    }
  }, [usuario, navigate]);

  const carregarDados = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await obterDadosAdmin();
      setDadosAdmin(data);
    } catch (err) {
      console.error(err);
      setError('Erro ao carregar dados do painel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Formatação de Moeda BRL
  const formatBRL = (val: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(val);
  };

  if (loading) {
    return (
      <div className="admin-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', flexDirection: 'column' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #00e5ff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ color: '#00e5ff', fontWeight: 800 }}>Carregando painel de controle...</span>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !dadosAdmin) {
    return (
      <div className="admin-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ color: '#ef4444', fontWeight: 800 }}>{error || 'Não foi possível carregar os dados.'}</p>
        <button 
          onClick={carregarDados} 
          style={{ background: '#00e5ff', border: 0, padding: '0.6rem 1.2rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 900, color: '#000' }}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  const { stats, usuarios, contratacoes, servicos } = dadosAdmin;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <button
          type="button"
          className="admin-back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <button className="admin-brand" onClick={() => navigate('/')}>
          <ShieldCheck size={22} />
          <span>Nexus Admin</span>
        </button>

        <nav>
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'usuarios', label: 'Usuários', icon: <Users size={18} /> },
            { id: 'servicos', label: 'Serviços', icon: <Briefcase size={18} /> },
            { id: 'financeiro', label: 'Financeiro', icon: <CreditCard size={18} /> },
            { id: 'config', label: 'Configurações', icon: <Settings size={18} /> },
          ].map(item => (
            <button
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => {
                if (item.id === 'config') {
                  navigate('/settings');
                } else {
                  setActiveTab(item.id);
                  setSearchQuery('');
                }
              }}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <button className="admin-logout" onClick={handleLogout}>
          <LogOut size={18} />
          Sair
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>Administração</span>
            <h1>Controle da plataforma</h1>
          </div>

          <div className="admin-top-actions">
            <label>
              <Search size={16} />
              <input 
                placeholder="Buscar nesta aba..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
            <button aria-label="Notificações">
              <Bell size={18} />
              <i />
            </button>
            <div className="admin-profile">
              <strong>{usuario?.nome || 'Admin'}</strong>
              <small>{usuario?.email || 'admin@nexus.tech'}</small>
            </div>
          </div>
        </header>

        <section className="admin-stats">
          <article>
            <Users size={22} />
            <span>Total de usuários</span>
            <strong>{stats.totalUsuarios}</strong>
            <small>+18% neste mês</small>
          </article>
          <article>
            <Activity size={22} />
            <span>Serviços ativos</span>
            <strong>{stats.servicosAtivos}</strong>
            <small>91% com entrega no prazo</small>
          </article>
          <article>
            <BarChart3 size={22} />
            <span>Receita total</span>
            <strong>{formatBRL(stats.totalReceita)}</strong>
            <small>+22% comparado ao mês anterior</small>
          </article>
          <article>
            <CheckCircle2 size={22} />
            <span>Aprovações pendentes</span>
            <strong>{stats.aprovacoesPendentes}</strong>
            <small>Aguardando revisão de perfil</small>
          </article>
        </section>

        {activeTab === 'dashboard' && (
          <>
            <div className="admin-grid">
              <section className="admin-panel wide">
                <div className="admin-panel-title">
                  <div>
                    <h2>Usuários recentes</h2>
                    <p>Contas cadastradas recentemente e status de validação.</p>
                  </div>
                </div>

                <div className="admin-table">
                  <div className="admin-table-row head">
                    <span>Nome</span>
                    <span>E-mail</span>
                    <span>Perfil</span>
                    <span>Status</span>
                  </div>
                  {usuarios.slice(0, 4).map(user => (
                    <div className="admin-table-row" key={user.email}>
                      <strong>{user.nome}</strong>
                      <span>{user.email}</span>
                      <span style={{ textTransform: 'capitalize' }}>
                        {user.tipoConta === 'prestador' ? 'Prestador' : user.tipoConta}
                      </span>
                      <em className="active">Ativo</em>
                    </div>
                  ))}
                </div>
              </section>

              <section className="admin-panel">
                <div className="admin-panel-title">
                  <div>
                    <h2>Saúde do sistema</h2>
                    <p>Monitoramento básico da API.</p>
                  </div>
                </div>

                <div className="admin-health">
                  <div><span>API PostgreSQL</span><strong>Online</strong></div>
                  <div><span>Banco de Dados</span><strong>Pronto</strong></div>
                  <div><span>Servidor</span><strong>Ativo (Vercel)</strong></div>
                  <div><span>Autenticação</span><strong>Ativa</strong></div>
                </div>
              </section>
            </div>

            <section className="admin-panel">
              <div className="admin-panel-title">
                <div>
                  <h2>Contratações em acompanhamento</h2>
                  <p>Projetos e transações importantes para revisão administrativa.</p>
                </div>
              </div>

              <div className="admin-service-list">
                {contratacoes.slice(0, 3).map(contrato => (
                  <article key={contrato.id}>
                    <div>
                      <h3>Contratação #{contrato.id} - {contrato.talentoRole}</h3>
                      <p>Cliente: {contrato.clienteNome} | Prestador: {contrato.talentoNome}</p>
                    </div>
                    <strong>{formatBRL(contrato.valorTotal)}</strong>
                    <span style={{ textTransform: 'capitalize' }}>{contrato.status}</span>
                  </article>
                ))}
                {contratacoes.length === 0 && (
                  <p style={{ color: '#8b8f9a', textAlign: 'center', padding: '1rem' }}>Nenhuma contratação encontrada.</p>
                )}
              </div>
            </section>
          </>
        )}

        {activeTab === 'usuarios' && (
          <section className="admin-panel">
            <div className="admin-panel-title">
              <div>
                <h2>Lista de Usuários</h2>
                <p>Todos os usuários cadastrados na plataforma.</p>
              </div>
            </div>

            <div className="admin-table">
              <div className="admin-table-row head" style={{ gridTemplateColumns: '1.2fr 1.5fr 1fr 1fr' }}>
                <span>Nome</span>
                <span>E-mail</span>
                <span>Tipo de Conta</span>
                <span>Cadastro</span>
              </div>
              {usuarios
                .filter(user => 
                  user.nome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  user.tipoConta.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(user => (
                  <div className="admin-table-row" key={user.id} style={{ gridTemplateColumns: '1.2fr 1.5fr 1fr 1fr' }}>
                    <strong>{user.nome}</strong>
                    <span>{user.email}</span>
                    <span style={{ textTransform: 'capitalize' }}>
                      {user.tipoConta === 'prestador' ? 'Prestador' : user.tipoConta === 'cliente' ? 'Cliente' : 'Administrador'}
                    </span>
                    <span>{new Date(user.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                ))}
            </div>
          </section>
        )}

        {activeTab === 'servicos' && (
          <section className="admin-panel">
            <div className="admin-panel-title">
              <div>
                <h2>Serviços e Portfólios Cadastrados</h2>
                <p>Lista de serviços anunciados pelos prestadores na plataforma.</p>
              </div>
            </div>

            <div className="admin-table">
              <div className="admin-table-row head" style={{ gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr' }}>
                <span>Título do Serviço</span>
                <span>Prestador</span>
                <span>Preço Base</span>
                <span>Data de Criação</span>
              </div>
              {servicos
                .filter(serv => 
                  serv.titulo.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  serv.talentoNome.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(serv => (
                  <div className="admin-table-row" key={serv.id} style={{ gridTemplateColumns: '1.5fr 1.5fr 1fr 1fr' }}>
                    <strong>{serv.titulo}</strong>
                    <span>{serv.talentoNome}</span>
                    <strong style={{ color: '#00e5ff' }}>{formatBRL(serv.preco)}</strong>
                    <span>{new Date(serv.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                ))}
              {servicos.length === 0 && (
                <p style={{ color: '#8b8f9a', textAlign: 'center', padding: '2rem' }}>Nenhum serviço cadastrado.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'financeiro' && (
          <section className="admin-panel">
            <div className="admin-panel-title">
              <div>
                <h2>Transações e Hires</h2>
                <p>Acompanhamento de todos os pagamentos e movimentações do site.</p>
              </div>
            </div>

            <div className="admin-table">
              <div className="admin-table-row head" style={{ gridTemplateColumns: '0.5fr 1.2fr 1.2fr 0.6fr 1fr 0.8fr 1fr' }}>
                <span>ID</span>
                <span>Cliente</span>
                <span>Prestador</span>
                <span>Horas</span>
                <span>Valor Total</span>
                <span>Status</span>
                <span>Data</span>
              </div>
              {contratacoes
                .filter(c => 
                  c.clienteNome.toLowerCase().includes(searchQuery.toLowerCase()) || 
                  c.talentoNome.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  c.status.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(c => (
                  <div className="admin-table-row" key={c.id} style={{ gridTemplateColumns: '0.5fr 1.2fr 1.2fr 0.6fr 1fr 0.8fr 1fr' }}>
                    <strong>#{c.id}</strong>
                    <span>{c.clienteNome}</span>
                    <span>{c.talentoNome}</span>
                    <span>{c.horas}h</span>
                    <strong style={{ color: '#00e5ff' }}>{formatBRL(c.valorTotal)}</strong>
                    <em className={c.status === 'Confirmado' ? 'active' : ''} style={{ textTransform: 'capitalize' }}>
                      {c.status}
                    </em>
                    <span>{new Date(c.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>
                ))}
              {contratacoes.length === 0 && (
                <p style={{ color: '#8b8f9a', textAlign: 'center', padding: '2rem' }}>Nenhuma transação financeira registrada.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
