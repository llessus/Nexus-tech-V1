import { db } from '../database/client';
import { criarServicoDto, atualizarServicoDto } from '../dtos/servico.dto';
import { z } from 'zod';

type CriarServicoDto = z.infer<typeof criarServicoDto>;
type AtualizarServicoDto = z.infer<typeof atualizarServicoDto>;

export interface Servico {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  talentoId: number;
  imagemUrl?: string | null;
}

const toServico = (row: any): Servico => ({
  id: row.id,
  titulo: row.titulo,
  descricao: row.descricao,
  preco: row.preco,
  talentoId: row.talento_id,
  imagemUrl: row.imagem_url,
});

export const listarServicos = (titulo?: string): Servico[] => {
  if (titulo) {
    const rows = db.prepare(
      'SELECT * FROM servicos WHERE titulo LIKE ? ORDER BY id'
    ).all(`%${titulo}%`);
    return rows.map(toServico);
  }

  const rows = db.prepare('SELECT * FROM servicos ORDER BY id').all();
  return rows.map(toServico);
};

export const obterServicoPorId = (id: number): Servico | null => {
  const row = db.prepare('SELECT * FROM servicos WHERE id = ?').get(id) as any;
  return row ? toServico(row) : null;
};

export const criarServico = (servico: CriarServicoDto): Servico => {
  const result = db.prepare(
    'INSERT INTO servicos (titulo, descricao, preco, talento_id, imagem_url) VALUES (?, ?, ?, ?, ?)'
  ).run(servico.titulo, servico.descricao, servico.preco, servico.talentoId, servico.imagemUrl ?? null);

  return {
    id: Number(result.lastInsertRowid),
    titulo: servico.titulo,
    descricao: servico.descricao,
    preco: servico.preco,
    talentoId: servico.talentoId,
    imagemUrl: servico.imagemUrl ?? null,
  };
};

export const substituirServico = (id: number, servico: CriarServicoDto): Servico | null => {
  const result = db.prepare(
    'UPDATE servicos SET titulo = ?, descricao = ?, preco = ?, talento_id = ?, imagem_url = ?, updated_at = datetime(\'now\') WHERE id = ?'
  ).run(servico.titulo, servico.descricao, servico.preco, servico.talentoId, servico.imagemUrl ?? null, id);

  if (result.changes === 0) return null;
  return obterServicoPorId(id);
};

export const atualizarServico = (id: number, servico: AtualizarServicoDto): Servico | null => {
  const existente = obterServicoPorId(id);
  if (!existente) return null;

  const titulo = servico.titulo ?? existente.titulo;
  const descricao = servico.descricao ?? existente.descricao;
  const preco = servico.preco ?? existente.preco;
  const talentoId = servico.talentoId ?? existente.talentoId;
  const imagemUrl = servico.imagemUrl ?? existente.imagemUrl;

  db.prepare(
    'UPDATE servicos SET titulo = ?, descricao = ?, preco = ?, talento_id = ?, imagem_url = ?, updated_at = datetime(\'now\') WHERE id = ?'
  ).run(titulo, descricao, preco, talentoId, imagemUrl ?? null, id);

  return obterServicoPorId(id);
};

export const removerServico = (id: number): boolean => {
  const result = db.prepare('DELETE FROM servicos WHERE id = ?').run(id);
  return result.changes > 0;
};
