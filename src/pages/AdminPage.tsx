import React, { useState } from 'react';
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
  UserPlus,
  Users
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsuarioLogado, logout } from '../api/auth';
import './AdminPage.css';

const users = [
  { name: 'Brendon', email: 'brendon@gmail.com', role: 'Prestador', status: 'Ativo' },
  { name: 'Sabrina Carvalho', email: 'sabrina@nexus.tech', role: 'Prestador', status: 'Ativo' },
  { name: 'Nexus Global Systems', email: 'ops@nexus.global', role: 'Cliente', status: 'Em análise' },
  { name: 'Flow State Dynamics', email: 'finance@flow.dev', role: 'Cliente', status: 'Ativo' },
];

const services = [
  { title: 'Nexus-Tech UI Design', owner: 'Sabrina Carvalho', value: 'R$ 8.500,00', status: 'Em andamento' },
  { title: 'API Gateway Integration', owner: 'Brendon', value: 'R$ 12.200,00', status: 'Em andamento' },
  { title: 'Cloud Infrastructure Setup', owner: 'Lucas Costa', value: 'R$ 6.900,00', status: 'Pausado' },
];

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

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
              <input placeholder="Buscar usuários, serviços ou transações" />
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
            <strong>1.248</strong>
            <small>+18% neste mês</small>
          </article>
          <article>
            <Activity size={22} />
            <span>Serviços ativos</span>
            <strong>342</strong>
            <small>91% com entrega no prazo</small>
          </article>
          <article>
            <BarChart3 size={22} />
            <span>Receita mensal</span>
            <strong>R$ 64.2K</strong>
            <small>+22% comparado ao mês anterior</small>
          </article>
          <article>
            <CheckCircle2 size={22} />
            <span>Aprovações pendentes</span>
            <strong>12</strong>
            <small>4 prestadores aguardando revisão</small>
          </article>
        </section>

        <div className="admin-grid">
          <section className="admin-panel wide">
            <div className="admin-panel-title">
              <div>
                <h2>Usuários recentes</h2>
                <p>Contas cadastradas e status de validação.</p>
              </div>
              <button>
                <UserPlus size={16} />
                Novo usuário
              </button>
            </div>

            <div className="admin-table">
              <div className="admin-table-row head">
                <span>Nome</span>
                <span>E-mail</span>
                <span>Perfil</span>
                <span>Status</span>
              </div>
              {users.map(user => (
                <div className="admin-table-row" key={user.email}>
                  <strong>{user.name}</strong>
                  <span>{user.email}</span>
                  <span>{user.role}</span>
                  <em className={user.status === 'Ativo' ? 'active' : ''}>{user.status}</em>
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
              <div><span>API</span><strong>Online</strong></div>
              <div><span>Banco SQLite</span><strong>Pronto</strong></div>
              <div><span>Blob imagens</span><strong>Pendente</strong></div>
              <div><span>Autenticação</span><strong>Ativa</strong></div>
            </div>
          </section>
        </div>

        <section className="admin-panel">
          <div className="admin-panel-title">
            <div>
              <h2>Serviços em acompanhamento</h2>
              <p>Projetos importantes para revisão administrativa.</p>
            </div>
          </div>

          <div className="admin-service-list">
            {services.map(service => (
              <article key={service.title}>
                <div>
                  <h3>{service.title}</h3>
                  <p>Responsável: {service.owner}</p>
                </div>
                <strong>{service.value}</strong>
                <span>{service.status}</span>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminPage;
