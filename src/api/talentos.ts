// Para simplificar, assumimos que a API está rodando localmente na porta 3000
const API_URL = 'http://localhost:3000/talentos';

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
