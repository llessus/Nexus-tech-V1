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

const features = [
  {
    title: "Perfis com Avaliações",
    desc: "Encontre profissionais de TI de forma rápida através de perfis detalhados e um sistema de reputação seguro.",
    icon: <ShieldCheck className="w-8 h-8 text-zinc-300" />,
  },
  {
    title: "Filtros por Habilidades",
    desc: "Um sistema simples de busca e filtros precisos para achar o desenvolvedor exato para a sua necessidade.",
    icon: <Zap className="w-8 h-8 text-zinc-400" />,
  },
  {
    title: "Serviços Prontos",
    desc: "Acelere seus projetos com a oferta de serviços já pacotizados, reduzindo totalmente o tempo de decisão.",
    icon: <Cpu className="w-8 h-8 text-zinc-300" />,
  },
  {
    title: "Conexão Direta",
    desc: "Marketplace organizado que elimina a concorrência genérica e dá visibilidade a quem realmente traz resultado.",
    icon: <Globe className="w-8 h-8 text-zinc-400" />,
  },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-800/10 rounded-full blur-[150px] pointer-events-none" />

      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-zinc-300 text-sm font-medium mb-6">
                Marketplace Especializado em TI
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                Contratação Rápida e <br />
                <span className="gradient-text">Organizada</span>
              </h1>
              <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                Empresas perdem meses em processos ineficientes; desenvolvedores ficam escondidos em grandes plataformas genéricas. 
                O Nexus Tech conecta ambos os lados de forma ágil e inteligente.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg shadow-white/5"
                >
                  Buscar Profissionais
                </button>
                <button 
                  onClick={() => navigate('/register')}
                  className="px-8 py-4 glass-card hover:bg-white/10 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group"
                >
                  Criar Meu Perfil
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="services" className="py-24 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-4">Mais que uma vitrine</h2>
              <p className="text-zinc-400 max-w-xl mx-auto">Somos a infraestrutura que escala times de tecnologia globalmente com segurança total.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-8 hover:border-white/20 transition-all group"
                >
                  <div className="mb-6 p-3 bg-white/5 rounded-2xl inline-block group-hover:scale-110 transition-transform border border-white/5">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto glass-card p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Pare de perder tempo em processos longos</h2>
            <p className="text-zinc-400 mb-10 max-w-lg mx-auto">Crie seu perfil ou busque profissionais usando nossos filtros agora mesmo.</p>
            <button 
              onClick={() => navigate('/register')}
              className="px-10 py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-zinc-200 transition-colors"
            >
              Acessar a Plataforma
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="pt-20 pb-10 border-t border-white/5 px-4 bg-black/60">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-1.5 bg-white rounded-lg">
                  <Cpu className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold">Nexus Tech</span>
              </div>
              <p className="text-zinc-400 text-sm">
                Conectando os melhores talentos de TI a oportunidades globais através de tecnologia de ponta.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 text-white">Plataforma</h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Talentos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Empresas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Segurança</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-white">Empresa</h4>
              <ul className="space-y-4 text-sm text-zinc-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre Nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-white">Redes Sociais</h4>
              <div className="flex space-x-4">
                <a href="#" className="p-2 glass-card hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"><Twitter size={20} /></a>
                <a href="#" className="p-2 glass-card hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"><Linkedin size={20} /></a>
                <a href="#" className="p-2 glass-card hover:bg-white/10 transition-colors text-zinc-400 hover:text-white"><Github size={20} /></a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 text-center text-sm text-zinc-600">
            © 2026 Nexus Tech Marketplace. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
