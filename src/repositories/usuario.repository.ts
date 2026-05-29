import { db } from '../database/client';
import { RegistrarUsuarioDto } from '../dtos/auth.dto';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  tipoConta: 'cliente' | 'prestador' | 'admin';
}

export interface UsuarioComSenha extends Usuario {
  senhaHash: string;
}

const toUsuario = (row: any): Usuario => ({
  id: row.id,
  nome: row.nome,
  email: row.email,
  tipoConta: row.tipo_conta,
});

const toUsuarioComSenha = (row: any): UsuarioComSenha => ({
  ...toUsuario(row),
  senhaHash: row.senha_hash,
});

export const listarUsuarios = (): Usuario[] => {
  const rows = db.prepare(
    'SELECT id, nome, email, tipo_conta FROM usuarios ORDER BY id'
  ).all();

  return rows.map(toUsuario);
};

export const buscarUsuarioPorEmail = (email: string): UsuarioComSenha | null => {
  const row = db.prepare(
    'SELECT id, nome, email, senha_hash, tipo_conta FROM usuarios WHERE email = ? LIMIT 1'
  ).get(email.toLowerCase()) as any;

  return row ? toUsuarioComSenha(row) : null;
};

export const criarUsuario = (
  usuario: RegistrarUsuarioDto,
  senhaHash: string
): Usuario => {
  const result = db.prepare(
    'INSERT INTO usuarios (nome, email, senha_hash, tipo_conta) VALUES (?, ?, ?, ?)'
  ).run(usuario.nome, usuario.email.toLowerCase(), senhaHash, usuario.tipoConta);

  if (usuario.tipoConta === 'prestador') {
    const userId = Number(result.lastInsertRowid);
    db.prepare(
      'INSERT INTO talentos (nome, email, role, hourly_rate, skills, bio, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(
      usuario.nome,
      usuario.email.toLowerCase(),
      'Prestador de Serviços Tech',
      120.0,
      JSON.stringify(['TypeScript', 'React', 'Node.js']),
      'Desenvolvedor de software focado em entregar soluções de alto nível.',
      userId
    );
  }

  return {
    id: Number(result.lastInsertRowid),
    nome: usuario.nome,
    email: usuario.email.toLowerCase(),
    tipoConta: usuario.tipoConta,
  };
};
