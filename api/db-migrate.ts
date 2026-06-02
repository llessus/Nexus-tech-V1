import type { VercelRequest, VercelResponse } from '@vercel/node';
import { runMigration } from '../src/database/migrate';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Use POST para executar a migração.' });
  }

  try {
    await runMigration();
    return res.json({ sucesso: true, mensagem: 'Migração executada com sucesso!' });
  } catch (erro) {
    console.error('Erro na migração:', erro);
    return res.status(500).json({ erro: 'Erro ao executar a migração.', detalhes: String(erro) });
  }
}
