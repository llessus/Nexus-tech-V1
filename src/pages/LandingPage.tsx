import React from 'react';
import { motion } from 'framer-motion';
import { 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Globe, 
  ArrowRight, 
  Github, 
  Linkedin, 
  Twitter 
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const features = [
  {
    title: "Perfis com Avaliações",
    desc: "Encontre profissionais de TI de forma rápida através de perfis detalhados e um sistema de reputação seguro.",
    icon: <ShieldCheck size={32} color="#d4d4d8" />,
  },
  {
    title: "Filtros por Habilidades",
    desc: "Um sistema simples de busca e filtros precisos para achar o desenvolvedor exato para a sua necessidade.",
    icon: <Zap size={32} color="#a1a1aa" />,
  },
  {
    title: "Serviços Prontos",
    desc: "Acelere seus projetos com a oferta de serviços já pacotizados, reduzindo totalmente o tempo de decisão.",
    icon: <Cpu size={32} color="#d4d4d8" />,
  },
  {
    title: "Conexão Direta",
    desc: "Marketplace organizado que elimina a concorrência genérica e dá visibilidade a quem realmente traz resultado.",
    icon: <Globe size={32} color="#a1a1aa" />,
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Background Decor */}
      <div className="bg-decor-1" />
      <div className="bg-decor-2" />

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="badge">
                Marketplace Especializado em TI
              </span>
              <h1 className="hero-title">
                Contratação Rápida e <br />
                <span className="gradient-text">Organizada</span>
              </h1>
              <p className="hero-description">
                Empresas perdem meses em processos ineficientes; desenvolvedores ficam escondidos em grandes plataformas genéricas. 
                O Nexus Tech conecta ambos os lados de forma ágil e inteligente.
              </p>
              
              <div className="hero-buttons">
                <button 
                  onClick={() => navigate('/login')}
                  className="btn-primary"
                >
                  Buscar Profissionais
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="btn-secondary glass-card"
                >
                  Criar Meu Perfil
                  <ArrowRight className="icon" size={20} />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="services" className="features-section">
          <div className="features-container">
            <div className="section-header">
              <h2 className="section-title">Mais que uma vitrine</h2>
              <p className="section-subtitle">Somos a infraestrutura que escala times de tecnologia globalmente com segurança total.</p>
            </div>
            
            <div className="features-grid">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="feature-card glass-card"
                >
                  <div className="feature-icon-wrapper">
                    {f.icon}
                  </div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Marketplace Preview Section */}
        <section className="preview-section">
          <div className="preview-container">
            <div className="section-header">
              <span className="badge">Destaques da Plataforma</span>
              <h2 className="section-title">Talentos em Destaque</h2>
              <p className="section-subtitle">Conecte-se com especialistas prontos para acelerar seu projeto de software.</p>
            </div>
            
            <div className="talents-preview-grid">
              {[
                {
                  nome: "Sabrina Carpenter",
                  role: "Lead Pop-Tech Architect",
                  rate: "R$ 350/h",
                  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop",
                  skills: ["React", "TypeScript", "Clean Architecture", "Android"]
                },
                {
                  nome: "Brendon Urie",
                  role: "Senior Backend Engineer",
                  rate: "R$ 220/h",
                  avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
                  skills: ["Node.js", "PostgreSQL", "Docker", "AWS"]
                },
                {
                  nome: "Taylor Swift",
                  role: "Senior UI/UX Designer",
                  rate: "R$ 280/h",
                  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
                  skills: ["Figma", "Design Systems", "Product Design"]
                }
              ].map((t, idx) => (
                <div key={idx} className="preview-talent-card glass-card">
                  <div className="talent-card-header">
                    <img src={t.avatar} alt={t.nome} className="talent-avatar" />
                    <div>
                      <h4>{t.nome}</h4>
                      <p>{t.role}</p>
                    </div>
                  </div>
                  <div className="talent-skills">
                    {t.skills.map((s, sIdx) => <span key={sIdx} className="skill-pill">{s}</span>)}
                  </div>
                  <div className="talent-footer">
                    <span className="talent-rate">{t.rate}</span>
                    <button className="btn-view-profile" onClick={() => navigate('/login')}>Ver Perfil</button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <button onClick={() => navigate('/login')} className="btn-secondary glass-card" style={{ display: 'inline-flex', padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
                Ver Todos os 1200+ Talentos
                <ArrowRight size={16} style={{ marginLeft: '0.5rem' }} />
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section">
          <div className="cta-container glass-card">
            <div className="cta-overlay" />
            <h2 className="cta-title">Pare de perder tempo em processos longos</h2>
            <p className="cta-desc">Crie seu perfil ou busque profissionais usando nossos filtros agora mesmo.</p>
            <button 
              onClick={() => navigate('/register')}
              className="cta-btn"
            >
              Acessar a Plataforma
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <div className="footer-logo-icon">
                  <Cpu size={20} color="black" />
                </div>
                <span className="footer-logo-text">Nexus Tech</span>
              </div>
              <p className="footer-brand-desc">
                Conectando os melhores talentos de TI a oportunidades globais através de tecnologia de ponta.
              </p>
            </div>
            
            <div>
              <h4 className="footer-heading">Plataforma</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Talentos</a></li>
                <li><a href="#" className="footer-link">Empresas</a></li>
                <li><a href="#" className="footer-link">Segurança</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-heading">Empresa</h4>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Sobre Nós</a></li>
                <li><a href="#" className="footer-link">Carreiras</a></li>
                <li><a href="#" className="footer-link">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-heading">Redes Sociais</h4>
              <div className="footer-socials">
                <a href="#" className="footer-social-link glass-card"><Twitter size={20} /></a>
                <a href="#" className="footer-social-link glass-card"><Linkedin size={20} /></a>
                <a href="#" className="footer-social-link glass-card"><Github size={20} /></a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            © 2026 Nexus Tech Marketplace. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
