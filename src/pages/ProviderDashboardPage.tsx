import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  ChevronDown, 
  Star, 
  MapPin, 
  Clock, 
  Briefcase,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Plus,
  Eye,
  CheckCircle2,
  MoreHorizontal
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MY_SERVICES = [
  { id: 1, title: 'Desenvolvimento Backend Node.js Completo', price: 'R$ 2.500', delivery: '5 dias', active: true },
  { id: 2, title: 'Integração de Gateway de Pagamento (Stripe/Mercado Pago)', price: 'R$ 1.200', delivery: '3 dias', active: true },
  { id: 3, title: 'Consultoria Arquitetura AWS', price: 'R$ 150/h', delivery: 'Imediato', active: false },
];

const ACTIVE_PROJECTS = [
  { id: 101, client: 'Tech Solutions SA', project: 'API para App de Delivery', progress: 75, status: 'Em andamento', due: '12 Nov' },
  { id: 102, client: 'Fintech Brasil', project: 'Refatoração Microserviços', progress: 30, status: 'Em andamento', due: '30 Nov' },
];

const ProviderDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white/20 pb-12">
      {/* Background Decor */}
      <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none z-0" />

      {/* Topbar */}
      <header className="sticky top-0 z-50 glass-card mx-4 mt-4 px-6 py-4 rounded-2xl flex items-center justify-between border-white/10 shadow-lg">
        <div 
          className="flex items-center space-x-2 cursor-pointer" 
          onClick={() => navigate('/')}
        >
          <div className="p-1.5 bg-white rounded-lg">
            <Briefcase className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold tracking-tight">Nexus<span className="text-zinc-500">Tech</span> <span className="text-xs font-semibold px-2 py-0.5 bg-white/10 text-emerald-400 rounded-full ml-2 align-middle">Talent</span></span>
        </div>

        <div className="flex items-center space-x-5">
          <button className="text-zinc-400 hover:text-white transition-colors relative">
            <MessageSquare size={20} />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full border-2 border-black" />
          </button>
          
          <button className="text-zinc-400 hover:text-white transition-colors relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1.5 px-1 bg-emerald-500 rounded-full text-[9px] font-bold text-black border-2 border-black">
              3
            </span>
          </button>
          
          <div className="w-px h-6 bg-white/10" />
          
          <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-400 to-blue-500 p-0.5">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-sm">
                LC
              </div>
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-white">Lucas C.</p>
            </div>
            <ChevronDown size={16} className="text-zinc-400" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Profile Card */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 rounded-3xl border border-white/10 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-emerald-500/20 to-blue-500/20" />
            
            <div className="relative pt-12 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-zinc-800 border-4 border-black mb-4 flex items-center justify-center text-3xl font-bold shadow-xl">
                LC
              </div>
              <h2 className="text-2xl font-bold mb-1">Lucas Costa</h2>
              <p className="text-emerald-400 font-medium text-sm mb-3">Senior Node.js Developer</p>
              
              <div className="flex items-center gap-4 text-sm text-zinc-400 mb-6">
                <span className="flex items-center gap-1"><MapPin size={14} /> São Paulo, SP (Remoto)</span>
              </div>

              <div className="w-full flex justify-between border-y border-white/10 py-4 mb-6">
                <div className="text-center w-1/2 border-r border-white/10">
                  <p className="text-2xl font-bold text-white mb-1">4.9<span className="text-lg text-yellow-400 ml-1">★</span></p>
                  <p className="text-xs text-zinc-500 font-medium">Avaliação (12)</p>
                </div>
                <div className="text-center w-1/2">
                  <p className="text-xl font-bold text-white mb-1">R$ 150</p>
                  <p className="text-xs text-zinc-500 font-medium">Valor Hora</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {['Node.js', 'React', 'AWS', 'TypeScript', 'Docker'].map(tag => (
                   <span key={tag} className="px-3 py-1 text-xs font-semibold rounded-lg bg-zinc-800 text-zinc-300">
                    {tag}
                   </span>
                ))}
              </div>

              <button className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-zinc-200 transition-colors">
                Editar Perfil
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-3xl"
          >
            <h3 className="font-bold mb-6 flex items-center justify-between">
              Estatísticas Rápida
              <TrendingUp size={18} className="text-emerald-400" />
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><DollarSign size={18} /></div>
                  <span className="text-sm font-medium">Ganhos no mês</span>
                </div>
                <span className="font-bold">R$ 8.450</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Eye size={18} /></div>
                  <span className="text-sm font-medium">Visualizações</span>
                </div>
                <span className="font-bold">142</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><CheckCircle2 size={18} /></div>
                  <span className="text-sm font-medium">Jobs concluídos</span>
                </div>
                <span className="font-bold">24</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Maint Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Projetos Ativos */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 md:p-8 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">Projetos em Andamento</h2>
              <button className="text-sm text-zinc-400 hover:text-white transition-colors font-medium">Ver todos</button>
            </div>

            <div className="space-y-4">
              {ACTIVE_PROJECTS.map(proj => (
                <div key={proj.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl hover:border-white/20 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-lg">{proj.project}</h4>
                      <p className="text-sm text-zinc-400">{proj.client}</p>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                      <span className="inline-flex py-1 px-3 text-xs font-semibold rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-1">
                        {proj.status}
                      </span>
                      <p className="text-xs text-zinc-500">Entrega: {proj.due}</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1.5">
                      <span className="text-zinc-400">Progresso</span>
                      <span className="text-white">{proj.progress}%</span>
                    </div>
                    <div className="w-full bg-black/50 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-blue-500 h-2 rounded-full" 
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-end gap-3">
                    <button className="px-4 py-2 text-sm font-medium text-white hover:bg-white/10 rounded-lg transition-colors">Atualizar Status</button>
                    <button className="px-4 py-2 text-sm font-bold text-black bg-white hover:bg-zinc-200 rounded-lg transition-colors">Ver Workspace</button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Seus Serviços */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 md:p-8 rounded-3xl"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-1">Meus Serviços Cadastrados</h2>
                <p className="text-zinc-400 text-sm">Pacotes de serviço visíveis para empresas.</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-black font-bold text-sm rounded-xl hover:bg-zinc-200 transition-colors shadow-lg">
                <Plus size={18} /> <span className="hidden sm:inline">Novo Serviço</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MY_SERVICES.map(service => (
                <div key={service.id} className="p-5 border border-white/10 rounded-2xl relative group bg-black/20 hover:bg-white/5 transition-all">
                  <div className="absolute top-4 right-4 text-zinc-500 hover:text-white cursor-pointer bg-black/50 p-1.5 rounded-lg border border-white/5">
                    <MoreHorizontal size={16} />
                  </div>
                  <div className="mb-4 pr-8">
                    <h4 className="font-bold text-white leading-tight mb-2">{service.title}</h4>
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-medium ${service.active ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${service.active ? 'bg-emerald-400' : 'bg-zinc-500'}`} />
                      {service.active ? 'Ativo' : 'Pausado'}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5 text-sm font-bold">
                      <DollarSign size={16} className="text-emerald-500" />
                      {service.price}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                      <Clock size={14} />
                      {service.delivery}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </main>

    </div>
  );
};

export default ProviderDashboardPage;
