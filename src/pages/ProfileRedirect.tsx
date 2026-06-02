import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUsuarioLogado } from '../api/auth';
import { obterTalentoPorUsuarioId } from '../api/talentos';

const ProfileRedirect: React.FC = () => {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) {
      navigate('/login');
      return;
    }

    if (usuario.tipoConta === 'cliente') {
      navigate(`/client/${usuario.id}`);
    } else if (usuario.tipoConta === 'prestador') {
      obterTalentoPorUsuarioId(usuario.id)
        .then((talento) => {
          if (talento && talento.id) {
            navigate(`/talent/${talento.id}`);
          } else {
            setError('Perfil de prestador não encontrado.');
          }
        })
        .catch((err) => {
          console.error('Erro ao redirecionar para perfil de talento:', err);
          setError('Erro ao carregar dados do perfil de prestador. Redirecionando para configurações...');
          setTimeout(() => navigate('/settings'), 3000);
        });
    } else {
      // admin, etc.
      navigate('/settings');
    }
  }, [usuario, navigate]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      {error ? (
        <p style={{ color: '#ef4444', maxWidth: '400px', textAlign: 'center' }}>{error}</p>
      ) : (
        <p style={{ color: '#a1a1aa' }}>Carregando seu perfil...</p>
      )}
    </div>
  );
};

export default ProfileRedirect;
