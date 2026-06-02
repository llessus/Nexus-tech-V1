import { getSQL } from '../database/client.js';
import { RegistrarUsuarioDto } from '../dtos/auth.dto.js';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipoConta: 'cliente' | 'prestador' | 'admin';
  avatarUrl?: string | null;
}

export interface UsuarioComSenha extends Usuario {
  senhaHash: string;
}

const toUsuario = (row: any): Usuario => ({
  id: row.id,
  nome: row.nome,
  email: row.email,
  tipoConta: row.tipo_conta,
  avatarUrl: row.avatar_url,
});

const toUsuarioComSenha = (row: any): UsuarioComSenha => ({
  ...toUsuario(row),
  senhaHash: row.senha_hash,
});

export const listarUsuarios = async (): Promise<Usuario[]> => {
  const sql = getSQL();
  const rows = await sql`SELECT id, nome, email, tipo_conta, avatar_url FROM usuarios ORDER BY id`;
  return rows.map(toUsuario);
};

export const buscarUsuarioPorEmail = async (email: string): Promise<UsuarioComSenha | null> => {
  const sql = getSQL();
  const rows = await sql`
    SELECT id, nome, email, senha_hash, tipo_conta, avatar_url 
    FROM usuarios WHERE email = ${email.toLowerCase()} LIMIT 1
  `;
  return rows.length > 0 ? toUsuarioComSenha(rows[0]) : null;
};

export const criarUsuario = async (
  usuario: RegistrarUsuarioDto,
  senhaHash: string
): Promise<Usuario> => {
  const sql = getSQL();

  const inserted = await sql`
    INSERT INTO usuarios (nome, email, senha_hash, tipo_conta)
    VALUES (${usuario.nome}, ${usuario.email.toLowerCase()}, ${senhaHash}, ${usuario.tipoConta})
    RETURNING id
  `;

  const userId = inserted[0].id;

  if (usuario.tipoConta === 'prestador') {
    await sql`
      INSERT INTO talentos (nome, email, role, hourly_rate, skills, bio, usuario_id)
      VALUES (
        ${usuario.nome},
        ${usuario.email.toLowerCase()},
        'Prestador de Serviços Tech',
        120.0,
        ${JSON.stringify(['TypeScript', 'React', 'Node.js'])},
        'Desenvolvedor de software focado em entregar soluções de alto nível.',
        ${userId}
      )
    `;
  }

  return {
    id: userId,
    nome: usuario.nome,
    email: usuario.email.toLowerCase(),
    tipoConta: usuario.tipoConta,
    avatarUrl: null,
  };
};

export const atualizarUsuario = async (
  id: number,
  nome: string,
  avatarUrl: string | null
): Promise<Usuario | null> => {
  const sql = getSQL();
  
  const updated = await sql`
    UPDATE usuarios 
    SET nome = ${nome}, avatar_url = ${avatarUrl}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, nome, email, tipo_conta, avatar_url
  `;

  if (updated.length === 0) return null;

  // Se o usuário for um prestador, sincronizar nome e avatar_url no talento dele
  if (updated[0].tipo_conta === 'prestador') {
    await sql`
      UPDATE talentos
      SET nome = ${nome}, avatar_url = ${avatarUrl}, updated_at = NOW()
      WHERE usuario_id = ${id}
    `;
  }

  return toUsuario(updated[0]);
};

export const buscarUsuarioPorId = async (id: number): Promise<Usuario | null> => {
  const sql = getSQL();
  const rows = await sql`
    SELECT id, nome, email, tipo_conta, avatar_url 
    FROM usuarios WHERE id = ${id} LIMIT 1
  `;
  return rows.length > 0 ? toUsuario(rows[0]) : null;
};
