const API_URL = '/api/talentos';

export interface Talento {
  id: number;
  nome: string;
  email: string;
  role: string;
  hourlyRate: number;
  skills: string[];
  bio?: string | null;
  avatarUrl?: string | null;
  usuarioId?: number | null;
  portfolioImages?: string[];
}

// GET: Listar talentos, opcionalmente filtrando por nome
export const listarTalentos = async (nome?: string): Promise<Talento[]> => {
  const url = nome ? `${API_URL}?nome=${encodeURIComponent(nome)}` : API_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Falha ao buscar talentos');
  }
  
  return response.json();
};

export const obterTalentoPorId = async (id: number): Promise<Talento> => {
  const response = await fetch(`${API_URL}/${id}`);
  
  if (!response.ok) {
    throw new Error('Falha ao buscar talento');
  }
  
  return response.json();
};

export const obterTalentoPorUsuarioId = async (usuarioId: number): Promise<Talento> => {
  const response = await fetch(`${API_URL}?usuarioId=${usuarioId}`);
  
  if (!response.ok) {
    throw new Error('Falha ao buscar talento do usuário');
  }
  
  return response.json();
};

export const atualizarTalento = async (id: number, payload: Partial<Talento>): Promise<Talento> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.erro || 'Falha ao atualizar perfil de talento');
  }
  
  return data;
};
