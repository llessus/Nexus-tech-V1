import { getSQL } from '../database/client';
import { criarTalentoDto, atualizarTalentoDto } from '../dtos/talento.dto';
import { z } from 'zod';

type CriarTalentoDto = z.infer<typeof criarTalentoDto>;
type AtualizarTalentoDto = z.infer<typeof atualizarTalentoDto>;

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

const toTalento = (row: any): Talento => ({
  id: row.id,
  nome: row.nome,
  email: row.email,
  role: row.role,
  hourlyRate: Number(row.hourly_rate),
  skills: typeof row.skills === 'string' ? JSON.parse(row.skills || '[]') : (row.skills || []),
  bio: row.bio,
  avatarUrl: row.avatar_url,
  usuarioId: row.usuario_id,
});

export const listarTalentos = async (nome?: string): Promise<Talento[]> => {
  const sql = getSQL();

  if (nome) {
    const rows = await sql`SELECT * FROM talentos WHERE nome ILIKE ${'%' + nome + '%'} ORDER BY id`;
    return rows.map(toTalento);
  }

  const rows = await sql`SELECT * FROM talentos ORDER BY id`;
  return rows.map(toTalento);
};

export const obterTalentoPorId = async (id: number): Promise<Talento | null> => {
  const sql = getSQL();
  const rows = await sql`SELECT * FROM talentos WHERE id = ${id}`;
  return rows.length > 0 ? toTalento(rows[0]) : null;
};

export const criarTalento = async (talento: CriarTalentoDto): Promise<Talento> => {
  const sql = getSQL();

  const inserted = await sql`
    INSERT INTO talentos (nome, email, role, hourly_rate, skills, bio, avatar_url)
    VALUES (${talento.nome}, ${talento.email}, ${talento.role}, ${talento.hourlyRate},
            ${JSON.stringify(talento.skills)}, ${talento.bio ?? null}, ${talento.avatarUrl ?? null})
    RETURNING *
  `;

  return toTalento(inserted[0]);
};

export const substituirTalento = async (id: number, talento: CriarTalentoDto): Promise<Talento | null> => {
  const sql = getSQL();

  const updated = await sql`
    UPDATE talentos SET nome = ${talento.nome}, email = ${talento.email}, role = ${talento.role},
           hourly_rate = ${talento.hourlyRate}, skills = ${JSON.stringify(talento.skills)},
           bio = ${talento.bio ?? null}, avatar_url = ${talento.avatarUrl ?? null}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return updated.length > 0 ? toTalento(updated[0]) : null;
};

export const atualizarTalento = async (id: number, talento: AtualizarTalentoDto): Promise<Talento | null> => {
  const existente = await obterTalentoPorId(id);
  if (!existente) return null;

  const nome = talento.nome ?? existente.nome;
  const email = talento.email ?? existente.email;
  const role = talento.role ?? existente.role;
  const hourlyRate = talento.hourlyRate ?? existente.hourlyRate;
  const skills = talento.skills ?? existente.skills;
  const bio = talento.bio ?? existente.bio;
  const avatarUrl = talento.avatarUrl ?? existente.avatarUrl;

  const sql = getSQL();
  const updated = await sql`
    UPDATE talentos SET nome = ${nome}, email = ${email}, role = ${role},
           hourly_rate = ${hourlyRate}, skills = ${JSON.stringify(skills)},
           bio = ${bio ?? null}, avatar_url = ${avatarUrl ?? null}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return updated.length > 0 ? toTalento(updated[0]) : null;
};

export const removerTalento = async (id: number): Promise<boolean> => {
  const sql = getSQL();
  const result = await sql`DELETE FROM talentos WHERE id = ${id} RETURNING id`;
  return result.length > 0;
};
