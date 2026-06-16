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

// Estados para projetos ativos interativos
const ProviderDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState('painel'); // 'painel' | 'projetos' | 'financas' | 'gerenciar-projeto'
  const usuario = getUsuarioLogado();
  
  // Estados para contratações (propostas/projetos diretos)
  const [contratacoes, setContratacoes] = useState<any[]>([]);
  const [loadingContratacoes, setLoadingContratacoes] = useState(true);
  const [talentoId, setTalentoId] = useState<number | null>(null);

  // Estados para projetos do Mural (localStorage)
  const [muralProjetos, setMuralProjetos] = useState<Projeto[]>([]);
  const [filtroMural, setFiltroMural] = useState('Todos');

  // Projetos ativos em localStorage
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    if (!usuario?.id) return;

    // 1. Carrega os projetos ativos do localStorage
    const localKey = `nexus:active_projects_${usuario.id}`;
    let localData = localStorage.getItem(localKey);
    let projectsList = [];

    if (localData) {
      projectsList = JSON.parse(localData);
    } else {
      // Seed inicial de projetos
      projectsList = [
        { 
          id: 'mock-1', 
          title: 'Nexus-Tech UI Design', 
          client: 'Nexus Global Systems', 
          clientEmail: 'contato@nexus.com',
          clientId: 1,
          progress: 75, 
          status: 'Em andamento', 
          team: ['B', 'C'],
          milestones: [
            { id: 1, text: 'Definição do Design System', checked: true },
            { id: 2, text: 'Prototipação das telas principais', checked: true },
            { id: 3, text: 'Validação com usuários', checked: false },
            { id: 4, text: 'Entrega dos assets figma', checked: false }
          ],
          logs: ['[12/06/2026] Projeto iniciado.', '[14/06/2026] Definição de Design System concluída.', '[15/06/2026] Wireframes entregues e aprovados.']
        },
        { 
          id: 'mock-2', 
          title: 'API Gateway Integration', 
          client: 'Flow State Dynamics', 
          clientEmail: 'devs@flowstate.com',
          clientId: 2,
          progress: 40, 
          status: 'Em andamento', 
          team: ['B'],
          milestones: [
            { id: 1, text: 'Mapeamento das rotas', checked: true },
            { id: 2, text: 'Configuração do Kong Gateway', checked: false },
            { id: 3, text: 'Testes de carga e latência', checked: false }
          ],
          logs: ['[10/06/2026] Definição inicial das rotas API concluída.']
        },
        { 
          id: 'mock-3', 
          title: 'Cloud Infrastructure Setup', 
          client: 'Stellar Cloud', 
          clientEmail: 'stellar@cloud.com',
          clientId: 3,
          progress: 15, 
          status: 'Pausado', 
          team: [],
          milestones: [
            { id: 1, text: 'Definição da arquitetura AWS', checked: true },
            { id: 2, text: 'Escrita de scripts Terraform', checked: false }
          ],
          logs: ['[08/06/2026] Infraestrutura inicial configurada.', '[09/06/2026] Pausado aguardando liberação de chaves AWS pelo cliente.']
        },
      ];
      localStorage.setItem(localKey, JSON.stringify(projectsList));
    }

    const carregarDados = async (currentList: any[]) => {
      try {
        const talento = await obterTalentoPorUsuarioId(usuario.id);
        if (talento) {
          setTalentoId(talento.id);
          const dados = await listarContratacoesPorTalento(talento.id);
          setContratacoes(dados);

          // Sincronizar contratações "Aceito" com localStorage de projetos ativos
          const aceitas = dados.filter(c => c.status === 'Aceito');
          let updated = [...currentList];
          let changed = false;

          for (const c of aceitas) {
            const exists = updated.some(p => p.id === `contract-${c.id}`);
            if (!exists) {
              updated.push({
                id: `contract-${c.id}`,
                contractId: c.id,
                title: `Desenvolvimento de Software para ${c.clienteNome}`,
                client: c.clienteNome,
                clientEmail: c.clienteEmail || '',
                clientId: c.clienteId,
                progress: 0,
                status: 'Em andamento',
                team: [usuario.nome ? usuario.nome[0].toUpperCase() : 'D'],
                milestones: [
                  { id: 1, text: 'Kickoff do projeto', checked: false },
                  { id: 2, text: 'Desenvolvimento das Sprints', checked: false },
                  { id: 3, text: 'Entrega final', checked: false }
                ],
                logs: [`[${new Date(c.createdAt).toLocaleDateString('pt-BR')}] Contratação direta aceita. Projeto iniciado com orçamento de R$ ${c.valorTotal.toFixed(2)}`]
              });
              changed = true;
            }
          }

          if (changed) {
            localStorage.setItem(localKey, JSON.stringify(updated));
            setActiveProjects(updated);
          } else {
            setActiveProjects(currentList);
          }
        }
      } catch (err) {
        console.error('Erro ao buscar dados do desenvolvedor:', err);
        setActiveProjects(currentList);
      } finally {
        setLoadingContratacoes(false);
      }
    };

    carregarDados(projectsList);
    // Carrega projetos do Mural
    setMuralProjetos(obterProjetos());
  }, [usuario?.id]);

  // Filtra contratações com status "Confirmado"
  const propostasPendentes = useMemo(() => {
    return contratacoes.filter(c => c.status === 'Confirmado');
  }, [contratacoes]);

  // Métodos de Gerenciamento do Projeto
  const saveProjectChanges = (updatedProj: any) => {
    if (!usuario?.id) return;
    const localKey = `nexus:active_projects_${usuario.id}`;
    const localData = localStorage.getItem(localKey);
    if (localData) {
      const list = JSON.parse(localData);
      const idx = list.findIndex((p: any) => p.id === updatedProj.id);
      if (idx !== -1) {
        list[idx] = updatedProj;
        localStorage.setItem(localKey, JSON.stringify(list));
        setActiveProjects(list);
      }
    }
  };

  const handleUpdateProgress = (progress: number) => {
    if (!selectedProject) return;
    const updated = { ...selectedProject, progress };
    setSelectedProject(updated);
    saveProjectChanges(updated);
  };

  const handleToggleMilestone = (milestoneId: number) => {
    if (!selectedProject) return;
    const updatedMilestones = selectedProject.milestones.map((m: any) => {
      if (m.id === milestoneId) {
        return { ...m, checked: !m.checked };
      }
      return m;
    });

    const autoCheckInput = document.getElementById('auto-progress-checkbox') as HTMLInputElement;
    const isAutoChecked = autoCheckInput ? autoCheckInput.checked : true;
    let progress = selectedProject.progress;
    if (isAutoChecked && updatedMilestones.length > 0) {
      const checkedCount = updatedMilestones.filter((m: any) => m.checked).length;
      progress = Math.round((checkedCount / updatedMilestones.length) * 100);
    }

    const updated = { 
      ...selectedProject, 
      milestones: updatedMilestones,
      progress 
    };
    setSelectedProject(updated);
    saveProjectChanges(updated);
  };

  const handleDeleteMilestone = (milestoneId: number) => {
    if (!selectedProject) return;
    const updatedMilestones = selectedProject.milestones.filter((m: any) => m.id !== milestoneId);

    const autoCheckInput = document.getElementById('auto-progress-checkbox') as HTMLInputElement;
    const isAutoChecked = autoCheckInput ? autoCheckInput.checked : true;
    let progress = selectedProject.progress;
    if (isAutoChecked && updatedMilestones.length > 0) {
      const checkedCount = updatedMilestones.filter((m: any) => m.checked).length;
      progress = Math.round((checkedCount / updatedMilestones.length) * 100);
    } else if (updatedMilestones.length === 0) {
      progress = 0;
    }

    const updated = { 
      ...selectedProject, 
      milestones: updatedMilestones,
      progress 
    };
    setSelectedProject(updated);
    saveProjectChanges(updated);
  };

  const handleAddMilestone = (text: string) => {
    if (!selectedProject) return;
    const newId = selectedProject.milestones.length > 0 
      ? Math.max(...selectedProject.milestones.map((m: any) => m.id)) + 1 
      : 1;

    const newMilestone = { id: newId, text, checked: false };
    const updatedMilestones = [...selectedProject.milestones, newMilestone];

    const autoCheckInput = document.getElementById('auto-progress-checkbox') as HTMLInputElement;
    const isAutoChecked = autoCheckInput ? autoCheckInput.checked : true;
    let progress = selectedProject.progress;
    if (isAutoChecked && updatedMilestones.length > 0) {
      const checkedCount = updatedMilestones.filter((m: any) => m.checked).length;
      progress = Math.round((checkedCount / updatedMilestones.length) * 100);
    }

    const updated = { 
      ...selectedProject, 
      milestones: updatedMilestones,
      progress 
    };
    setSelectedProject(updated);
    saveProjectChanges(updated);
  };

  const handleAddLog = (logText: string) => {
    if (!selectedProject) return;
    const dateStr = new Date().toLocaleDateString('pt-BR');
    const newLog = `[${dateStr}] ${logText}`;
    const updatedLogs = [newLog, ...(selectedProject.logs || [])];
    
    const updated = { ...selectedProject, logs: updatedLogs };
    setSelectedProject(updated);
    saveProjectChanges(updated);
  };

  const handleToggleProjectStatus = () => {
    if (!selectedProject) return;
    const newStatus = selectedProject.status === 'Pausado' ? 'Em andamento' : 'Pausado';
    const logMsg = `Status do projeto alterado para: ${newStatus}`;
    const dateStr = new Date().toLocaleDateString('pt-BR');
    const newLog = `[${dateStr}] ${logMsg}`;

    const updated = { 
      ...selectedProject, 
      status: newStatus,
      logs: [newLog, ...(selectedProject.logs || [])]
    };
    setSelectedProject(updated);
    saveProjectChanges(updated);
  };

  const handleCompleteProject = () => {
    if (!selectedProject) return;
    const updatedMilestones = selectedProject.milestones.map((m: any) => ({ ...m, checked: true }));
    const dateStr = new Date().toLocaleDateString('pt-BR');
    const logMsg = `[${dateStr}] Projeto concluído e entregue com sucesso!`;

    const updated = {
      ...selectedProject,
      status: 'Concluído',
      progress: 100,
      milestones: updatedMilestones,
      logs: [logMsg, ...(selectedProject.logs || [])]
    };
    setSelectedProject(updated);
    saveProjectChanges(updated);

    addNotification({
      type: 'system',
      title: 'Projeto Entregue!',
      description: `O projeto "${selectedProject.title}" foi concluído e notificado ao cliente.`,
    });
  };

  const handleGerenciarProjeto = (project: any) => {
    setSelectedProject(project);
    setActive('gerenciar-projeto');
  };

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

        // Adicionar novo projeto ao localStorage imediatamente
        const localKey = `nexus:active_projects_${usuario?.id}`;
        const localData = localStorage.getItem(localKey);
        let projectsList = localData ? JSON.parse(localData) : [];
        
        const c = dados.find(x => x.id === id);
        if (c && !projectsList.some((p: any) => p.id === `contract-${c.id}`)) {
          const newProj = {
            id: `contract-${c.id}`,
            contractId: c.id,
            title: `Desenvolvimento de Software para ${c.clienteNome}`,
            client: c.clienteNome,
            clientEmail: c.clienteEmail || '',
            clientId: c.clienteId,
            progress: 0,
            status: 'Em andamento',
            team: [usuario?.nome ? usuario.nome[0].toUpperCase() : 'D'],
            milestones: [
              { id: 1, text: 'Kickoff do projeto', checked: false },
              { id: 2, text: 'Desenvolvimento das Sprints', checked: false },
              { id: 3, text: 'Entrega final', checked: false }
            ],
            logs: [`[${new Date().toLocaleDateString('pt-BR')}] Contratação direta aceita. Projeto iniciado com orçamento de R$ ${c.valorTotal.toFixed(2)}`]
          };
          const newList = [...projectsList, newProj];
          localStorage.setItem(localKey, JSON.stringify(newList));
          setActiveProjects(newList);
        }
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
      totalProjetos: activeProjects.length
    };
  }, [contratacoes, activeProjects]);

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
                  <h2>Projetos Ativos ({activeProjects.length})</h2>
                  <button className="link-hover">Ver todos</button>
                </div>

                <div className="projects-list">
                  {activeProjects.map((project, idx) => (
                    <article className={`provider-project-card scale-hover ${project.status === 'Pausado' ? 'muted' : ''} ${project.status === 'Concluído' ? 'completed-card' : ''}`} key={project.id || idx}>
                      <div className="provider-project-head">
                        <div>
                          <h3>{project.title}</h3>
                          <p>Cliente: <strong>{project.client}</strong></p>
                        </div>
                        <span className={`status-badge ${project.status === 'Pausado' ? 'paused' : project.status === 'Concluído' ? 'completed' : 'active'}`}>{project.status}</span>
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
                          {project.team && project.team.length ? project.team.map((member, mIdx) => <span key={mIdx}>{member}</span>) : <small>Sem equipe ativa</small>}
                        </div>
                        <button 
                          className="btn-cyan-sm"
                          onClick={() => handleGerenciarProjeto(project)}
                        >
                          {project.status === 'Pausado' ? 'Retomar' : project.status === 'Concluído' ? 'Visualizar' : 'Gerenciar'}
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

        {/* ================= TAB 4: GERENCIAR PROJETO ================= */}
        {active === 'gerenciar-projeto' && selectedProject && (
          <div className="tab-pane fade-in gerenciar-projeto-container">
            <button 
              className="btn-voltar-painel" 
              onClick={() => {
                // Recarrega a lista do localStorage para garantir a sincronia de tudo
                const localKey = `nexus:active_projects_${usuario?.id}`;
                const localData = localStorage.getItem(localKey);
                if (localData) {
                  setActiveProjects(JSON.parse(localData));
                }
                setActive('painel');
                setSelectedProject(null);
              }}
            >
              <ArrowLeft size={16} />
              Voltar ao Painel
            </button>

            <div className="projeto-detalhes-grid">
              {/* Coluna Principal: Milestones & Diário */}
              <div className="projeto-col-main">
                <div className="projeto-card-header-detalhe">
                  <div className="projeto-title-block">
                    <span className="projeto-badge-status-top">{selectedProject.status}</span>
                    <h2>{selectedProject.title}</h2>
                    <p>Cliente: <strong>{selectedProject.client}</strong> {selectedProject.clientEmail && `(${selectedProject.clientEmail})`}</p>
                  </div>
                </div>

                {/* Card de Progresso */}
                <div className="projeto-gerenciar-card">
                  <div className="gerenciar-card-head">
                    <h3>Progresso de Entrega</h3>
                    <span className="progress-value-huge">{selectedProject.progress}%</span>
                  </div>
                  <div className="provider-progress-track large-track" style={{ height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${selectedProject.progress}%`, background: 'linear-gradient(90deg, #0077ff, #00e5ff)', height: '100%', borderRadius: '999px', boxShadow: '0 0 10px rgba(0, 229, 255, 0.5)' }} />
                  </div>
                  
                  {/* Slider Interativo de Progresso */}
                  {selectedProject.status !== 'Concluído' && (
                    <div className="slider-container-gerenciar" style={{ marginTop: '1.5rem' }}>
                      <label className="settings-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Ajustar Progresso Manualmente</span>
                        <span>{selectedProject.progress}%</span>
                      </label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={selectedProject.progress} 
                        onChange={(e) => handleUpdateProgress(Number(e.target.value))}
                        className="progress-range-slider"
                        style={{ width: '100%', cursor: 'pointer', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px' }}
                      />
                    </div>
                  )}
                </div>

                {/* Card de Milestones */}
                <div className="projeto-gerenciar-card">
                  <div className="gerenciar-card-head" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3>Metas & Sprints (Milestones)</h3>
                      <p style={{ fontSize: '11px', color: '#71717a', margin: '0.2rem 0 0' }}>Marcar metas concluídas ajusta o progresso automaticamente</p>
                    </div>
                    {selectedProject.status !== 'Concluído' && (
                      <div className="auto-progress-toggle" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input 
                          type="checkbox" 
                          id="auto-progress-checkbox" 
                          defaultChecked={true}
                          style={{ cursor: 'pointer' }}
                        />
                        <label htmlFor="auto-progress-checkbox" style={{ fontSize: '11px', color: '#a1a1aa', cursor: 'pointer', userSelect: 'none' }}>Auto-calcular progresso</label>
                      </div>
                    )}
                  </div>

                  <div className="milestones-checklist" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {selectedProject.milestones && selectedProject.milestones.length > 0 ? (
                      selectedProject.milestones.map((m: any) => (
                        <div key={m.id} className={`milestone-item-row ${m.checked ? 'checked' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                          <input 
                            type="checkbox" 
                            checked={m.checked}
                            onChange={() => handleToggleMilestone(m.id)}
                            disabled={selectedProject.status === 'Concluído'}
                            style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                          />
                          <span className="milestone-text" style={{ flex: 1, fontSize: '13px', color: m.checked ? '#71717a' : '#fff', textDecoration: m.checked ? 'line-through' : 'none' }}>{m.text}</span>
                          {selectedProject.status !== 'Concluído' && (
                            <button 
                              className="btn-delete-milestone" 
                              onClick={() => handleDeleteMilestone(m.id)}
                              title="Excluir meta"
                              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.6 }}
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="no-data-msg" style={{ fontSize: '12px', color: '#71717a' }}>Nenhuma milestone cadastrada.</p>
                    )}
                  </div>

                  {selectedProject.status !== 'Concluído' && (
                    <div className="add-milestone-form" style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <input 
                        type="text" 
                        id="new-milestone-input"
                        className="settings-input" 
                        placeholder="Adicionar nova meta ou sprint..." 
                        style={{ flex: 1, marginTop: 0 }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            if (val.trim()) {
                              handleAddMilestone(val.trim());
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn-cyan-sm" 
                        style={{ height: '38px', whiteSpace: 'nowrap' }}
                        onClick={() => {
                          const input = document.getElementById('new-milestone-input') as HTMLInputElement;
                          if (input && input.value.trim()) {
                            handleAddMilestone(input.value.trim());
                            input.value = '';
                          }
                        }}
                      >
                        + Adicionar
                      </button>
                    </div>
                  )}
                </div>

                {/* Card do Diário de Bordo (Logs) */}
                <div className="projeto-gerenciar-card">
                  <h3>Diário de Bordo & Sprints</h3>
                  <p style={{ fontSize: '11px', color: '#71717a', marginBottom: '1rem' }}>Registre atividades e avanços do projeto para consulta e transparência</p>

                  <div className="timeline-logs" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '1rem', marginLeft: '0.5rem', marginTop: '1rem' }}>
                    {selectedProject.logs && selectedProject.logs.length > 0 ? (
                      selectedProject.logs.map((log: string, lIdx: number) => (
                        <div key={lIdx} className="timeline-log-item" style={{ position: 'relative' }}>
                          <div className="log-marker" style={{ position: 'absolute', left: 'calc(-1rem - 4.5px)', top: '6px', width: '8px', height: '8px', borderRadius: '50%', background: '#00e5ff', boxShadow: '0 0 6px #00e5ff' }} />
                          <div className="log-content-wrapper" style={{ fontSize: '12px', color: '#d4d4d8', lineHeight: '1.4' }}>
                            <p style={{ margin: 0 }}>{log}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="no-data-msg" style={{ fontSize: '12px', color: '#71717a' }}>Nenhum registro ainda.</p>
                    )}
                  </div>

                  {selectedProject.status !== 'Concluído' && (
                    <div className="add-log-form" style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                      <input 
                        type="text" 
                        id="new-log-input"
                        className="settings-input" 
                        placeholder="Ex: Finalizei o mockup das telas..." 
                        style={{ flex: 1, marginTop: 0 }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            const val = (e.target as HTMLInputElement).value;
                            if (val.trim()) {
                              handleAddLog(val.trim());
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <button 
                        type="button" 
                        className="btn-cyan-sm"
                        style={{ height: '38px', whiteSpace: 'nowrap' }}
                        onClick={() => {
                          const input = document.getElementById('new-log-input') as HTMLInputElement;
                          if (input && input.value.trim()) {
                            handleAddLog(input.value.trim());
                            input.value = '';
                          }
                        }}
                      >
                        Registrar
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Coluna Lateral: Ações e Detalhes */}
              <div className="projeto-col-side" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="projeto-gerenciar-card bg-highlight" style={{ background: 'rgba(0,229,255,0.02)', border: '1px solid rgba(0,229,255,0.1)' }}>
                  <h3>Ações Rápidas</h3>
                  <div className="side-actions-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem' }}>
                    {selectedProject.status !== 'Concluído' && (
                      <button 
                        className="btn-side-action"
                        onClick={handleToggleProjectStatus}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <Clock size={16} />
                        {selectedProject.status === 'Pausado' ? 'Retomar Projeto' : 'Pausar Projeto'}
                      </button>
                    )}

                    {selectedProject.status !== 'Concluído' && (
                      <button 
                        className="btn-side-action highlight-complete"
                        onClick={handleCompleteProject}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem 1rem', background: '#00e5ff', border: 'none', borderRadius: '8px', color: '#000', fontSize: '13px', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <Check size={16} />
                        Finalizar Projeto (100%)
                      </button>
                    )}

                    {selectedProject.clientId && (
                      <button 
                        className="btn-side-action"
                        onClick={() => {
                          navigate(`/chat?usuarioId=${selectedProject.clientId}&nome=${encodeURIComponent(selectedProject.client)}&email=${encodeURIComponent(selectedProject.clientEmail || '')}&tipoConta=cliente`);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', color: '#fff', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }}
                      >
                        <MessageSquare size={16} />
                        Abrir Chat com Cliente
                      </button>
                    )}
                  </div>
                </div>

                <div className="projeto-gerenciar-card">
                  <h3>Informações de Faturamento</h3>
                  <div className="info-billing-detail" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#a1a1aa' }}>Orçamento:</span>
                      <strong>R$ 8.500,00</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#a1a1aa' }}>Método:</span>
                      <strong>Nexus Escrow Garantia</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#a1a1aa' }}>Liberação:</span>
                      <strong>Na conclusão do projeto</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProviderDashboardPage;
