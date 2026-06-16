const API_URL = '/api/mensagens';

export interface Mensagem {
  id: number;
  remetenteId: number;
  destinatarioId: number;
  conteudo: string;
  lida: boolean;
  createdAt: string;
}

export interface ContatoChat {
  id: number;
  nome: string;
  email: string;
  tipoConta: 'cliente' | 'prestador' | 'admin';
  ultimaMensagem: string;
  dataUltimaMensagem: string;
  naoLidas: number;
  avatarUrl?: string | null;
}

export const enviarMensagem = async (
  remetenteId: number,
  destinatarioId: number,
  conteudo: string
): Promise<Mensagem> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ remetenteId, destinatarioId, conteudo }),
  });

  if (!response.ok) {
    throw new Error('Falha ao enviar mensagem');
  }

  return response.json();
};

export const obterConversa = async (
  usuarioId: number,
  outroId: number
): Promise<Mensagem[]> => {
  const response = await fetch(`${API_URL}/${usuarioId}/conversa/${outroId}`);

  if (!response.ok) {
    throw new Error('Falha ao carregar conversa');
  }

  return response.json();
};

export const obterContatos = async (
  usuarioId: number
): Promise<ContatoChat[]> => {
  const response = await fetch(`${API_URL}/${usuarioId}/contatos`);

  if (!response.ok) {
    throw new Error('Falha ao buscar contatos');
  }

  return response.json();
};

export const marcarConversaComoLida = async (
  usuarioId: number,
  outroId: number
): Promise<void> => {
  const response = await fetch(`${API_URL}/${usuarioId}/conversa/${outroId}/lida`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Falha ao marcar conversa como lida');
  }
};

export const contarNaoLidas = async (
  usuarioId: number
): Promise<number> => {
  const response = await fetch(`${API_URL}/${usuarioId}/nao-lidas`);

  if (!response.ok) {
    throw new Error('Falha ao contar mensagens não lidas');
  }

  const data = await response.json();
  return data.totalNaoLidas;
};
