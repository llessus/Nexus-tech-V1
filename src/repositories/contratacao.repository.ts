import { db } from '../database/client';

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
  valorTotal: row.valor_total,
  status: row.status,
  createdAt: row.created_at,
});

export const criarContratacao = (
  clienteId: number,
  talentoId: number,
  horas: number,
  valorTotal: number
): Contratacao => {
  const result = db.prepare(
    'INSERT INTO contratacoes (cliente_id, talento_id, horas, valor_total) VALUES (?, ?, ?, ?)'
  ).run(clienteId, talentoId, horas, valorTotal);

  const inserted = db.prepare('SELECT * FROM contratacoes WHERE id = ?').get(result.lastInsertRowid) as any;
  return toContratacao(inserted);
};

export const listarContratacoesPorCliente = (clienteId: number): ContratacaoComTalento[] => {
  const rows = db.prepare(`
    SELECT c.*, t.nome as talento_nome, t.role as talento_role, t.avatar_url as talento_avatar_url
    FROM contratacoes c
    JOIN talentos t ON c.talento_id = t.id
    WHERE c.cliente_id = ?
    ORDER BY c.id DESC
  `).all(clienteId) as any[];

  return rows.map(row => ({
    ...toContratacao(row),
    talentoNome: row.talento_nome,
    talentoRole: row.talento_role,
    talentoAvatarUrl: row.talento_avatar_url,
  }));
};
