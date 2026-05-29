import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Menu, X, Rocket, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsuarioLogado, getHomeByTipoConta } from '../api/auth';
import './Navbar.css';

const navLinks = [
  { name: 'Home', href: '#' },
  { name: 'Serviços', href: '#services' },
  { name: 'Soluções', href: '#solutions' },
  { name: 'Sobre', href: '#about' },
  { name: 'Contato', href: '#contact' },
];

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ['rgba(0, 0, 0, 0)', 'rgba(3, 7, 18, 0.8)']
  );
  
  const backdropBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(12px)']
  );

  const borderBottom = useTransform(
    scrollY,
    [0, 50],
    ['1px solid rgba(255, 255, 255, 0)', '1px solid rgba(255, 255, 255, 0.1)']
  );

  const paddingY = useTransform(
    scrollY,
    [0, 50],
    ['20px', '12px']
  );

  return (
    <motion.nav
      style={{
        backgroundColor,
        backdropFilter: backdropBlur,
        WebkitBackdropFilter: backdropBlur,
        borderBottom,
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
      className="navbar"
    >
      <div className="navbar-container">
        <div className="navbar-content">
          <button
            type="button"
            className="navbar-back-btn"
            onClick={() => navigate(-1)}
            aria-label="Voltar para a página anterior"
            title="Voltar"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="navbar-brand"
          >
            <div className="navbar-logo-icon">
              <Rocket size={24} color="black" />
            </div>
            <span className="navbar-logo-text">
              Nexus Tech
            </span>
          </motion.div>

          {/* Desktop Nav */}
          <div className="navbar-desktop">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="navbar-link"
              >
                {link.name}
              </motion.a>
            ))}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (usuario) {
                  navigate(getHomeByTipoConta(usuario.tipoConta));
                } else {
                  navigate('/login');
                }
              }}
              className="navbar-btn"
            >
              {usuario ? 'Ir para o Painel' : 'Começar Agora'}
              <ChevronRight className="icon" size={16} />
            </motion.button>
          </div>

          {/* Mobile Button */}
          <div className="navbar-mobile-btn-container">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="navbar-mobile-btn"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="navbar-mobile-menu"
          >
            <div className="navbar-mobile-content">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="navbar-mobile-link"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
              <div style={{ paddingTop: '1rem' }}>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    if (usuario) {
                      navigate(getHomeByTipoConta(usuario.tipoConta));
                    } else {
                      navigate('/login');
                    }
                  }}
                  className="navbar-mobile-btn-full"
                >
                  {usuario ? 'Ir para o Painel' : 'Começar Agora'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
