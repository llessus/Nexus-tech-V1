import { db } from '../database/client';

export interface Mensagem {
  id: number;
  remetenteId: number;
  destinatarioId: number;
  conteudo: string;
  lida: number;
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
}

const toMensagem = (row: any): Mensagem => ({
  id: row.id,
  remetenteId: row.remetente_id,
  destinatarioId: row.destinatario_id,
  conteudo: row.conteudo,
  lida: row.lida,
  createdAt: row.created_at,
});

export const enviarMensagem = (
  remetenteId: number,
  destinatarioId: number,
  conteudo: string
): Mensagem => {
  const result = db.prepare(
    'INSERT INTO mensagens (remetente_id, destinatario_id, conteudo, lida) VALUES (?, ?, ?, 0)'
  ).run(remetenteId, destinatarioId, conteudo);

  const inserted = db.prepare('SELECT * FROM mensagens WHERE id = ?').get(result.lastInsertRowid) as any;
  return toMensagem(inserted);
};

export const obterConversa = (usuarioId: number, outroId: number): Mensagem[] => {
  const rows = db.prepare(`
    SELECT * FROM mensagens
    WHERE (remetente_id = ? AND destinatario_id = ?)
       OR (remetente_id = ? AND destinatario_id = ?)
    ORDER BY created_at ASC, id ASC
  `).all(usuarioId, outroId, outroId, usuarioId) as any[];

  return rows.map(toMensagem);
};

export const marcarConversaComoLida = (usuarioId: number, outroId: number): void => {
  db.prepare(`
    UPDATE mensagens
    SET lida = 1
    WHERE remetente_id = ? AND destinatario_id = ? AND lida = 0
  `).run(outroId, usuarioId);
};

export const contarNaoLidas = (usuarioId: number): number => {
  const row = db.prepare(`
    SELECT COUNT(*) as count FROM mensagens
    WHERE destinatario_id = ? AND lida = 0
  `).get(usuarioId) as { count: number };

  return row ? row.count : 0;
};

export const obterContatosRecentes = (usuarioId: number): ContatoChat[] => {
  // 1. Encontra todos os IDs de usuários que interagiram com usuarioId
  const interacoes = db.prepare(`
    SELECT DISTINCT 
      CASE WHEN remetente_id = ? THEN destinatario_id ELSE remetente_id END as outro_id
    FROM mensagens
    WHERE remetente_id = ? OR destinatario_id = ?
  `).all(usuarioId, usuarioId, usuarioId) as { outro_id: number }[];

  const contatos: ContatoChat[] = [];

  for (const { outro_id } of interacoes) {
    const usuarioInfo = db.prepare('SELECT id, nome, email, tipo_conta FROM usuarios WHERE id = ?').get(outro_id) as any;
    if (!usuarioInfo) continue;

    const ultimaMsg = db.prepare(`
      SELECT conteudo, created_at
      FROM mensagens
      WHERE (remetente_id = ? AND destinatario_id = ?) OR (remetente_id = ? AND destinatario_id = ?)
      ORDER BY id DESC LIMIT 1
    `).get(usuarioId, outro_id, outro_id, usuarioId) as any;

    const naoLidas = db.prepare(`
      SELECT COUNT(*) as count
      FROM mensagens
      WHERE remetente_id = ? AND destinatario_id = ? AND lida = 0
    `).get(outro_id, usuarioId) as { count: number };

    contatos.push({
      id: usuarioInfo.id,
      nome: usuarioInfo.nome,
      email: usuarioInfo.email,
      tipoConta: usuarioInfo.tipo_conta,
      ultimaMensagem: ultimaMsg?.conteudo || '',
      dataUltimaMensagem: ultimaMsg?.created_at || '',
      naoLidas: naoLidas.count
    });
  }

  // Garante que outros prestadores/clientes de contratações ativas do usuário apareçam como contatos elegíveis, mesmo se ainda sem mensagens
  const contratacoes = db.prepare(`
    SELECT DISTINCT 
      CASE WHEN c.cliente_id = ? THEN t.usuario_id ELSE c.cliente_id END as outro_usuario_id
    FROM contratacoes c
    JOIN talentos t ON c.talento_id = t.id
    WHERE c.cliente_id = ? OR t.usuario_id = ?
  `).all(usuarioId, usuarioId, usuarioId) as { outro_usuario_id: number | null }[];

  for (const c of contratacoes) {
    if (!c.outro_usuario_id || c.outro_usuario_id === usuarioId) continue;
    if (contatos.some(con => con.id === c.outro_usuario_id)) continue;

    const usuarioInfo = db.prepare('SELECT id, nome, email, tipo_conta FROM usuarios WHERE id = ?').get(c.outro_usuario_id) as any;
    if (!usuarioInfo) continue;

    contatos.push({
      id: usuarioInfo.id,
      nome: usuarioInfo.nome,
      email: usuarioInfo.email,
      tipoConta: usuarioInfo.tipo_conta,
      ultimaMensagem: '',
      dataUltimaMensagem: '',
      naoLidas: 0
    });
  }

  // Ordena pela data da última mensagem decrescente (contatos com mensagens recentes primeiro)
  return contatos.sort((a, b) => b.dataUltimaMensagem.localeCompare(a.dataUltimaMensagem));
};
