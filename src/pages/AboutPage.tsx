import React from 'react';
import { motion } from 'framer-motion';
import { 
  Code2, Globe, ShieldCheck, Zap, Target, 
  Rocket, ArrowRight, Github, Linkedin
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import './AboutPage.css';

const stats = [
  { label: 'Profissionais Cadastrados', value: '1.200+' },
  { label: 'Projetos Entregues', value: '850+' },
  { label: 'Empresas Atendidas', value: '320+' },
  { label: 'Satisfação dos Clientes', value: '98%' },
];

const values = [
  {
    icon: <ShieldCheck size={28} />,
    title: 'Confiança',
    desc: 'Todo profissional é verificado com avaliações reais e histórico comprovado de entregas.',
  },
  {
    icon: <Zap size={28} />,
    title: 'Agilidade',
    desc: 'Reduza o tempo de contratação de semanas para minutos com nosso sistema inteligente de matching.',
  },
  {
    icon: <Target size={28} />,
    title: 'Precisão',
    desc: 'Filtros avançados por tecnologia, senioridade e disponibilidade para encontrar o talento perfeito.',
  },
  {
    icon: <Globe size={28} />,
    title: 'Alcance Global',
    desc: 'Conectamos talentos e empresas de qualquer lugar do mundo, 100% remoto.',
  },
];

const team = [
  {
    name: 'Brendon Russell',
    role: 'Full Stack Developer',
    matricula: 'UC24200064',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    github: '#',
    linkedin: '#',
  },
  {
    name: 'Carlos Eduardo',
    role: 'Full Stack Developer',
    matricula: 'UC24200871',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    github: '#',
    linkedin: '#',
  },
];

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <div className="about-bg-decor-1" />
      <div className="about-bg-decor-2" />

      <Navbar />

      <main>
        {/* Hero */}
        <section className="about-hero">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="about-hero-content"
          >
            <span className="about-badge">
              <Rocket size={14} /> Sobre a Nexus Tech
            </span>
            <h1 className="about-hero-title">
              Conectamos os melhores<br />
              <span className="about-gradient-text">talentos de TI</span> ao mundo
            </h1>
            <p className="about-hero-desc">
              Nascemos com a missão de eliminar a burocracia nos processos de contratação de 
              profissionais de tecnologia. Somos o marketplace que une empresas a desenvolvedores, 
              designers, DevOps e QA de forma rápida, transparente e segura.
            </p>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="about-stats">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              className="about-stat-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="about-stat-value">{s.value}</div>
              <div className="about-stat-label">{s.label}</div>
            </motion.div>
          ))}
        </section>

        {/* Mission */}
        <section className="about-mission">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="about-mission-content"
          >
            <div className="about-mission-icon">
              <Code2 size={32} />
            </div>
            <h2>Nossa Missão</h2>
            <p>
              Democratizar o acesso a oportunidades de trabalho em tecnologia, criando um ecossistema 
              onde empresas encontram profissionais qualificados com transparência total sobre habilidades, 
              avaliações e disponibilidade — eliminando intermediários e processos seletivos longos.
            </p>
          </motion.div>
        </section>

        {/* Values */}
        <section className="about-values">
          <div className="about-section-header">
            <h2>Nossos Valores</h2>
            <p>Princípios que guiam cada decisão e funcionalidade da plataforma.</p>
          </div>
          <div className="about-values-grid">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="about-value-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="about-value-icon">{v.icon}</div>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="about-how">
          <div className="about-section-header">
            <h2>Como Funciona</h2>
            <p>Três passos simples para conectar talentos a oportunidades.</p>
          </div>
          <div className="about-steps">
            <motion.div className="about-step" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="about-step-number">01</div>
              <h3>Crie sua Conta</h3>
              <p>Registre-se como cliente buscando profissionais ou como prestador oferecendo seus serviços de tecnologia.</p>
            </motion.div>
            <div className="about-step-arrow"><ArrowRight size={24} /></div>
            <motion.div className="about-step" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <div className="about-step-number">02</div>
              <h3>Explore o Marketplace</h3>
              <p>Navegue por perfis verificados, filtre por tecnologia, senioridade e avaliações para encontrar o match perfeito.</p>
            </motion.div>
            <div className="about-step-arrow"><ArrowRight size={24} /></div>
            <motion.div className="about-step" initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <div className="about-step-number">03</div>
              <h3>Contrate e Colabore</h3>
              <p>Feche o contrato com pagamento seguro via NexusEscrow™ e alinhe os detalhes diretamente pelo chat integrado.</p>
            </motion.div>
          </div>
        </section>

        {/* Team */}
        <section className="about-team">
          <div className="about-section-header">
            <h2>Equipe de Desenvolvimento</h2>
            <p>Os criadores por trás da plataforma Nexus Tech.</p>
          </div>
          <div className="about-team-grid">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="about-team-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <img src={member.avatar} alt={member.name} className="about-team-avatar" />
                <h3>{member.name}</h3>
                <p className="about-team-role">{member.role}</p>
                <span className="about-team-matricula">{member.matricula}</span>
                <div className="about-team-socials">
                  <a href={member.github}><Github size={18} /></a>
                  <a href={member.linkedin}><Linkedin size={18} /></a>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="about-cta">
          <motion.div
            className="about-cta-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Pronto para acelerar seus projetos?</h2>
            <p>Junte-se a centenas de empresas e profissionais que já confiam no Nexus Tech.</p>
            <div className="about-cta-buttons">
              <button onClick={() => navigate('/register')} className="about-cta-btn-primary">
                Criar Minha Conta
                <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/login')} className="about-cta-btn-secondary">
                Acessar Plataforma
              </button>
            </div>
          </motion.div>
        </section>
      </main>

      {/* Footer */}
      <footer className="about-footer">
        <div className="about-footer-content">
          <span>© 2026 Nexus Tech Marketplace. Todos os direitos reservados.</span>
          <div className="about-footer-links">
            <a href="#">Termos</a>
            <a href="#">Privacidade</a>
            <a href="#">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
