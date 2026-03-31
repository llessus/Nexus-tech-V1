import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, Lock, User, Code, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [accountType, setAccountType] = useState<'empresa' | 'talento'>('empresa');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    skills: '',
    readyServices: false
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register attempt:', { accountType, ...formData });
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden text-white py-12">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-zinc-800/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="glass-card p-8 relative">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 bg-white/5 rounded-2xl border border-white/10 mb-4 cursor-pointer hover:bg-white/10 transition-colors" onClick={() => navigate('/')}>
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Crie sua Conta</h2>
            <p className="text-zinc-400 text-sm">Junte-se à elite da tecnologia</p>
          </div>

          <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 mb-8">
            <button
              onClick={() => setAccountType('empresa')}
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                accountType === 'empresa' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sou Empresa
            </button>
            <button
              onClick={() => setAccountType('talento')}
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                accountType === 'talento' ? 'bg-white text-black shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Sou Talento
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-all"
                  placeholder={accountType === 'empresa' ? "Nome da Empresa" : "Nome Completo"}
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-all"
                  placeholder="Seu melhor e-mail"
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-zinc-500" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-all"
                  placeholder="Crie uma senha forte"
                />
              </div>
            </div>

            <AnimatePresence>
              {accountType === 'talento' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="pt-2 pb-1 space-y-4">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Code className="h-5 w-5 text-zinc-500" />
                      </div>
                      <input
                        type="text"
                        required={accountType === 'talento'}
                        value={formData.skills}
                        onChange={(e) => setFormData({...formData, skills: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-all"
                        placeholder="Principais habilidades (Ex: React, Node)"
                      />
                    </div>
                    
                    <label className="flex items-start space-x-3 cursor-pointer p-3 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.readyServices}
                        onChange={(e) => setFormData({...formData, readyServices: e.target.checked})}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-white focus:ring-white bg-transparent outline-none"
                      />
                      <div>
                        <span className="text-sm font-medium text-white block">Quero oferecer serviços prontos</span>
                        <span className="text-xs text-zinc-400 leading-tight block mt-0.5">Permite que empresas comprem pacotes seus sem burocracia.</span>
                      </div>
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-zinc-200 transition-colors flex justify-center items-center gap-2 group mt-4"
            >
              Criar Conta Grátis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="mt-8 text-center text-zinc-400 text-sm">
            Já possui conta?{' '}
            <button onClick={() => navigate('/login')} type="button" className="text-white hover:underline font-medium">
              Faça login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
