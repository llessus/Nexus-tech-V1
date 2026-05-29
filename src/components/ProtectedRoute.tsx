import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUsuarioLogado, TipoConta } from '../api/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: TipoConta[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const usuario = getUsuarioLogado();

  if (!usuario) {
    // Redireciona para o login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(usuario.tipoConta)) {
    // Redireciona para a home correspondente se o tipo de conta não for permitido
    if (usuario.tipoConta === 'admin') return <Navigate to="/admin" replace />;
    if (usuario.tipoConta === 'prestador') return <Navigate to="/provider" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
