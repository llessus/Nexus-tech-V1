import { db } from '../database/client';
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
  hourlyRate: row.hourly_rate,
  skills: JSON.parse(row.skills || '[]'),
  bio: row.bio,
  avatarUrl: row.avatar_url,
  usuarioId: row.usuario_id,
});

export const listarTalentos = (nome?: string): Talento[] => {
  if (nome) {
    const rows = db.prepare(
      'SELECT * FROM talentos WHERE nome LIKE ? ORDER BY id'
    ).all(`%${nome}%`);
    return rows.map(toTalento);
  }

  const rows = db.prepare('SELECT * FROM talentos ORDER BY id').all();
  return rows.map(toTalento);
};

export const obterTalentoPorId = (id: number): Talento | null => {
  const row = db.prepare('SELECT * FROM talentos WHERE id = ?').get(id) as any;
  return row ? toTalento(row) : null;
};

export const criarTalento = (talento: CriarTalentoDto): Talento => {
  const result = db.prepare(
    'INSERT INTO talentos (nome, email, role, hourly_rate, skills, bio, avatar_url) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    talento.nome,
    talento.email,
    talento.role,
    talento.hourlyRate,
    JSON.stringify(talento.skills),
    talento.bio ?? null,
    talento.avatarUrl ?? null
  );

  return {
    id: Number(result.lastInsertRowid),
    nome: talento.nome,
    email: talento.email,
    role: talento.role,
    hourlyRate: talento.hourlyRate,
    skills: talento.skills,
    bio: talento.bio ?? null,
    avatarUrl: talento.avatarUrl ?? null,
  };
};

export const substituirTalento = (id: number, talento: CriarTalentoDto): Talento | null => {
  const result = db.prepare(
    'UPDATE talentos SET nome = ?, email = ?, role = ?, hourly_rate = ?, skills = ?, bio = ?, avatar_url = ?, updated_at = datetime(\'now\') WHERE id = ?'
  ).run(
    talento.nome,
    talento.email,
    talento.role,
    talento.hourlyRate,
    JSON.stringify(talento.skills),
    talento.bio ?? null,
    talento.avatarUrl ?? null,
    id
  );

  if (result.changes === 0) return null;
  return obterTalentoPorId(id);
};

export const atualizarTalento = (id: number, talento: AtualizarTalentoDto): Talento | null => {
  const existente = obterTalentoPorId(id);
  if (!existente) return null;

  const nome = talento.nome ?? existente.nome;
  const email = talento.email ?? existente.email;
  const role = talento.role ?? existente.role;
  const hourlyRate = talento.hourlyRate ?? existente.hourlyRate;
  const skills = talento.skills ?? existente.skills;
  const bio = talento.bio ?? existente.bio;
  const avatarUrl = talento.avatarUrl ?? existente.avatarUrl;

  db.prepare(
    'UPDATE talentos SET nome = ?, email = ?, role = ?, hourly_rate = ?, skills = ?, bio = ?, avatar_url = ?, updated_at = datetime(\'now\') WHERE id = ?'
  ).run(nome, email, role, hourlyRate, JSON.stringify(skills), bio ?? null, avatarUrl ?? null, id);

  return obterTalentoPorId(id);
};

export const removerTalento = (id: number): boolean => {
  const result = db.prepare('DELETE FROM talentos WHERE id = ?').run(id);
  return result.changes > 0;
};
