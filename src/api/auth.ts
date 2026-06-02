const API_URL = '/api/auth';

export type TipoConta = 'cliente' | 'prestador' | 'admin';

export interface UsuarioLogado {
  id: number;
  nome: string;
  email: string;
  tipoConta: TipoConta;
  avatarUrl?: string | null;
}

export interface LoginPayload {
  email: string;
  senha: string;
}

export interface RegisterPayload extends LoginPayload {
  nome: string;
  tipoConta: Exclude<TipoConta, 'admin'>;
}

const formatFieldErrors = (campos: Record<string, string[]>): string => {
  return Object.entries(campos)
    .map(([campo, msgs]) => `${campo}: ${msgs.join(', ')}`)
    .join('\n');
};

const requestJson = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (data.campos) {
      throw new Error(formatFieldErrors(data.campos));
    }
    throw new Error(data.erro || 'Não foi possível completar a solicitação.');
  }

  return data;
};

export const login = async (payload: LoginPayload): Promise<UsuarioLogado> => {
  const data = await requestJson<{ usuario: UsuarioLogado }>('/login', payload);
  localStorage.setItem('nexus:user', JSON.stringify(data.usuario));
  return data.usuario;
};

export const register = async (payload: RegisterPayload): Promise<UsuarioLogado> => {
  const data = await requestJson<{ usuario: UsuarioLogado }>('/register', payload);
  return data.usuario;
};

export const logout = () => {
  localStorage.removeItem('nexus:user');
};

export const getUsuarioLogado = (): UsuarioLogado | null => {
  const raw = localStorage.getItem('nexus:user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error('Erro ao ler usuário do localStorage:', error);
    localStorage.removeItem('nexus:user');
    return null;
  }
};

export const getHomeByTipoConta = (tipoConta: TipoConta) => {
  if (tipoConta === 'admin') return '/admin';
  if (tipoConta === 'prestador') return '/provider';
  return '/dashboard';
};

export const atualizarPerfil = async (
  id: number,
  nome: string,
  avatarUrl: string | null
): Promise<UsuarioLogado> => {
  const response = await fetch(`${API_URL}/perfil`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, nome, avatarUrl }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.erro || 'Falha ao atualizar perfil');
  }

  // Atualiza o localStorage com os novos dados
  localStorage.setItem('nexus:user', JSON.stringify(data.usuario));
  return data.usuario;
};
