const API_URL = '/api/admin';

export interface AdminStats {
  totalUsuarios: number;
  servicosAtivos: number;
  totalReceita: number;
  aprovacoesPendentes: number;
}

export interface AdminUser {
  id: number;
  nome: string;
  email: string;
  tipoConta: string;
  createdAt: string;
  avatarUrl: string | null;
}

export interface AdminContratacao {
  id: number;
  clienteNome: string;
  clienteEmail: string;
  talentoNome: string;
  talentoRole: string;
  horas: number;
  valorTotal: number;
  status: string;
  createdAt: string;
}

export interface AdminServico {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  talentoNome: string;
  talentoEmail: string;
  createdAt: string;
}

export interface AdminData {
  stats: AdminStats;
  usuarios: AdminUser[];
  contratacoes: AdminContratacao[];
  servicos: AdminServico[];
}

export const obterDadosAdmin = async (): Promise<AdminData> => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error('Falha ao obter dados administrativos');
  }

  return response.json();
};
