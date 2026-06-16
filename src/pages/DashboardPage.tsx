import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Star,
  Bookmark,
  Wallet,
  SlidersHorizontal,
  Send,
  X,
  CheckCircle2,
  FileText,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { getUsuarioLogado } from '../api/auth';
import { listarTalentos, Talento } from '../api/talentos';
import { listarContratacoesPorCliente, ContratacaoComTalento } from '../api/contratacoes';
import { addNotification } from '../utils/notifications';
import { salvarProjeto } from '../utils/projects';
import './DashboardPage.css';

const CATEGORIES = ["Todos", "Desenvolvedores", "Designers", "DevOps", "Mobile", "QA"];

const SKILL_OPTIONS = [
  "React", "TypeScript", "Node.js", "Python", "Java", "Go",
  "Docker", "Kubernetes", "AWS", "Figma", "Flutter", "React Native",
  "PostgreSQL", "MongoDB", "GraphQL", "Cypress", "Jest", "Selenium"
];

const capitalize = (str: string) => {
  return str.replace(/\b\w/g, c => c.toUpperCase());
};

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [talents, setTalents] = useState<Talento[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const usuario = getUsuarioLogado();
  const firstName = usuario?.nome?.split(' ')[0] || '';

  // Advanced filter states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [minRate, setMinRate] = useState('');
  const [maxRate, setMaxRate] = useState('');

  // Estados para o Modal de Serviços Contratados
  const [showContratacoesModal, setShowContratacoesModal] = useState(false);
  const [contratacoes, setContratacoes] = useState<ContratacaoComTalento[]>([]);
  const [loadingContratacoes, setLoadingContratacoes] = useState(false);

  // Estados para o Modal de Publicar Projeto
  const [showPublicarModal, setShowPublicarModal] = useState(false);
  const [projetoPublicado, setProjetoPublicado] = useState(false);
  const [projetoTitulo, setProjetoTitulo] = useState('');
  const [projetoDescricao, setProjetoDescricao] = useState('');
  const [projetoOrcamento, setProjetoOrcamento] = useState('');
  const [projetoTecnologias, setProjetoTecnologias] = useState('');
  const [projetoPrazo, setProjetoPrazo] = useState('');
  const [projetoTipo, setProjetoTipo] = useState('Desenvolvimento Web');

  useEffect(() => {
    listarTalentos()
      .then(data => {
        setTalents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao listar talentos:', err);
        setLoading(false);
      });
  }, []);

  const handleOpenContratacoes = () => {
    setShowContratacoesModal(true);
    if (usuario) {
      setLoadingContratacoes(true);
      listarContratacoesPorCliente(usuario.id)
        .then(data => {
          // Filter out dismissed recusado contracts
          const dismissedRaw = localStorage.getItem('nexus:dismissed_recusados');
          const dismissedIds: number[] = dismissedRaw ? JSON.parse(dismissedRaw) : [];
          const filtered = data.filter(c => !(c.status === 'Recusado' && dismissedIds.includes(c.id)));
          setContratacoes(filtered);
          setLoadingContratacoes(false);

          // Mark current recusados as dismissed
          const currentRecusados = filtered.filter(c => c.status === 'Recusado');
          if (currentRecusados.length > 0) {
            const newDismissed = [...dismissedIds, ...currentRecusados.map(c => c.id)];
            localStorage.setItem('nexus:dismissed_recusados', JSON.stringify(newDismissed));
          }
        })
        .catch(err => {
          console.error('Erro ao buscar contratações:', err);
          setLoadingContratacoes(false);
        });
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSelectedSkills([]);
    setMinRate('');
    setMaxRate('');
    setShowAdvancedFilters(false);
  };

  const filteredTalents = talents.filter((talent) => {
    // Category filter
    if (activeCategory !== 'Todos') {
      const role = talent.role.toUpperCase();
      if (activeCategory === 'Desenvolvedores') {
        if (!(role.includes('DEVELOPER') || role.includes('STACK') || role.includes('FRONT') || role.includes('BACK') || role.includes('ENGINEER'))) return false;
      }
      if (activeCategory === 'Designers') {
        if (!(role.includes('DESIGNER') || role.includes('UX') || role.includes('UI'))) return false;
      }
      if (activeCategory === 'DevOps') {
        if (!(role.includes('DEVOPS') || role.includes('INFRA') || role.includes('CLOUD') || role.includes('SYSADMIN'))) return false;
      }
      if (activeCategory === 'Mobile') {
        if (!(role.includes('MOBILE') || role.includes('IOS') || role.includes('ANDROID') || role.includes('FLUTTER') || role.includes('REACT NATIVE'))) return false;
      }
      if (activeCategory === 'QA') {
        if (!(role.includes('QA') || role.includes('TEST') || role.includes('QUALITY'))) return false;
      }
    }

    // Search filter: matches name, role, or skills
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = talent.nome.toLowerCase().includes(q);
      const matchesRole = talent.role.toLowerCase().includes(q);
      const matchesSkills = talent.skills.some(s => s.toLowerCase().includes(q));
      if (!matchesName && !matchesRole && !matchesSkills) return false;
    }

    // Advanced: skill filter
    if (selectedSkills.length > 0) {
      const talentSkillsLower = talent.skills.map(s => s.toLowerCase());
      const hasMatch = selectedSkills.some(s => talentSkillsLower.includes(s.toLowerCase()));
      if (!hasMatch) return false;
    }

    // Advanced: rate filter
    if (minRate && talent.hourlyRate < Number(minRate)) return false;
    if (maxRate && talent.hourlyRate > Number(maxRate)) return false;

    return true;
  });

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="dash-container">
      <Topbar onShowContratacoes={handleOpenContratacoes} onSearch={setSearchQuery} onPublicarProjeto={() => setShowPublicarModal(true)} />

      <main className="dash-main">
        {/* Welcome Banner */}
        <section className="dash-hero">
          <div className="dash-hero-overlay" />
          <div className="dash-hero-content">
            <h1 className="dash-hero-title">
              {firstName ? `Olá, ${capitalize(firstName)}!` : 'Acelere seu próximo'}<br/>
              {firstName ? 'Acelere seu projeto com a ' : 'projeto com a '}
              <span className="dash-hero-title-highlight">Nexus</span>
            </h1>
            <p className="dash-hero-desc">
              Encontre profissionais validados e com histórico comprovado<br/>
              de entregas em alta performance técnica.
            </p>
            
            <div className="dash-hero-stats">
              <div className="dash-hero-avatars">
                <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="Avatar" className="dash-hero-avatar" />
                <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" alt="Avatar" className="dash-hero-avatar" />
                <img src="https://images.unsplash.com/photo-1610216705422-caa3fcb6d158?q=80&w=100&auto=format&fit=crop" alt="Avatar" className="dash-hero-avatar" />
                <div className="dash-hero-avatar dash-hero-avatar-cyan">+1K</div>
              </div>
              <span className="dash-hero-stats-text">Profissionais Prontos</span>
            </div>
          </div>
        </section>

        {/* Filters/Categories */}
        <div className="dash-filters-row">
          <div className="dash-categories">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`dash-filter-btn ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <button 
            className={`dash-advanced-btn ${showAdvancedFilters ? 'active' : ''}`}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          >
            <SlidersHorizontal size={16} />
            <span>Filtros Avançados</span>
            {selectedSkills.length > 0 && (
              <span className="dash-filter-badge">{selectedSkills.length}</span>
            )}
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {showAdvancedFilters && (
          <div className="dash-advanced-panel">
            <div className="dash-advanced-section">
              <label className="dash-advanced-label">Filtrar por Tecnologia</label>
              <div className="dash-skill-chips">
                {SKILL_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    className={`dash-skill-chip ${selectedSkills.includes(skill) ? 'active' : ''}`}
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div className="dash-advanced-section">
              <label className="dash-advanced-label">Faixa de Valor/Hora (R$)</label>
              <div className="dash-rate-range">
                <input 
                  type="number" 
                  placeholder="Mín" 
                  className="dash-rate-input"
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value)}
                />
                <span style={{ color: '#52525b' }}>até</span>
                <input 
                  type="number" 
                  placeholder="Máx" 
                  className="dash-rate-input"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value)}
                />
              </div>
            </div>
            <div className="dash-advanced-actions">
              <button className="dash-clear-filters" onClick={clearFilters}>Limpar Filtros</button>
              <span style={{ color: '#71717a', fontSize: '0.8rem' }}>
                {filteredTalents.length} resultado{filteredTalents.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        )}

        {/* Talent Grid / State display */}
        {loading ? (
          <div className="dash-loading" style={{ textAlign: 'center', padding: '5rem', color: '#a1a1aa', fontSize: '1.1rem', fontWeight: 500 }}>
            Carregando talentos do banco...
          </div>
        ) : filteredTalents.length === 0 ? (
          <div className="dash-no-results" style={{ textAlign: 'center', padding: '5rem', color: '#a1a1aa', fontSize: '1.1rem', fontWeight: 500 }}>
            Nenhum talento encontrado{searchQuery ? ` para "${searchQuery}"` : ' nesta categoria'}.
            {(selectedSkills.length > 0 || minRate || maxRate) && (
              <button onClick={clearFilters} style={{ display: 'block', margin: '1rem auto', color: '#00e5ff', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                Limpar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="dash-grid">
            {filteredTalents.map((talent) => {
              // Simular notas consistentes por ID
              const rating = 4.8 + (talent.id % 3) * 0.1;
              const location = talent.id % 2 === 0 ? "Remoto" : "São Paulo";
              
              return (
                <div key={talent.id} className="talent-card">
                  <div className="talent-header">
                    <div className="talent-info-left">
                      <img 
                        src={talent.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} 
                        alt={talent.nome} 
                        className="talent-avatar" 
                      />
                      <div>
                        <h3 className="talent-name">{capitalize(talent.nome)}</h3>
                        <p className="talent-role">{talent.role}</p>
                        <div className="talent-rating">
                          <Star size={14} color="#facc15" fill="#facc15" />
                          <span>{rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <Bookmark className="talent-bookmark" size={24} />
                  </div>

                  <div className="talent-meta">
                    <div className="talent-meta-item">
                      <MapPin size={16} />
                      <span>{location}</span>
                    </div>
                    <div className="talent-meta-item">
                      <Wallet size={16} />
                      <span>R$ {talent.hourlyRate}/h</span>
                    </div>
                  </div>

                  <div className="talent-tags">
                    {talent.skills.map(skill => (
                       <span key={skill} className="talent-tag">{skill}</span>
                    ))}
                  </div>

                  <div className="talent-actions">
                    <button className="btn-outline" onClick={() => navigate(`/talent/${talent.id}`)}>Ver Perfil</button>
                    <button className="btn-cyan" onClick={() => navigate(`/hire/${talent.id}`)}>Contratar</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal de Serviços Contratados */}
      {showContratacoesModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#121212', border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1.5rem', width: '90%', maxWidth: '650px', padding: '2rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)', position: 'relative'
          }}>
            <button 
              onClick={() => setShowContratacoesModal(false)}
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none',
                border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
            >
              <X size={24} />
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'white' }}>
              Serviços Contratados
            </h2>
            <p style={{ color: '#71717a', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              Histórico de contratos de desenvolvimento e design que você firmou na plataforma.
            </p>

            <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {loadingContratacoes ? (
                <div style={{ color: '#a1a1aa', textAlign: 'center', padding: '2rem' }}>
                  Buscando contratações...
                </div>
              ) : contratacoes.length === 0 ? (
                <div style={{ color: '#71717a', textAlign: 'center', padding: '3rem' }}>
                  Nenhum serviço contratado até o momento.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {contratacoes.map(c => (
                    <div 
                      key={c.id} 
                      style={{
                        backgroundColor: '#1a1a1a', borderRadius: '1rem', padding: '1.25rem',
                        border: '1px solid rgba(255, 255, 255, 0.03)', display: 'flex',
                        alignItems: 'center', justifyContent: 'space-between', gap: '1rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img 
                          src={c.talentoAvatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80&auto=format&fit=crop"} 
                          alt={c.talentoNome} 
                          style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'white' }}>
                            {c.talentoNome}
                          </h4>
                          <p style={{ fontSize: '0.8rem', color: '#a1a1aa', margin: '0.1rem 0' }}>
                            {c.talentoRole}
                          </p>
                          <span style={{ fontSize: '0.75rem', color: '#71717a' }}>
                            Contratado em {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.25rem' }}>
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '0.35rem', 
                          color: c.status === 'Recusado' ? '#ef4444' : c.status === 'Confirmado' ? '#facc15' : '#10b981', 
                          fontSize: '0.8rem', 
                          fontWeight: 600 
                        }}>
                          <CheckCircle2 size={14} />
                          <span>{c.status}</span>
                        </div>
                        <strong style={{ fontSize: '1rem', color: '#00e5ff' }}>
                          {formatCurrency(c.valorTotal)}
                        </strong>
                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>
                          Carga: {c.horas}h
                        </span>
                        {c.status === 'Recusado' ? (
                          <button
                            onClick={() => {
                              const dismissedRaw = localStorage.getItem('nexus:dismissed_recusados');
                              const dismissedIds: number[] = dismissedRaw ? JSON.parse(dismissedRaw) : [];
                              const newDismissed = [...dismissedIds, c.id];
                              localStorage.setItem('nexus:dismissed_recusados', JSON.stringify(newDismissed));
                              setContratacoes(prev => prev.filter(item => item.id !== c.id));
                            }}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              borderRadius: '0.25rem',
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.7rem',
                              cursor: 'pointer',
                              marginTop: '0.35rem',
                              fontWeight: 600,
                              transition: 'all 0.2s'
                            }}
                          >
                            Descartar Aviso
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setShowContratacoesModal(false);
                              navigate(`/chat?talentoId=${c.talentoId}`);
                            }}
                            style={{
                              background: 'rgba(0, 229, 255, 0.1)',
                              border: '1px solid rgba(0, 229, 255, 0.3)',
                              color: '#00e5ff',
                              borderRadius: '0.25rem',
                              padding: '0.25rem 0.5rem',
                              fontSize: '0.7rem',
                              cursor: 'pointer',
                              marginTop: '0.35rem',
                              fontWeight: 600,
                              transition: 'all 0.2s'
                            }}
                          >
                            Chat com Talento
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                className="btn-cyan" 
                onClick={() => setShowContratacoesModal(false)}
                style={{ width: 'auto', padding: '0.6rem 1.5rem' }}
              >
                Fechar Painel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Publicar Projeto */}
      {showPublicarModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#0a0a0a', border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '1.5rem', width: '90%', maxWidth: '600px', padding: '2.5rem',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.9)', position: 'relative',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <button 
              onClick={() => { setShowPublicarModal(false); setProjetoPublicado(false); }}
              style={{
                position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none',
                border: 'none', color: '#a1a1aa', cursor: 'pointer', display: 'flex', alignItems: 'center'
              }}
            >
              <X size={24} />
            </button>

            {projetoPublicado ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{
                  width: '64px', height: '64px', borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.1)', border: '2px solid rgba(16, 185, 129, 0.3)',
                  display: 'grid', placeItems: 'center', margin: '0 auto 1.5rem', color: '#10b981'
                }}>
                  <Check size={32} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>Projeto Publicado!</h2>
                <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Seu projeto <strong style={{ color: 'white' }}>"{projetoTitulo}"</strong> foi publicado com sucesso.<br/>
                  Profissionais da plataforma serão notificados e poderão enviar propostas.
                </p>
                <button className="btn-cyan" onClick={() => { setShowPublicarModal(false); setProjetoPublicado(false); }} style={{ width: 'auto', padding: '0.7rem 2rem' }}>
                  Voltar ao Marketplace
                </button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                  <div style={{
                    width: '40px', height: '40px', borderRadius: '0.75rem',
                    background: 'rgba(0, 229, 255, 0.1)', display: 'grid', placeItems: 'center', color: '#00e5ff'
                  }}>
                    <FileText size={20} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>Publicar Projeto</h2>
                    <p style={{ color: '#71717a', fontSize: '0.8rem', margin: 0 }}>Descreva o que você precisa e receba propostas de profissionais.</p>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.5rem' }}>
                  {/* Tipo do Projeto */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Tipo do Projeto</label>
                    <select
                      value={projetoTipo}
                      onChange={(e) => setProjetoTipo(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', backgroundColor: '#121212',
                        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.6rem',
                        color: 'white', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <option>Desenvolvimento Web</option>
                      <option>Aplicativo Mobile</option>
                      <option>Design UI/UX</option>
                      <option>DevOps / Infraestrutura</option>
                      <option>QA / Testes</option>
                      <option>Consultoria Técnica</option>
                      <option>Outro</option>
                    </select>
                  </div>

                  {/* Título */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Título do Projeto *</label>
                    <input
                      type="text"
                      placeholder="Ex: Landing page moderna para startup de fintech"
                      value={projetoTitulo}
                      onChange={(e) => setProjetoTitulo(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', backgroundColor: '#121212',
                        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.6rem',
                        color: 'white', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif'
                      }}
                    />
                  </div>

                  {/* Descrição */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>O que você precisa? *</label>
                    <textarea
                      placeholder="Descreva em detalhes o que você precisa. Quanto mais informações, melhores serão as propostas que vai receber..."
                      value={projetoDescricao}
                      onChange={(e) => setProjetoDescricao(e.target.value)}
                      rows={4}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', backgroundColor: '#121212',
                        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.6rem',
                        color: 'white', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif',
                        resize: 'vertical', minHeight: '100px'
                      }}
                    />
                  </div>

                  {/* Tecnologias e Orçamento na mesma linha */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Tecnologias Desejadas</label>
                      <input
                        type="text"
                        placeholder="React, Node.js, Figma..."
                        value={projetoTecnologias}
                        onChange={(e) => setProjetoTecnologias(e.target.value)}
                        style={{
                          width: '100%', padding: '0.75rem 1rem', backgroundColor: '#121212',
                          border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.6rem',
                          color: 'white', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Orçamento Estimado</label>
                      <input
                        type="text"
                        placeholder="R$ 5.000,00"
                        value={projetoOrcamento}
                        onChange={(e) => setProjetoOrcamento(e.target.value)}
                        style={{
                          width: '100%', padding: '0.75rem 1rem', backgroundColor: '#121212',
                          border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.6rem',
                          color: 'white', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif'
                        }}
                      />
                    </div>
                  </div>

                  {/* Prazo */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Prazo de Entrega</label>
                    <select
                      value={projetoPrazo}
                      onChange={(e) => setProjetoPrazo(e.target.value)}
                      style={{
                        width: '100%', padding: '0.75rem 1rem', backgroundColor: '#121212',
                        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '0.6rem',
                        color: 'white', fontSize: '0.9rem', fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      <option value="">Selecione o prazo...</option>
                      <option>Urgente (menos de 1 semana)</option>
                      <option>Curto prazo (1-2 semanas)</option>
                      <option>Médio prazo (2-4 semanas)</option>
                      <option>Longo prazo (mais de 1 mês)</option>
                      <option>Sem prazo definido</option>
                    </select>
                  </div>

                  {/* Botão Publicar */}
                  <button
                    onClick={() => {
                      if (!projetoTitulo.trim() || !projetoDescricao.trim()) {
                        alert('Preencha ao menos o título e a descrição do projeto.');
                        return;
                      }
                      salvarProjeto({
                        tipo: projetoTipo,
                        titulo: projetoTitulo,
                        descricao: projetoDescricao,
                        tecnologias: projetoTecnologias,
                        orcamento: projetoOrcamento || 'A combinar',
                        prazo: projetoPrazo || 'Sem prazo definido',
                        clienteId: usuario?.id || 9999,
                        clienteNome: usuario?.nome || 'Cliente Anônimo',
                        clienteEmail: usuario?.email || 'cliente@nexus.tech'
                      });
                      addNotification({
                        type: 'system',
                        title: 'Projeto Publicado',
                        description: `Seu projeto "${projetoTitulo}" foi publicado. Aguarde propostas dos profissionais.`,
                      });
                      setProjetoPublicado(true);
                      // Limpar formulário
                      setProjetoTitulo('');
                      setProjetoDescricao('');
                      setProjetoTecnologias('');
                      setProjetoOrcamento('');
                      setProjetoPrazo('');
                    }}
                    style={{
                      width: '100%', padding: '0.85rem', background: 'linear-gradient(135deg, #00e5ff, #0077ff)',
                      color: 'black', fontWeight: 700, fontSize: '0.95rem', border: 'none',
                      borderRadius: '0.75rem', cursor: 'pointer', marginTop: '0.5rem',
                      transition: 'transform 0.2s'
                    }}
                  >
                    Publicar Projeto
                  </button>

                  <p style={{ color: '#52525b', fontSize: '0.7rem', textAlign: 'center', margin: 0 }}>
                    Ao publicar, você concorda com os termos de uso da plataforma Nexus Tech.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Action Button (Instagram-style messaging paper airplane) */}
      <button 
        className="fab" 
        onClick={() => navigate('/chat')}
        style={{ 
          background: 'linear-gradient(135deg, #00e5ff, #0077ff)', 
          color: 'black',
          boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)'
        }}
      >
        <Send size={24} style={{ transform: 'rotate(-45deg) translate(2px, -2px)' }} />
      </button>
    </div>
  );
};

export default DashboardPage;
