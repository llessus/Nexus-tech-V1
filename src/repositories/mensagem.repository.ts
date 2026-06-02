import { getSQL } from '../database/client.js';

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
}

const toMensagem = (row: any): Mensagem => ({
  id: row.id,
  remetenteId: row.remetente_id,
  destinatarioId: row.destinatario_id,
  conteudo: row.conteudo,
  lida: row.lida,
  createdAt: row.created_at,
});

export const enviarMensagem = async (
  remetenteId: number,
  destinatarioId: number,
  conteudo: string
): Promise<Mensagem> => {
  const sql = getSQL();

  const inserted = await sql`
    INSERT INTO mensagens (remetente_id, destinatario_id, conteudo, lida)
    VALUES (${remetenteId}, ${destinatarioId}, ${conteudo}, false)
    RETURNING *
  `;

  return toMensagem(inserted[0]);
};

export const obterConversa = async (usuarioId: number, outroId: number): Promise<Mensagem[]> => {
  const sql = getSQL();

  const rows = await sql`
    SELECT * FROM mensagens
    WHERE (remetente_id = ${usuarioId} AND destinatario_id = ${outroId})
       OR (remetente_id = ${outroId} AND destinatario_id = ${usuarioId})
    ORDER BY created_at ASC, id ASC
  `;

  return rows.map(toMensagem);
};

export const marcarConversaComoLida = async (usuarioId: number, outroId: number): Promise<void> => {
  const sql = getSQL();
  await sql`
    UPDATE mensagens
    SET lida = true
    WHERE remetente_id = ${outroId} AND destinatario_id = ${usuarioId} AND lida = false
  `;
};

export const contarNaoLidas = async (usuarioId: number): Promise<number> => {
  const sql = getSQL();
  const rows = await sql`
    SELECT COUNT(*)::int as count FROM mensagens
    WHERE destinatario_id = ${usuarioId} AND lida = false
  `;
  return rows[0]?.count ?? 0;
};

export const obterContatosRecentes = async (usuarioId: number): Promise<ContatoChat[]> => {
  const sql = getSQL();

  // 1. Encontra todos os IDs de usuários que interagiram com usuarioId
  const interacoes = await sql`
    SELECT DISTINCT
      CASE WHEN remetente_id = ${usuarioId} THEN destinatario_id ELSE remetente_id END as outro_id
    FROM mensagens
    WHERE remetente_id = ${usuarioId} OR destinatario_id = ${usuarioId}
  `;

  const contatos: ContatoChat[] = [];

  for (const { outro_id } of interacoes) {
    const usuarioRows = await sql`SELECT id, nome, email, tipo_conta FROM usuarios WHERE id = ${outro_id}`;
    if (usuarioRows.length === 0) continue;
    const usuarioInfo = usuarioRows[0];

    const ultimaMsgRows = await sql`
      SELECT conteudo, created_at
      FROM mensagens
      WHERE (remetente_id = ${usuarioId} AND destinatario_id = ${outro_id})
         OR (remetente_id = ${outro_id} AND destinatario_id = ${usuarioId})
      ORDER BY id DESC LIMIT 1
    `;
    const ultimaMsg = ultimaMsgRows[0];

    const naoLidasRows = await sql`
      SELECT COUNT(*)::int as count
      FROM mensagens
      WHERE remetente_id = ${outro_id} AND destinatario_id = ${usuarioId} AND lida = false
    `;

    contatos.push({
      id: usuarioInfo.id,
      nome: usuarioInfo.nome,
      email: usuarioInfo.email,
      tipoConta: usuarioInfo.tipo_conta,
      ultimaMensagem: ultimaMsg?.conteudo || '',
      dataUltimaMensagem: ultimaMsg?.created_at || '',
      naoLidas: naoLidasRows[0]?.count ?? 0,
    });
  }

  // Garante que outros prestadores/clientes de contratações ativas apareçam como contatos elegíveis
  const contratacoes = await sql`
    SELECT DISTINCT
      CASE WHEN c.cliente_id = ${usuarioId} THEN t.usuario_id ELSE c.cliente_id END as outro_usuario_id
    FROM contratacoes c
    JOIN talentos t ON c.talento_id = t.id
    WHERE c.cliente_id = ${usuarioId} OR t.usuario_id = ${usuarioId}
  `;

  for (const c of contratacoes) {
    if (!c.outro_usuario_id || c.outro_usuario_id === usuarioId) continue;
    if (contatos.some(con => con.id === c.outro_usuario_id)) continue;

    const usuarioRows = await sql`SELECT id, nome, email, tipo_conta FROM usuarios WHERE id = ${c.outro_usuario_id}`;
    if (usuarioRows.length === 0) continue;
    const usuarioInfo = usuarioRows[0];

    contatos.push({
      id: usuarioInfo.id,
      nome: usuarioInfo.nome,
      email: usuarioInfo.email,
      tipoConta: usuarioInfo.tipo_conta,
      ultimaMensagem: '',
      dataUltimaMensagem: '',
      naoLidas: 0,
    });
  }

  // Ordena pela data da última mensagem decrescente
  return contatos.sort((a, b) => b.dataUltimaMensagem.localeCompare(a.dataUltimaMensagem));
};
