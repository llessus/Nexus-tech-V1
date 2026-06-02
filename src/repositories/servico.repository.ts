import { getSQL } from '../database/client';
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
  preco: Number(row.preco),
  talentoId: row.talento_id,
  imagemUrl: row.imagem_url,
});

export const listarServicos = async (titulo?: string): Promise<Servico[]> => {
  const sql = getSQL();

  if (titulo) {
    const rows = await sql`SELECT * FROM servicos WHERE titulo ILIKE ${'%' + titulo + '%'} ORDER BY id`;
    return rows.map(toServico);
  }

  const rows = await sql`SELECT * FROM servicos ORDER BY id`;
  return rows.map(toServico);
};

export const obterServicoPorId = async (id: number): Promise<Servico | null> => {
  const sql = getSQL();
  const rows = await sql`SELECT * FROM servicos WHERE id = ${id}`;
  return rows.length > 0 ? toServico(rows[0]) : null;
};

export const criarServico = async (servico: CriarServicoDto): Promise<Servico> => {
  const sql = getSQL();

  const inserted = await sql`
    INSERT INTO servicos (titulo, descricao, preco, talento_id, imagem_url)
    VALUES (${servico.titulo}, ${servico.descricao}, ${servico.preco}, ${servico.talentoId}, ${servico.imagemUrl ?? null})
    RETURNING *
  `;

  return toServico(inserted[0]);
};

export const substituirServico = async (id: number, servico: CriarServicoDto): Promise<Servico | null> => {
  const sql = getSQL();

  const updated = await sql`
    UPDATE servicos SET titulo = ${servico.titulo}, descricao = ${servico.descricao},
           preco = ${servico.preco}, talento_id = ${servico.talentoId},
           imagem_url = ${servico.imagemUrl ?? null}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return updated.length > 0 ? toServico(updated[0]) : null;
};

export const atualizarServico = async (id: number, servico: AtualizarServicoDto): Promise<Servico | null> => {
  const existente = await obterServicoPorId(id);
  if (!existente) return null;

  const titulo = servico.titulo ?? existente.titulo;
  const descricao = servico.descricao ?? existente.descricao;
  const preco = servico.preco ?? existente.preco;
  const talentoId = servico.talentoId ?? existente.talentoId;
  const imagemUrl = servico.imagemUrl ?? existente.imagemUrl;

  const sql = getSQL();
  const updated = await sql`
    UPDATE servicos SET titulo = ${titulo}, descricao = ${descricao},
           preco = ${preco}, talento_id = ${talentoId},
           imagem_url = ${imagemUrl ?? null}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return updated.length > 0 ? toServico(updated[0]) : null;
};

export const removerServico = async (id: number): Promise<boolean> => {
  const sql = getSQL();
  const result = await sql`DELETE FROM servicos WHERE id = ${id} RETURNING id`;
  return result.length > 0;
};
