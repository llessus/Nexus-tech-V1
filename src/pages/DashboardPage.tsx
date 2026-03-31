import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Bell, 
  ChevronDown, 
  Star, 
  MapPin, 
  Clock, 
  Briefcase,
  SlidersHorizontal,
  Bookmark
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_TALENTS = [
  { id: 1, name: 'Lucas dev', role: 'Full Stack Senior (React/Node)', rating: 4.9, location: 'Remoto', price: 'R$ 120/h', tags: ['React', 'Node.js', 'TypeScript', 'AWS'] },
  { id: 2, name: 'Mariana UX', role: 'Product Designer', rating: 5.0, location: 'Remoto', price: 'R$ 90/h', tags: ['Figma', 'UI/UX', 'Research'] },
  { id: 3, name: 'Pedro Backend', role: 'Especialista em Java/Spring', rating: 4.8, location: 'Remoto', price: 'R$ 150/h', tags: ['Java', 'Spring Boot', 'Microserviços'] },
  { id: 4, name: 'Clara Mobile', role: 'Dev iOS / Swift', rating: 4.7, location: 'Remoto', price: 'R$ 110/h', tags: ['Swift', 'iOS', 'Clean Architecture'] },
  { id: 5, name: 'João DevOps', role: 'Engenheiro SRE/DevOps', rating: 4.9, location: 'Remoto', price: 'R$ 140/h', tags: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform'] },
  { id: 6, name: 'Aline Frontend', role: 'Especialista em Vue.js', rating: 4.8, location: 'Remoto', price: 'R$ 80/h', tags: ['Vue.js', 'Nuxt', 'Tailwind'] },
];

const CATEGORIES = ['Todos', 'Desenvolvedores', 'Designers', 'DevOps', 'Mobile', 'QA'];

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('Todos');

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20">
      {/* Background Decor */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Topbar */}
      <header className="sticky top-0 z-50 glass-card mx-4 mt-4 px-6 py-4 rounded-2xl flex items-center justify-between border-white/10 shadow-lg">
        <div className="flex items-center gap-12">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => navigate('/')}
          >
            <div className="p-1.5 bg-white rounded-lg">
              <Briefcase className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight">Nexus<span className="text-zinc-500">Tech</span></span>
          </div>

          <div className="hidden md:flex relative group w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-white transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Encontre talentos ou serviços..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-white placeholder-zinc-500 font-medium"
            />
          </div>
        </div>

        <div className="flex items-center space-x-5">
          <button className="text-zinc-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-pulse" />
          </button>
          
          <div className="w-px h-6 bg-white/10" />
          
          <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-sm border border-white/10">
              US
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-white">Usuário Logado</p>
            </div>
            <ChevronDown size={16} className="text-zinc-400" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10">
        
        {/* Welcome Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 w-full glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent pointer-events-none" />
          
          <div className="max-w-2xl relative z-10 mb-6 md:mb-0">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-zinc-300 mb-4 border border-white/5">
              Descubra Novos Talentos
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
              Acelere seu próximo <br />projeto com a <span className="gradient-text">Nexus</span>
            </h1>
            <p className="text-zinc-400 text-lg">
              Encontre profissionais validados e com histórico comprovado de entregas.
            </p>
          </div>
          
          <div className="relative z-10 glass-card p-4 rounded-2xl flex items-center gap-4 bg-black/40 border-white/5">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center bg-zinc-${i * 200}`}>
                  <UserIcon i={i} />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-black flex items-center justify-center bg-white text-black font-bold text-xs">
                +1K
              </div>
            </div>
            <div className="text-sm text-zinc-300 font-medium">Profissionais<br/>Prontos</div>
          </div>
        </motion.div>

        {/* Filters/Categories */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 custom-scrollbar">
          <div className="flex space-x-3">
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                  activeCategory === cat 
                    ? 'bg-white text-black' 
                    : 'glass-card text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <button className="hidden md:flex items-center space-x-2 px-4 py-2.5 glass-card rounded-xl text-sm font-medium hover:bg-white/10 transition-colors">
            <SlidersHorizontal size={16} />
            <span>Filtros Avançados</span>
          </button>
        </div>

        {/* Talent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {MOCK_TALENTS.map((talent, i) => (
            <motion.div 
              key={talent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="glass-card p-6 rounded-2xl hover:border-white/20 transition-all group flex flex-col"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center text-xl font-bold border border-white/10 group-hover:bg-white/10 transition-colors">
                    {talent.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-white leading-tight">{talent.name}</h3>
                    <p className="text-sm text-zinc-400 flex items-center gap-1 mt-1">
                      <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-medium">{talent.rating}</span>
                      <span className="mx-1">•</span>
                      {talent.role}
                    </p>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-white transition-colors">
                  <Bookmark size={20} />
                </button>
              </div>

              <div className="flex items-center gap-4 py-4 border-y border-white/10 mb-4 text-sm text-zinc-300">
                <div className="flex items-center gap-1.5 flex-1">
                  <MapPin size={16} className="text-zinc-500" />
                  {talent.location}
                </div>
                <div className="w-px h-4 bg-white/10" />
                <div className="flex items-center gap-1.5 flex-1 justify-end font-medium text-white">
                  <Clock size={16} className="text-zinc-500" />
                  {talent.price}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {talent.tags.map(tag => (
                   <span key={tag} className="px-2.5 py-1 text-xs font-medium rounded-lg bg-white/5 border border-white/5 text-zinc-300">
                    {tag}
                   </span>
                ))}
              </div>

              <div className="mt-auto grid grid-cols-2 gap-3">
                <button className="py-2.5 glass-card rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
                  Ver Perfil
                </button>
                <button className="py-2.5 bg-white text-black rounded-xl text-sm font-bold hover:bg-zinc-200 transition-colors">
                  Contratar
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 0px;
        }
      `}</style>
    </div>
  );
};

// Helper icon
const UserIcon = ({ i }: { i: number }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={i % 2 === 0 ? "white" : "black"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

export default DashboardPage;
