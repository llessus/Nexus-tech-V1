import React, { useState } from 'react';
import { 
  MapPin, 
  Star,
  Bookmark,
  Wallet,
  SlidersHorizontal,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import './DashboardPage.css';

const MOCK_TALENTS = [
  {
    id: 1,
    name: "Billie Elinho",
    role: "FULL STACK SENIOR",
    rating: 4.9,
    location: "Remoto",
    hourlyRate: 150,
    skills: ["REACT", "NODE.JS", "AWS", "TYPESCRIPT"],
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop",
    verified: true
  },
  {
    id: 2,
    name: "Sabrina carpinteira",
    role: "PRODUCT DESIGNER SENIOR",
    rating: 5.0,
    location: "São Paulo",
    hourlyRate: 180,
    skills: ["FIGMA", "DESIGN SYSTEMS", "UX RESEARCH"],
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop",
    verified: true
  },
  {
    id: 3,
    name: "Neymar",
    role: "DEVOPS SPECIALIST",
    rating: 4.8,
    location: "Santos",
    hourlyRate: 200,
    skills: ["KUBERNETES", "TERRAFORM", "AZURE"],
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop",
    verified: true
  },
  {
    id: 4,
    name: "Toguro Mobile",
    role: "IOS / ANDROID DEVELOPER",
    rating: 4.9,
    location: "Remoto",
    hourlyRate: 140,
    skills: ["FLUTTER", "SWIFT", "FIREBASE"],
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop",
    verified: true
  }
];

const CATEGORIES = ["Todos", "Desenvolvedores", "Designers", "DevOps", "Mobile", "QA"];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Todos");

  return (
    <div className="dash-container">
      <Topbar />

      <main className="dash-main">
        {/* Welcome Banner */}
        <section className="dash-hero">
          <div className="dash-hero-overlay" />
          <div className="dash-hero-content">
            <h1 className="dash-hero-title">
              Acelere seu próximo<br/>
              projeto com a <span className="dash-hero-title-highlight">Nexus</span>
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
          
          <button className="dash-advanced-btn">
            <SlidersHorizontal size={16} />
            <span>Filtros Avançados</span>
          </button>
        </div>

        {/* Talent Grid */}
        <div className="dash-grid">
          {MOCK_TALENTS.map((talent) => (
            <div key={talent.id} className="talent-card">
              <div className="talent-header">
                <div className="talent-info-left">
                  <img src={talent.avatar} alt={talent.name} className="talent-avatar" />
                  <div>
                    <h3 className="talent-name">{talent.name}</h3>
                    <p className="talent-role">{talent.role}</p>
                    <div className="talent-rating">
                      <Star size={14} color="#facc15" fill="#facc15" />
                      <span>{talent.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                <Bookmark className="talent-bookmark" size={24} />
              </div>

              <div className="talent-meta">
                <div className="talent-meta-item">
                  <MapPin size={16} />
                  <span>{talent.location}</span>
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
          ))}
        </div>
      </main>

      {/* Floating Action Button */}
      <button className="fab">
        <Plus size={28} />
      </button>
    </div>
  );
};

export default DashboardPage;
