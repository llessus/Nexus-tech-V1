const API_URL = '/api/contratacoes';

export interface Contratacao {
  id: number;
  clienteId: number;
  talentoId: number;
  horas: number;
  valorTotal: number;
  status: string;
  createdAt: string;
}

export interface ContratacaoComTalento extends Contratacao {
  talentoNome: string;
  talentoRole: string;
  talentoAvatarUrl: string | null;
}

export const criarContratacao = async (
  clienteId: number,
  talentoId: number,
  horas: number,
  valorTotal: number
): Promise<Contratacao> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ clienteId, talentoId, horas, valorTotal }),
  });

  if (!response.ok) {
    throw new Error('Falha ao criar contratação');
  }

  return response.json();
};

export const listarContratacoesPorCliente = async (
  clienteId: number
): Promise<ContratacaoComTalento[]> => {
  const response = await fetch(`${API_URL}/cliente/${clienteId}`);

  if (!response.ok) {
    throw new Error('Falha ao listar contratações');
  }

  return response.json();
};
