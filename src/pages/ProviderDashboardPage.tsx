import React, { useMemo, useState, useEffect } from 'react';
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
  X,
  TrendingUp,
  ArrowUpRight,
  Download,
  Clock,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsuarioLogado, logout } from '../api/auth';
import { obterTalentoPorUsuarioId } from '../api/talentos';
import { listarContratacoesPorTalento, atualizarStatusContratacao } from '../api/contratacoes';
import { obterProjetos, Projeto } from '../utils/projects';
import { addNotification } from '../utils/notifications';
import './ProviderDashboardPage.css';

// Mock de projetos estáticos iniciais do dev
const initialProjects = [
  { title: 'Nexus-Tech UI Design', client: 'Nexus Global Systems', progress: 75, status: 'Em andamento', team: ['B', 'C'] },
  { title: 'API Gateway Integration', client: 'Flow State Dynamics', progress: 40, status: 'Em andamento', team: ['B'] },
  { title: 'Cloud Infrastructure Setup', client: 'Stellar Cloud', progress: 15, status: 'Pausado', team: [] },
];

const ProviderDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('painel'); // 'painel' | 'projetos' | 'financas'
  const usuario = getUsuarioLogado();
  
  // Estados para contratações (propostas/projetos diretos)
  const [contratacoes, setContratacoes] = useState<any[]>([]);
  const [loadingContratacoes, setLoadingContratacoes] = useState(true);
  const [talentoId, setTalentoId] = useState<number | null>(null);

  // Estados para projetos do Mural (localStorage)
  const [muralProjetos, setMuralProjetos] = useState<Projeto[]>([]);
  const [filtroMural, setFiltroMural] = useState('Todos');

  useEffect(() => {
    const carregarDados = async () => {
      if (!usuario?.id) return;
      try {
        const talento = await obterTalentoPorUsuarioId(usuario.id);
        if (talento) {
          setTalentoId(talento.id);
          const dados = await listarContratacoesPorTalento(talento.id);
          setContratacoes(dados);
        }
      } catch (err) {
        console.error('Erro ao buscar dados do desenvolvedor:', err);
      } finally {
        setLoadingContratacoes(false);
      }
    };
    
    carregarDados();
    // Carrega projetos do Mural
    setMuralProjetos(obterProjetos());
  }, [usuario?.id]);

  // Filtra contratações com status "Confirmado" (que vieram da contratação do cliente e precisam de aceitação)
  const propostasPendentes = useMemo(() => {
    return contratacoes.filter(c => c.status === 'Confirmado');
  }, [contratacoes]);

  // Projetos dinâmicos a partir das contratações aceitas pelo dev
  const projetosAtivosDinamicos = useMemo(() => {
    const aceitas = contratacoes.filter(c => c.status === 'Aceito');
    return aceitas.map(c => ({
      title: `Desenvolvimento de Software para ${c.clienteNome}`,
      client: c.clienteNome,
      progress: 0,
      status: 'Em andamento',
      team: [usuario?.nome ? usuario.nome[0].toUpperCase() : 'D']
    }));
  }, [contratacoes, usuario]);

  // Lista combinada de projetos ativos (estáticos + dinâmicos aceitos)
  const todosProjetosAtivos = useMemo(() => {
    return [...projetosAtivosDinamicos, ...initialProjects];
  }, [projetosAtivosDinamicos]);

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

  // Handler para Aceitar Proposta
  const handleAceitar = async (id: number, clienteNome: string, clienteId: number, horas: number) => {
    try {
      await atualizarStatusContratacao(id, 'Aceito');
      
      // Notificação para o Desenvolvedor
      addNotification({
        type: 'system',
        title: 'Proposta Aceita',
        description: `Você aceitou o contrato de ${horas}h com ${clienteNome}. O projeto foi iniciado.`,
      });

      // Notificação para o Cliente (como o localStorage é compartilhado na demo, isso aparece para ambos)
      addNotification({
        type: 'hire',
        title: 'Contratação Iniciada!',
        description: `O desenvolvedor ${usuario?.nome} aceitou seu pedido de contratação.`,
      });

      // Recarrega a lista de contratações do banco
      if (talentoId) {
        const dados = await listarContratacoesPorTalento(talentoId);
        setContratacoes(dados);
      }
    } catch (err) {
      console.error('Erro ao aceitar contratação:', err);
      alert('Erro ao aceitar proposta. Tente novamente.');
    }
  };

  // Handler para Recusar Proposta
  const handleRecusar = async (id: number, clienteNome: string, clienteId: number) => {
    try {
      await atualizarStatusContratacao(id, 'Recusado');
      
      // Notificação para o Desenvolvedor
      addNotification({
        type: 'system',
        title: 'Proposta Recusada',
        description: `Você recusou o pedido de contratação de ${clienteNome}.`,
      });

      // Notificação para o Cliente
      addNotification({
        type: 'system',
        title: 'Contratação Recusada',
        description: `O prestador ${usuario?.nome} declinou o convite de contratação. O estorno está sendo processado.`,
      });

      // Recarrega a lista de contratações do banco
      if (talentoId) {
        const dados = await listarContratacoesPorTalento(talentoId);
        setContratacoes(dados);
      }
    } catch (err) {
      console.error('Erro ao recusar contratação:', err);
      alert('Erro ao recusar proposta. Tente novamente.');
    }
  };

  // Filtro de categorias do Mural de Freelances
  const projetosMuralFiltrados = useMemo(() => {
    if (filtroMural === 'Todos') return muralProjetos;
    return muralProjetos.filter(p => p.tipo === filtroMural);
  }, [muralProjetos, filtroMural]);

  // Cálculos financeiros simulados de alto nível para a aba Finanças
  const dadosFinanceiros = useMemo(() => {
    // Calcula valores baseados nas contratações aceitas + mocks
    const valorAceito = contratacoes
      .filter(c => c.status === 'Aceito')
      .reduce((acc, curr) => acc + curr.valorTotal, 0);

    const valorPendente = contratacoes
      .filter(c => c.status === 'Confirmado')
      .reduce((acc, curr) => acc + curr.valorTotal, 0);

    const totalRecebido = 14850.00 + valorAceito;
    
    return {
      totalRecebido,
      saldoPendente: 3400.00 + valorPendente,
      payoutAgendado: 1250.00,
      totalProjetos: todosProjetosAtivos.length
    };
  }, [contratacoes, todosProjetosAtivos]);

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
          <span className="brand-glow">Nexus</span>
          <span className="brand-sub">Dev</span>
        </button>

        <nav className="provider-menu">
          {[
            { id: 'painel', label: 'Painel', icon: <Grid2X2 size={18} /> },
            { id: 'projetos', label: 'Mural de Freelances', icon: <Briefcase size={18} /> },
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
              {item.id === 'projetos' && muralProjetos.length > 0 && (
                <span className="menu-badge-green">{muralProjetos.length}</span>
              )}
              {item.id === 'painel' && propostasPendentes.length > 0 && (
                <span className="menu-badge-cyan">{propostasPendentes.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="provider-profile">
          <div 
            className="provider-avatar"
            onClick={() => navigate('/profile')}
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
            <span>Desenvolvedor Integrado</span>
          </div>
          <button className="provider-new-project" onClick={() => setActive('projetos')}>
            <Search size={16} />
            Buscar Projetos
          </button>
          <button className="provider-logout" onClick={handleLogout}>Sair</button>
        </div>
      </aside>

      <main className="provider-main">
        <header className="provider-topbar">
          <div className="provider-title-section">
            <span className="provider-subtitle">Workspace do Prestador</span>
            <h1>
              {active === 'painel' && 'Dashboard do Desenvolvedor'}
              {active === 'projetos' && 'Mural de Oportunidades'}
              {active === 'financas' && 'Painel Financeiro'}
            </h1>
          </div>
          <div className="provider-top-actions">
            <div className="provider-search">
              <Search size={16} />
              <input placeholder="Procurar no painel..." />
            </div>
            <button aria-label="Notificações" className="icon-btn-badge">
              <Bell size={18} />
              {propostasPendentes.length > 0 && <span className="active-dot" />}
            </button>
            <button aria-label="Mensagens" onClick={() => navigate('/chat')}><Mail size={18} /></button>
            <div 
              className="provider-small-avatar"
              onClick={() => navigate('/profile')}
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

        {/* ================= TAB 1: PAINEL ================= */}
        {active === 'painel' && (
          <div className="tab-pane fade-in">
            <section className="provider-metrics">
              <article className="metric-card scale-hover">
                <CreditCard size={18} />
                <span>Ganhos Totais</span>
                <strong>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dadosFinanceiros.totalRecebido)}
                </strong>
                <small className="trend-positive">+R$ {contratacoes.filter(c => c.status === 'Aceito').reduce((acc, curr) => acc + curr.valorTotal, 0).toFixed(2)} este mês</small>
              </article>
              <article className="metric-card scale-hover">
                <Star size={18} />
                <span>Avaliação Média</span>
                <strong>5.0 <em>/ 5.0</em></strong>
                <small>100% de clientes satisfeitos</small>
              </article>
              <article className="metric-card scale-hover">
                <Eye size={18} />
                <span>Visualizações do Perfil</span>
                <strong>2.418</strong>
                <small>+43 visitas essa semana</small>
              </article>
            </section>

            <div 
              className="provider-content-grid"
              style={propostasPendentes.length === 0 ? { gridTemplateColumns: '1fr' } : {}}
            >
              <section className="provider-projects">
                <div className="provider-section-title">
                  <h2>Projetos Ativos ({todosProjetosAtivos.length})</h2>
                  <button className="link-hover">Ver todos</button>
                </div>

                <div className="projects-list">
                  {todosProjetosAtivos.map((project, idx) => (
                    <article className={`provider-project-card scale-hover ${project.status === 'Pausado' ? 'muted' : ''}`} key={idx}>
                      <div className="provider-project-head">
                        <div>
                          <h3>{project.title}</h3>
                          <p>Cliente: <strong>{project.client}</strong></p>
                        </div>
                        <span className={`status-badge ${project.status === 'Pausado' ? 'paused' : 'active'}`}>{project.status}</span>
                      </div>
                      <div className="provider-progress-line">
                        <label>Progresso de Entrega</label>
                        <strong>{project.progress}%</strong>
                      </div>
                      <div className="provider-progress-track">
                        <div style={{ width: `${project.progress}%` }} />
                      </div>
                      <footer>
                        <div className="provider-team">
                          {project.team.length ? project.team.map((member, mIdx) => <span key={mIdx}>{member}</span>) : <small>Sem equipe ativa</small>}
                        </div>
                        <button className="btn-cyan-sm">
                          {project.status === 'Pausado' ? 'Retomar' : 'Gerenciar'}
                        </button>
                      </footer>
                    </article>
                  ))}
                </div>
              </section>

              {propostasPendentes.length > 0 && (
                <aside className="provider-proposals animate-slide-in">
                  <div className="provider-section-title">
                    <h2>Novas Propostas</h2>
                    <span className="provider-badge pulse">{propostasPendentes.length}</span>
                  </div>

                  <div className="proposals-list">
                    {propostasPendentes.map(proposal => (
                      <article className="provider-proposal-card scale-hover" key={proposal.id}>
                        <div className="provider-proposal-person">
                          <div className="provider-client-avatar">
                            {proposal.clienteNome ? proposal.clienteNome[0].toUpperCase() : 'C'}
                          </div>
                          <div>
                            <h3>{proposal.clienteNome}</h3>
                            <p>{proposal.clienteEmail}</p>
                          </div>
                        </div>
                        <p style={{ margin: '0.5rem 0', fontSize: '0.8rem', color: '#a1a1aa' }}>
                          Contratação direta: <strong style={{ color: 'white' }}>{proposal.horas} horas</strong> solicitadas para desenvolvimento técnico.
                        </p>
                        <div className="proposal-price-row">
                          <span>Valor Total</span>
                          <strong>
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(proposal.valorTotal)}
                          </strong>
                        </div>
                        <div className="proposal-actions-row">
                          <button 
                            className="btn-accept"
                            onClick={() => handleAceitar(proposal.id, proposal.clienteNome, proposal.clienteId, proposal.horas)}
                          >
                            <Check size={14} /> Aceitar
                          </button>
                          <button 
                            className="btn-decline ghost"
                            onClick={() => handleRecusar(proposal.id, proposal.clienteNome, proposal.clienteId)}
                          >
                            <X size={14} /> Recusar
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>

                  <button className="provider-marketplace-card" onClick={() => setActive('projetos')}>
                    <Plus size={20} />
                    <span>Procurando mais oportunidades?</span>
                    <strong>Explorar Mural de Projetos</strong>
                  </button>
                </aside>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: MURAL DE FREELANCES ================= */}
        {active === 'projetos' && (
          <div className="tab-pane fade-in">
            <div className="mural-header-panel">
              <div className="mural-info">
                <h2>Mural de Oportunidades Freelance</h2>
                <p>Aqui você encontra projetos criados diretamente por clientes da plataforma Nexus Tech. Envie uma proposta ou inicie um chat.</p>
              </div>
              <div className="mural-filters">
                {['Todos', 'Desenvolvimento Web', 'Aplicativo Mobile', 'Design UI/UX', 'DevOps / Infraestrutura'].map(cat => (
                  <button 
                    key={cat} 
                    className={`mural-filter-btn ${filtroMural === cat ? 'active' : ''}`}
                    onClick={() => setFiltroMural(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {projetosMuralFiltrados.length === 0 ? (
              <div className="mural-empty-state">
                <Briefcase size={48} className="muted-icon" />
                <h3>Nenhum projeto encontrado</h3>
                <p>Não há projetos disponíveis nesta categoria no momento. Fique de olho, novos projetos aparecem a qualquer instante!</p>
              </div>
            ) : (
              <div className="mural-grid">
                {projetosMuralFiltrados.map((proj) => (
                  <article key={proj.id} className="mural-card scale-hover">
                    <div className="mural-card-header">
                      <span className="mural-badge-type">{proj.tipo}</span>
                      <span className="mural-time-label">
                        Postado em {new Date(proj.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>

                    <h3 className="mural-card-title">{proj.titulo}</h3>
                    <p className="mural-card-desc">{proj.descricao}</p>

                    <div className="mural-card-techs">
                      {proj.tecnologias.split(',').map((tech, tIdx) => (
                        <span key={tIdx} className="tech-pill">{tech.trim()}</span>
                      ))}
                    </div>

                    <div className="mural-card-details">
                      <div className="detail-item">
                        <DollarSign size={16} />
                        <div>
                          <label>Orçamento</label>
                          <strong>{proj.orcamento}</strong>
                        </div>
                      </div>
                      <div className="detail-item">
                        <Clock size={16} />
                        <div>
                          <label>Prazo Estimado</label>
                          <strong>{proj.prazo}</strong>
                        </div>
                      </div>
                      <div className="detail-item">
                        <Calendar size={16} />
                        <div>
                          <label>Cliente</label>
                          <strong>{proj.clienteNome}</strong>
                        </div>
                      </div>
                    </div>

                    <div className="mural-card-footer">
                      <button 
                        className="btn-propose"
                        onClick={() => {
                          navigate(`/chat?usuarioId=${proj.clienteId}&nome=${encodeURIComponent(proj.clienteNome)}&email=${encodeURIComponent(proj.clienteEmail)}&tipoConta=cliente`);
                        }}
                      >
                        <MessageSquare size={16} />
                        Fazer Proposta / Chat
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 3: FINANÇAS ================= */}
        {active === 'financas' && (
          <div className="tab-pane fade-in">
            <section className="financas-summary">
              <div className="financas-card primary-glow scale-hover">
                <div className="financas-card-header">
                  <span>Saldo Disponível para Saque</span>
                  <Wallet size={20} color="#00e5ff" />
                </div>
                <h2>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dadosFinanceiros.totalRecebido)}
                </h2>
                <div className="financas-card-footer">
                  <span className="text-muted">Pronto para transferência instantânea</span>
                  <button className="btn-withdraw">Efetuar Saque</button>
                </div>
              </div>

              <div className="financas-card scale-hover">
                <div className="financas-card-header">
                  <span>Valores Pendentes (Em Garantia)</span>
                  <Clock size={20} color="#facc15" />
                </div>
                <h2>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dadosFinanceiros.saldoPendente)}
                </h2>
                <div className="financas-card-footer">
                  <span>Serão liberados na entrega das sprints</span>
                </div>
              </div>

              <div className="financas-card scale-hover">
                <div className="financas-card-header">
                  <span>Próximo Repasse Automático</span>
                  <Calendar size={20} color="#a855f7" />
                </div>
                <h2>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dadosFinanceiros.payoutAgendado)}
                </h2>
                <div className="financas-card-footer">
                  <span>Agendado para 20/06/2026</span>
                </div>
              </div>
            </section>

            <div className="financas-grid-layout">
              <section className="financas-chart-section">
                <div className="section-title-wrapper">
                  <h3>Faturamento Estimado</h3>
                  <TrendingUp size={16} color="#00e5ff" />
                </div>
                <div className="simulated-chart-container">
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar" style={{ height: '40%' }}><span className="bar-tooltip">R$ 4.200</span></div>
                    <label>Mar</label>
                  </div>
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar" style={{ height: '60%' }}><span className="bar-tooltip">R$ 6.800</span></div>
                    <label>Abr</label>
                  </div>
                  <div className="chart-bar-wrapper">
                    <div className="chart-bar" style={{ height: '75%' }}><span className="bar-tooltip">R$ 8.900</span></div>
                    <label>Mai</label>
                  </div>
                  <div className="chart-bar-wrapper active">
                    <div className="chart-bar" style={{ height: '95%' }}><span className="bar-tooltip">R$ 14.850</span></div>
                    <label>Jun (Atual)</label>
                  </div>
                </div>
                <div className="chart-meta-info">
                  <div className="info-badge"><strong>+24%</strong> Crescimento vs Maio</div>
                  <div className="info-badge">Meta Mensal: <strong>92% atingida</strong></div>
                </div>
              </section>

              <section className="financas-invoices-section">
                <div className="section-title-wrapper">
                  <h3>Histórico de Invoices (Faturamento)</h3>
                  <button className="ghost-btn-sm"><Download size={14} /> Baixar Relatório</button>
                </div>

                <div className="invoices-list">
                  {/* Dynamic invoice based on current state */}
                  {contratacoes.map(c => {
                    let invoiceStatus = 'Pendente';
                    let statusClass = 'pending';
                    if (c.status === 'Aceito') {
                      invoiceStatus = 'Processando';
                      statusClass = 'processing';
                    } else if (c.status === 'Recusado') {
                      invoiceStatus = 'Cancelado';
                      statusClass = 'cancelled';
                    }

                    return (
                      <article key={c.id} className="invoice-row scale-hover">
                        <div className="invoice-meta">
                          <strong>Contrato #{c.id}</strong>
                          <span>Cliente: {c.clienteNome}</span>
                        </div>
                        <div className="invoice-date">
                          <span>{new Date(c.createdAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div className="invoice-value">
                          <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(c.valorTotal)}</strong>
                        </div>
                        <div className="invoice-status">
                          <span className={`invoice-badge-status ${statusClass}`}>{invoiceStatus}</span>
                        </div>
                      </article>
                    );
                  })}

                  {/* Static past invoices */}
                  <article className="invoice-row scale-hover">
                    <div className="invoice-meta">
                      <strong>Contrato #9821</strong>
                      <span>Cliente: Marina Silveira (CEO Americanas)</span>
                    </div>
                    <div className="invoice-date">
                      <span>12/06/2026</span>
                    </div>
                    <div className="invoice-value">
                      <strong>R$ 8.500,00</strong>
                    </div>
                    <div className="invoice-status">
                      <span className="invoice-badge-status paid">Pago</span>
                    </div>
                  </article>

                  <article className="invoice-row scale-hover">
                    <div className="invoice-meta">
                      <strong>Contrato #9742</strong>
                      <span>Cliente: Ricardo Mendes (CTO King)</span>
                    </div>
                    <div className="invoice-date">
                      <span>05/06/2026</span>
                    </div>
                    <div className="invoice-value">
                      <strong>R$ 12.200,00</strong>
                    </div>
                    <div className="invoice-status">
                      <span className="invoice-badge-status paid">Pago</span>
                    </div>
                  </article>
                </div>
              </section>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderDashboardPage;
