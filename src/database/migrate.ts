import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { db } from './client';
import { criarHashSenha } from '../utils/password';

const schemaPath = resolve(process.cwd(), 'src/database/schema.sql');
const schema = readFileSync(schemaPath, 'utf-8');

// Adiciona coluna usuario_id à tabela talentos se não existir (antes de rodar schema.sql para evitar erros de criação do índice)
try {
  db.prepare('SELECT usuario_id FROM talentos LIMIT 1').get();
} catch (e) {
  try {
    db.exec('ALTER TABLE talentos ADD COLUMN usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE');
    console.log('Coluna usuario_id adicionada à tabela de talentos.');
  } catch (err) {
    // A tabela pode não existir ainda, o db.exec(schema) abaixo a criará
  }
}

// Executa o schema (cria tabelas)
db.exec(schema);

// Seed: insere o usuário inicial se ainda não existir
let usuarioBrendon = db.prepare('SELECT id FROM usuarios WHERE email = ?').get('brendon@gmail.com') as any;

if (!usuarioBrendon) {
  const senhaHash = criarHashSenha('brendon12');
  const result = db.prepare(
    'INSERT INTO usuarios (nome, email, senha_hash, tipo_conta) VALUES (?, ?, ?, ?)'
  ).run('Brendon', 'brendon@gmail.com', senhaHash, 'prestador');
  usuarioBrendon = { id: Number(result.lastInsertRowid) };
  console.log('Usuário seed criado: brendon@gmail.com / brendon12');
}

// Seed de talentos: garante que o usuário prestador seed ('Brendon') tenha um perfil de talento associado e limpa os mocks antigos
db.prepare("DELETE FROM talentos WHERE email IN ('billie@nexus.tech', 'sabrina@nexus.tech', 'neymar@nexus.tech', 'toguro@nexus.tech')").run();

const existeTalentoBrendon = db.prepare('SELECT id FROM talentos WHERE email = ?').get('brendon@gmail.com');
if (!existeTalentoBrendon) {
  db.prepare(
    'INSERT INTO talentos (nome, email, role, hourly_rate, skills, bio, usuario_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(
    'Brendon',
    'brendon@gmail.com',
    'Full Stack Developer Senior',
    150.0,
    JSON.stringify(['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'SQLite']),
    'Desenvolvedor full stack com vasta experiência em NodeJS e bancos SQL.',
    usuarioBrendon.id
  );
  console.log('Perfil de talento criado para: Brendon');
} else {
  // Atualiza usuario_id do Brendon caso esteja nulo
  db.prepare('UPDATE talentos SET usuario_id = ? WHERE email = ?').run(usuarioBrendon.id, 'brendon@gmail.com');
}

// Atualizar outros talentos que possam estar sem usuario_id
db.exec(`
  UPDATE talentos 
  SET usuario_id = (SELECT id FROM usuarios WHERE usuarios.email = talentos.email)
  WHERE usuario_id IS NULL
`);

console.log('Banco de dados preparado com sucesso.');
