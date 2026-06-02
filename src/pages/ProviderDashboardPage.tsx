import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Briefcase,
  Check,
  CreditCard,
  Eye,
  Grid2X2,
  Mail,
  MessageSquare,
  Plus,
  Search,
  Settings,
  Star,
  Wallet,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsuarioLogado, logout } from '../api/auth';
import { obterTalentoPorUsuarioId } from '../api/talentos';
import { listarContratacoesPorTalento } from '../api/contratacoes';
import './ProviderDashboardPage.css';

const projects = [
  { title: 'Nexus-Tech UI Design', client: 'Nexus Global Systems', progress: 75, status: 'Em andamento', team: ['B', 'C'] },
  { title: 'API Gateway Integration', client: 'Flow State Dynamics', progress: 40, status: 'Em andamento', team: ['B'] },
  { title: 'Cloud Infrastructure Setup', client: 'Stellar Cloud', progress: 15, status: 'Pausado', team: [] },
];

const proposals = [
  { name: 'Marina Silveira', role: 'CEO na Americanas', title: 'Dashboard customizado para análise de BI em tempo real.', price: 'R$ 8.500,00' },
  { name: 'Ricardo Mendes', role: 'CTO na King', title: 'Migração de legado para microserviços e Dockerização.', price: 'R$ 12.200,00' },
];

const ProviderDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('painel');
  const usuario = getUsuarioLogado();
  const [propostas, setPropostas] = useState<any[]>([]);
  const [loadingPropostas, setLoadingPropostas] = useState(true);

  React.useEffect(() => {
    const carregarPropostas = async () => {
      if (!usuario?.id) return;
      try {
        const talento = await obterTalentoPorUsuarioId(usuario.id);
        if (talento) {
          const dados = await listarContratacoesPorTalento(talento.id);
          setPropostas(dados);
        }
      } catch (err) {
        console.error('Erro ao buscar propostas:', err);
      } finally {
        setLoadingPropostas(false);
      }
    };
    carregarPropostas();
  }, [usuario?.id]);

  const firstName = useMemo(() => usuario?.nome?.split(' ')[0] || 'Brendon', [usuario]);
  const initials = useMemo(() => {
    if (!usuario?.nome) return 'B';
    return usuario.nome
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  }, [usuario]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="provider-shell">
      <aside className="provider-sidebar">
        <button
          type="button"
          className="provider-back"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <button className="provider-brand" onClick={() => navigate('/')}>
          {firstName}
        </button>

        <nav className="provider-menu">
          {[
            { id: 'painel', label: 'Painel', icon: <Grid2X2 size={18} /> },
            { id: 'projetos', label: 'Projetos', icon: <Briefcase size={18} /> },
            { id: 'financas', label: 'Finanças', icon: <Wallet size={18} /> },
            { id: 'mensagens', label: 'Mensagens', icon: <MessageSquare size={18} /> },
            { id: 'config', label: 'Configurações', icon: <Settings size={18} /> },
          ].map(item => (
            <button
              key={item.id}
              className={`provider-menu-item ${active === item.id ? 'active' : ''}`}
              onClick={() => {
                if (item.id === 'config') {
                  navigate('/settings');
                } else if (item.id === 'mensagens') {
                  navigate('/chat');
                } else {
                  setActive(item.id);
                }
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="provider-profile">
          <div 
            className="provider-avatar"
            onClick={() => navigate('/settings')}
            style={{ cursor: 'pointer', overflow: 'hidden' }}
          >
            {usuario?.avatarUrl ? (
              <img src={usuario.avatarUrl} alt={usuario.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              initials
            )}
          </div>
          <div>
            <strong>{firstName}</strong>
            <span>Prestador de Serviços Tech</span>
          </div>
          <button className="provider-new-project">
            <Plus size={16} />
            Novo Projeto
          </button>
          <button className="provider-logout" onClick={handleLogout}>Sair</button>
        </div>
      </aside>

      <main className="provider-main">
        <header className="provider-topbar">
          <h1>Painel</h1>
          <div className="provider-top-actions">
            <div className="provider-search">
              <Search size={16} />
              <input placeholder="Procurar projetos..." />
            </div>
            <button aria-label="Notificações"><Bell size={18} /></button>
            <button aria-label="Mensagens"><Mail size={18} /></button>
            <div 
              className="provider-small-avatar"
              onClick={() => navigate('/settings')}
              style={{ cursor: 'pointer', overflow: 'hidden' }}
            >
              {usuario?.avatarUrl ? (
                <img src={usuario.avatarUrl} alt={usuario.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                initials
              )}
            </div>
          </div>
        </header>

        <section className="provider-metrics">
          <article>
            <CreditCard size={18} />
            <span>Ganhos no mês</span>
            <strong>R$ 14.850,00</strong>
            <small>+12% em relação ao mês anterior</small>
          </article>
          <article>
            <Star size={18} />
            <span>Avaliação média</span>
            <strong>5.0 <em>/ 5.0</em></strong>
            <small>Baseado em 128 feedbacks ativos</small>
          </article>
          <article>
            <Eye size={18} />
            <span>Visualizações de perfil</span>
            <strong>2.418</strong>
            <small>43 novos interessados esta semana</small>
          </article>
        </section>

        <div 
          className="provider-content-grid"
          style={propostas.length === 0 ? { gridTemplateColumns: '1fr' } : {}}
        >
          <section className="provider-projects">
            <div className="provider-section-title">
              <h2>Projetos Ativos</h2>
              <button>Ver todos</button>
            </div>

            {projects.map(project => (
              <article className={`provider-project-card ${project.status === 'Pausado' ? 'muted' : ''}`} key={project.title}>
                <div className="provider-project-head">
                  <div>
                    <h3>{project.title}</h3>
                    <p>Cliente: {project.client}</p>
                  </div>
                  <span>{project.status}</span>
                </div>
                <div className="provider-progress-line">
                  <label>Progresso</label>
                  <strong>{project.progress}%</strong>
                </div>
                <div className="provider-progress-track">
                  <div style={{ width: `${project.progress}%` }} />
                </div>
                <footer>
                  <div className="provider-team">
                    {project.team.length ? project.team.map(member => <span key={member}>{member}</span>) : <small>Sem equipe ativa</small>}
                  </div>
                  <button>{project.status === 'Pausado' ? 'Retomar Projeto' : 'Ver Detalhes'}</button>
                </footer>
              </article>
            ))}
          </section>

          {propostas.length > 0 && (
            <aside className="provider-proposals">
              <div className="provider-section-title">
                <h2>Novas Propostas</h2>
                <span className="provider-badge">{propostas.length}</span>
              </div>

              {propostas.map(proposal => (
                <article className="provider-proposal-card" key={proposal.id}>
                  <div className="provider-proposal-person">
                    <div className="provider-client-avatar">
                      {proposal.clienteNome ? proposal.clienteNome[0].toUpperCase() : 'C'}
                    </div>
                    <div>
                      <h3>{proposal.clienteNome}</h3>
                      <p>{proposal.clienteEmail}</p>
                    </div>
                  </div>
                  <p>Contratação de serviço: {proposal.horas} horas solicitadas.</p>
                  <strong>
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorTotal)}
                  </strong>
                  <div>
                    <button><Check size={14} /> Aceitar</button>
                    <button className="ghost"><X size={14} /> Recusar</button>
                  </div>
                </article>
              ))}

              <button className="provider-marketplace-card">
                <Plus size={20} />
                <span>Procurando mais oportunidades?</span>
                <strong>Explorar Marketplace</strong>
              </button>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProviderDashboardPage;
