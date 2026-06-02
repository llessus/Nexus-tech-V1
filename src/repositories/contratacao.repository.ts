import { getSQL } from '../database/client.js';

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

const toContratacao = (row: any): Contratacao => ({
  id: row.id,
  clienteId: row.cliente_id,
  talentoId: row.talento_id,
  horas: row.horas,
  valorTotal: Number(row.valor_total),
  status: row.status,
  createdAt: row.created_at,
});

export const criarContratacao = async (
  clienteId: number,
  talentoId: number,
  horas: number,
  valorTotal: number
): Promise<Contratacao> => {
  const sql = getSQL();

  const inserted = await sql`
    INSERT INTO contratacoes (cliente_id, talento_id, horas, valor_total)
    VALUES (${clienteId}, ${talentoId}, ${horas}, ${valorTotal})
    RETURNING *
  `;

  return toContratacao(inserted[0]);
};

export interface ContratacaoComCliente extends Contratacao {
  clienteNome: string;
  clienteEmail: string;
}

export const listarContratacoesPorCliente = async (clienteId: number): Promise<ContratacaoComTalento[]> => {
  const sql = getSQL();

  const rows = await sql`
    SELECT c.*, t.nome as talento_nome, t.role as talento_role, t.avatar_url as talento_avatar_url
    FROM contratacoes c
    JOIN talentos t ON c.talento_id = t.id
    WHERE c.cliente_id = ${clienteId}
    ORDER BY c.id DESC
  `;

  return rows.map(row => ({
    ...toContratacao(row),
    talentoNome: row.talento_nome,
    talentoRole: row.talento_role,
    talentoAvatarUrl: row.talento_avatar_url,
  }));
};

export const listarContratacoesPorTalento = async (talentoId: number): Promise<ContratacaoComCliente[]> => {
  const sql = getSQL();

  const rows = await sql`
    SELECT c.*, u.nome as cliente_nome, u.email as cliente_email
    FROM contratacoes c
    JOIN usuarios u ON c.cliente_id = u.id
    WHERE c.talento_id = ${talentoId}
    ORDER BY c.id DESC
  `;

  return rows.map(row => ({
    ...toContratacao(row),
    clienteNome: row.cliente_nome,
    clienteEmail: row.cliente_email,
  }));
};
