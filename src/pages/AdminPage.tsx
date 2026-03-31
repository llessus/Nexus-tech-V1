import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Search, 
  Bell, 
  ChevronDown,
  Activity,
  Briefcase,
  TrendingUp,
  CreditCard,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'users', label: 'Usuários', icon: <Users size={20} /> },
    { id: 'services', label: 'Serviços', icon: <Briefcase size={20} /> },
    { id: 'transactions', label: 'Transações', icon: <CreditCard size={20} /> },
    { id: 'settings', label: 'Configurações', icon: <Settings size={20} /> },
  ];

  const statCards = [
    { title: 'Total de Usuários', value: '12,450', change: '+14%', icon: <Users size={24} className="text-zinc-300" /> },
    { title: 'Serviços Ativos', value: '1,240', change: '+5%', icon: <Activity size={24} className="text-emerald-400" /> },
    { title: 'Receita Mensal', value: 'R$ 45.2K', change: '+22%', icon: <TrendingUp size={24} className="text-purple-400" /> },
  ];

  const recentActivity = [
    { id: 1, user: 'Ana Silva', action: 'Criou um novo serviço', time: 'Há 2 min', status: 'success' },
    { id: 2, user: 'Carlos Moura', action: 'Atualizou o perfil', time: 'Há 15 min', status: 'info' },
    { id: 3, user: 'Tech Solutions', action: 'Contratou um desenvolvedor', time: 'Há 1 hora', status: 'warning' },
    { id: 4, user: 'João Pedro', action: 'Avaliou um serviço (5⭐)', time: 'Há 2 horas', status: 'success' },
  ];

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden selection:bg-white/20">
      {/* Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-72 border-r border-white/10 glass-card m-4 rounded-3xl flex flex-col justify-between relative z-10"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-10 px-2">
            <div className="p-2 bg-gradient-to-br from-white to-zinc-400 rounded-xl">
              <LayoutDashboard className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold tracking-tight">Nexus<span className="text-zinc-500">Admin</span></span>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.1)]' 
                    : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-white/10">
          <button 
            onClick={() => navigate('/')}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full relative z-10 py-4 pr-4">
        
        {/* Top Header */}
        <header className="flex items-center justify-between px-8 py-4 glass-card rounded-3xl mb-6">
          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-white transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar usuários, serviços ou transações..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all text-white placeholder-zinc-500 font-medium"
            />
          </div>

          <div className="flex items-center space-x-6 ml-6">
            <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute top-1 right-2 w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            </button>
            
            <div className="w-px h-8 bg-white/10" />
            
            <button className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 p-0.5">
                <div className="w-full h-full bg-black rounded-full flex items-center justify-center font-bold text-sm">
                  AD
                </div>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-white">Admin Master</p>
                <p className="text-xs text-zinc-500">admin@nexus.tech</p>
              </div>
              <ChevronDown size={16} className="text-zinc-400" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <div className="px-2">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold mb-2">Visão Geral</h1>
              <p className="text-zinc-400">Acompanhe as métricas e atividades da plataforma.</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="glass-card p-6 flex items-start justify-between group hover:border-white/20 transition-all"
                >
                  <div>
                    <p className="text-zinc-400 text-sm font-medium mb-1">{stat.title}</p>
                    <h3 className="text-3xl font-extrabold mb-2">{stat.value}</h3>
                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/10 text-white">
                      {stat.change} este mês
                    </span>
                  </div>
                  <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">
                    {stat.icon}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Chart Area Mock */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="lg:col-span-2 glass-card p-6 flex flex-col min-h-[400px]"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Crescimento da Plataforma</h3>
                  <button className="text-sm text-zinc-400 hover:text-white transition-colors">Ver Relatório</button>
                </div>
                <div className="flex-1 flex items-end justify-between gap-2 md:gap-4 mt-auto">
                  {/* Mock Bars for Chart */}
                  {[40, 70, 45, 90, 65, 80, 100].map((height, i) => (
                    <div key={i} className="w-full flex flex-col items-center gap-2 group">
                      <div className="w-full bg-white/5 rounded-t-xl relative overflow-hidden h-[250px] flex items-end">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                          className={`w-full ${height > 80 ? 'bg-gradient-to-t from-white/20 to-white' : 'bg-gradient-to-t from-white/10 to-white/40'} rounded-t-xl group-hover:opacity-80 transition-opacity`}
                        />
                      </div>
                      <span className="text-xs text-zinc-500 font-medium">
                        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Activity */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="glass-card p-6"
              >
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold">Atividade Recente</h3>
                  <button className="p-1 hover:bg-white/10 rounded-lg transition-colors text-zinc-400">
                    <MoreVertical size={20} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {recentActivity.map((activity, i) => (
                    <div key={activity.id} className="flex items-start gap-4">
                      <div className="relative mt-1">
                        <div className={`w-3 h-3 rounded-full ${
                          activity.status === 'success' ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' :
                          activity.status === 'warning' ? 'bg-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.5)]' :
                          'bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]'
                        }`} />
                        {i !== recentActivity.length - 1 && (
                          <div className="absolute top-4 left-1.5 w-px h-10 bg-white/10 -translate-x-1/2" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{activity.user}</p>
                        <p className="text-sm text-zinc-400">{activity.action}</p>
                        <p className="text-xs text-zinc-600 mt-1 font-medium">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="w-full mt-8 py-3 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/5 transition-colors">
                  Ver Todo o Histórico
                </button>
              </motion.div>

            </div>
          </div>
        </div>

      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export default AdminPage;
