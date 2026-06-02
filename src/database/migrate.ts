import { getSQL } from './client.js';
import { criarHashSenha } from '../utils/password.js';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha_hash TEXT NOT NULL,
  tipo_conta TEXT NOT NULL CHECK (tipo_conta IN ('cliente', 'prestador', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS talentos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL,
  hourly_rate NUMERIC(10,2) NOT NULL CHECK (hourly_rate > 0),
  skills TEXT NOT NULL DEFAULT '[]',
  bio TEXT,
  avatar_url TEXT,
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  preco NUMERIC(10,2) NOT NULL CHECK (preco > 0),
  descricao TEXT,
  imagem_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS servicos (
  id SERIAL PRIMARY KEY,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  preco NUMERIC(10,2) NOT NULL CHECK (preco > 0),
  talento_id INTEGER NOT NULL REFERENCES talentos(id) ON DELETE CASCADE,
  imagem_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_produtos_nome ON produtos (nome);
CREATE INDEX IF NOT EXISTS idx_talentos_nome ON talentos (nome);
CREATE INDEX IF NOT EXISTS idx_talentos_usuario_id ON talentos (usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios (email);
CREATE INDEX IF NOT EXISTS idx_servicos_titulo ON servicos (titulo);
CREATE INDEX IF NOT EXISTS idx_servicos_talento_id ON servicos (talento_id);

CREATE TABLE IF NOT EXISTS contratacoes (
  id SERIAL PRIMARY KEY,
  cliente_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  talento_id INTEGER NOT NULL REFERENCES talentos(id) ON DELETE CASCADE,
  horas INTEGER NOT NULL,
  valor_total NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Confirmado',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contratacoes_cliente_id ON contratacoes (cliente_id);
CREATE INDEX IF NOT EXISTS idx_contratacoes_talento_id ON contratacoes (talento_id);

CREATE TABLE IF NOT EXISTS mensagens (
  id SERIAL PRIMARY KEY,
  remetente_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  destinatario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  conteudo TEXT NOT NULL,
  lida BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mensagens_remetente ON mensagens (remetente_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_destinatario ON mensagens (destinatario_id);
CREATE INDEX IF NOT EXISTS idx_mensagens_conversa ON mensagens (remetente_id, destinatario_id, created_at);
`;

export async function runMigration() {
  const sql = getSQL();

  // Executa o schema (cria tabelas) de forma sequencial
  const statements = SCHEMA.split(';').map(s => s.trim()).filter(Boolean);
  for (const statement of statements) {
    await sql.query(statement);
  }

  // Garante que a coluna avatar_url exista na tabela usuarios
  try {
    await sql.query('ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS avatar_url TEXT');
  } catch (err) {
    console.error('Erro ao adicionar coluna avatar_url na tabela usuarios:', err);
  }

  // Seed: insere o usuário inicial se ainda não existir
  const existingUsers = await sql`SELECT id FROM usuarios WHERE email = 'brendon@gmail.com'`;

  let brendonId: number;

  if (existingUsers.length === 0) {
    const senhaHash = criarHashSenha('brendon12');
    const inserted = await sql`
      INSERT INTO usuarios (nome, email, senha_hash, tipo_conta)
      VALUES ('Brendon', 'brendon@gmail.com', ${senhaHash}, 'prestador')
      RETURNING id
    `;
    brendonId = inserted[0].id;
    console.log('Usuário seed criado: brendon@gmail.com / brendon12');
  } else {
    brendonId = existingUsers[0].id;
  }

  // Seed de talento: garante que Brendon tenha um perfil de talento
  const existingTalent = await sql`SELECT id FROM talentos WHERE email = 'brendon@gmail.com'`;

  if (existingTalent.length === 0) {
    await sql`
      INSERT INTO talentos (nome, email, role, hourly_rate, skills, bio, usuario_id)
      VALUES (
        'Brendon',
        'brendon@gmail.com',
        'Full Stack Developer Senior',
        150.0,
        ${JSON.stringify(['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'SQLite'])},
        'Desenvolvedor full stack com vasta experiência em NodeJS e bancos SQL.',
        ${brendonId}
      )
    `;
    console.log('Perfil de talento criado para: Brendon');
  } else {
    // Atualiza usuario_id do Brendon caso esteja nulo
    await sql`UPDATE talentos SET usuario_id = ${brendonId} WHERE email = 'brendon@gmail.com' AND usuario_id IS NULL`;
  }

  // Atualizar outros talentos que possam estar sem usuario_id
  await sql`
    UPDATE talentos
    SET usuario_id = (SELECT id FROM usuarios WHERE usuarios.email = talentos.email)
    WHERE usuario_id IS NULL
  `;

  console.log('Banco de dados preparado com sucesso.');
}
