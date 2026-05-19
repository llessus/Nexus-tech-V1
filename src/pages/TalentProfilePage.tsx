import React from 'react';
import { 
  MapPin, 
  Globe, 
  CheckCircle,
  Star,
  Search,
  Bell,
  Settings
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import './TalentProfilePage.css';
import './DashboardPage.css'; // Reusing topbar styles

const TalentProfilePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <Topbar />

      <main className="profile-main">
        {/* Header Block */}
        <div className="profile-header-card">
          <div className="profile-header-left">
            <div className="profile-avatar-wrapper">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop" 
                alt="Sabrina Carpinteira" 
                className="profile-avatar"
              />
              <div className="profile-verified-badge">
                <CheckCircle size={16} />
              </div>
            </div>
            
            <div className="profile-info">
              <h1>Sabrina<br/>Carpinteira</h1>
              <div className="profile-level-tag">NÍVEL ESPECIALISTA</div>
              <div className="profile-role">Product Designer Senior</div>
              
              <div className="profile-meta">
                <div className="profile-meta-item">
                  <MapPin size={16} /> São Paulo, Brasil
                </div>
                <div className="profile-meta-item">
                  <Globe size={16} /> Português, Inglês, Espanhol
                </div>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button className="btn-outline">Enviar Mensagem</button>
            <button className="btn-cyan" onClick={() => navigate('/hire/1')}>Contratar Talento</button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="profile-stat-label">AVALIAÇÃO DOS CLIENTES</div>
            <div className="profile-stat-value">
              5.0
              <div className="profile-stars">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={20} fill="currentColor" />)}
              </div>
            </div>
            <div className="profile-stat-sub">(124 avaliações)</div>
          </div>
          
          <div className="profile-stat-card">
            <div className="profile-stat-label">PROJETOS CONCLUÍDOS</div>
            <div className="profile-stat-value">184</div>
            <div className="profile-stat-sub highlight">+12 este mês</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-label">TEMPO DE RESPOSTA</div>
            <div className="profile-stat-value">&lt; 2h</div>
            <div className="profile-stat-sub">Top 5% in Nexus-Tech</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-label">TAXA DE RETENÇÃO</div>
            <div className="profile-stat-value">94%</div>
            <div className="profile-stat-sub">Parcerias de longo prazo</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="profile-content-grid">
          {/* Left Column */}
          <div>
            <div className="profile-section-title">Sobre Mim</div>
            <div className="profile-about-text">
              <p>Estrategista de design com mais de 10 anos de experiência transformando visões complexas em interfaces intuitivas e memoráveis. Minha abordagem combina rigor analítico com estética editorial, focada em produtos que não apenas funcionam, mas encantam e geram valor de negócio real.</p>
              <br/>
              <p>Especializada em Ecossistemas Digitais de Alta Performance, Design Systems escaláveis e UX para Fintechs e plataformas SaaS complexas. Já colaborei com gigantes da tecnologia e startups unicórnio para redefinir suas linguagens visuais.</p>
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
                <span className="profile-skill-tag">UI/UX Design</span>
                <span className="profile-skill-tag">Design Systems</span>
                <span className="profile-skill-tag">Product Strategy</span>
                <span className="profile-skill-tag">Figma Expert</span>
                <span className="profile-skill-tag">Prototyping</span>
                <span className="profile-skill-tag">User Research</span>
                <span className="profile-skill-tag">Webflow</span>
                <span className="profile-skill-tag">Interaction Design</span>
                <span className="profile-skill-tag">Visual Branding</span>
              </div>

              <div className="profile-info-row">
                <span className="profile-info-label">Valor Hora</span>
                <span className="profile-info-value">$85 - $120</span>
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Disponibilidade</span>
                <span className="profile-info-value">20h / semana</span>
              </div>
              <div className="profile-info-row" style={{marginBottom: 0}}>
                <span className="profile-info-label">Último Login</span>
                <span className="profile-info-value">Ativa agora</span>
              </div>
            </div>

            <div className="profile-sidebar-card">
              <div className="profile-sidebar-title">Formação Acadêmica</div>
              <div className="profile-timeline">
                <div className="profile-timeline-item">
                  <div className="profile-timeline-title">Master in Digital Design</div>
                  <div className="profile-timeline-subtitle">School of Visual Arts, NY</div>
                  <div className="profile-timeline-date">2014 - 2016</div>
                </div>
                <div className="profile-timeline-item" style={{marginBottom: 0}}>
                  <div className="profile-timeline-title">B.A. Graphic Design</div>
                  <div className="profile-timeline-subtitle">Universidade de São Paulo</div>
                  <div className="profile-timeline-date">2009 - 2013</div>
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
                "Sabrina tem uma visão rara. Ela não apenas desenhou nossa plataforma, ela ajudou a estruturar como nossos usuários pensam. Resultados imediatos após o lançamento."
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TalentProfilePage;
