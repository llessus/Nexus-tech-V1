import React, { useEffect, useState } from 'react';
import { 
  MapPin, 
  Globe, 
  CheckCircle,
  Star
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { obterTalentoPorId, Talento } from '../api/talentos';
import './TalentProfilePage.css';
import './DashboardPage.css'; // Reusing topbar styles

const TalentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [talent, setTalent] = useState<Talento | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    obterTalentoPorId(Number(id))
      .then(data => {
        setTalent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar talento:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="profile-container">
        <Topbar />
        <main className="profile-main" style={{ textAlign: 'center', padding: '5rem', color: '#a1a1aa' }}>
          Carregando informações do talento...
        </main>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="profile-container">
        <Topbar />
        <main className="profile-main" style={{ textAlign: 'center', padding: '5rem', color: '#a1a1aa' }}>
          <h2>Talento não encontrado</h2>
          <button className="btn-cyan" onClick={() => navigate('/dashboard')} style={{ marginTop: '1.5rem', width: 'auto', display: 'inline-flex' }}>
            Voltar ao Marketplace
          </button>
        </main>
      </div>
    );
  }

  // Simular notas consistentes por ID
  const rating = 4.8 + (talent.id % 3) * 0.1;
  const location = talent.id % 2 === 0 ? "Remoto" : "São Paulo";
  const numReviews = 45 + (talent.id * 13) % 80;
  const numCompletedProjects = 15 + (talent.id * 17) % 50;

  return (
    <div className="profile-container">
      <Topbar />

      <main className="profile-main">
        {/* Header Block */}
        <div className="profile-header-card">
          <div className="profile-header-left">
            <div className="profile-avatar-wrapper">
              <img 
                src={talent.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop"} 
                alt={talent.nome} 
                className="profile-avatar"
              />
              <div className="profile-verified-badge">
                <CheckCircle size={16} />
              </div>
            </div>
            
            <div className="profile-info">
              <h1>{talent.nome}</h1>
              <div className="profile-level-tag">NÍVEL ESPECIALISTA</div>
              <div className="profile-role">{talent.role}</div>
              
              <div className="profile-meta">
                <div className="profile-meta-item">
                  <MapPin size={16} /> {location}
                </div>
                <div className="profile-meta-item">
                  <Globe size={16} /> Português, Inglês
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button 
              className="btn-outline"
              onClick={() => navigate(`/chat?talentoId=${talent.id}`)}
            >
              Enviar Mensagem
            </button>
            <button className="btn-cyan" onClick={() => navigate(`/hire/${talent.id}`)}>Contratar Talento</button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="profile-stat-label">AVALIAÇÃO DOS CLIENTES</div>
            <div className="profile-stat-value">
              {rating.toFixed(1)}
              <div className="profile-stars">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star 
                    key={i} 
                    size={20} 
                    fill={i <= Math.round(rating) ? "currentColor" : "none"} 
                    color={i <= Math.round(rating) ? "currentColor" : "#52525b"} 
                  />
                ))}
              </div>
            </div>
            <div className="profile-stat-sub">({numReviews} avaliações)</div>
          </div>
          
          <div className="profile-stat-card">
            <div className="profile-stat-label">PROJETOS CONCLUÍDOS</div>
            <div className="profile-stat-value">{numCompletedProjects}</div>
            <div className="profile-stat-sub highlight">+3 este mês</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-label">TEMPO DE RESPOSTA</div>
            <div className="profile-stat-value">&lt; 2h</div>
            <div className="profile-stat-sub">Top 5% no Nexus-Tech</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-label">TAXA DE RETENÇÃO</div>
            <div className="profile-stat-value">96%</div>
            <div className="profile-stat-sub">Parcerias de longo prazo</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="profile-content-grid">
          {/* Left Column */}
          <div>
            <div className="profile-section-title">Sobre Mim</div>
            <div className="profile-about-text">
              <p>{talent.bio || `Olá! Sou ${talent.nome}, especialista na área de ${talent.role}. Foco em trazer soluções com alta performance e agilidade para acelerar produtos digitais.`}</p>
            </div>

            <div className="profile-portfolio-header">
              <div className="profile-section-title" style={{margin: 0, border: 'none'}}>Portfólio</div>
              <a href="#" className="profile-portfolio-link">Ver Todos os Projetos</a>
            </div>

            <div className="profile-portfolio-grid">
              <div className="profile-portfolio-item">
                <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop" alt="Project 1" />
              </div>
              <div className="profile-portfolio-item">
                <img src="https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=800&auto=format&fit=crop" alt="Project 2" />
              </div>
              <div className="profile-portfolio-item large">
                <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop" alt="Project 3" />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="profile-sidebar-card">
              <div className="profile-sidebar-title">Habilidades</div>
              <div className="profile-skills-tags">
                {talent.skills.map(skill => (
                  <span key={skill} className="profile-skill-tag">{skill}</span>
                ))}
              </div>

              <div className="profile-info-row">
                <span className="profile-info-label">Valor Hora</span>
                <span className="profile-info-value">R$ {talent.hourlyRate}/h</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Disponibilidade</span>
                <span className="profile-info-value">30h / semana</span>
              </div>
              <div className="profile-info-row" style={{marginBottom: 0}}>
                <span className="profile-info-label">Último Login</span>
                <span className="profile-info-value">Ativo agora</span>
              </div>
            </div>

            <div className="profile-sidebar-card">
              <div className="profile-sidebar-title">Formação Acadêmica</div>
              <div className="profile-timeline">
                <div className="profile-timeline-item">
                  <div className="profile-timeline-title">Especialização Avançada</div>
                  <div className="profile-timeline-subtitle">Nexus Academy</div>
                  <div className="profile-timeline-date">2022 - 2023</div>
                </div>
                <div className="profile-timeline-item" style={{marginBottom: 0}}>
                  <div className="profile-timeline-title">Tecnologia da Informação</div>
                  <div className="profile-timeline-subtitle">Universidade Parceira</div>
                  <div className="profile-timeline-date">2018 - 2021</div>
                </div>
              </div>
            </div>

            <div className="profile-sidebar-card profile-testimonial">
              <div className="profile-test-user">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt="Marcos V." className="profile-test-avatar" />
                <div>
                  <div className="profile-test-name">Marcos V.</div>
                  <div className="profile-test-role">CTO @ CyberSystems</div>
                </div>
              </div>
              <div className="profile-test-quote">
                "{talent.nome.split(' ')[0]} superou as expectativas do nosso time de produto. Entrega profissional extremamente no prazo e com maestria técnica."
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TalentProfilePage;
