import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as adminRepository from '../src/repositories/admin.repository.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  try {
    const stats = await adminRepository.obterStats();
    const usuarios = await adminRepository.listarTodosUsuarios();
    const contratacoes = await adminRepository.listarTodasContratacoes();
    const servicos = await adminRepository.listarTodosServicos();

    return res.json({
      stats,
      usuarios,
      contratacoes,
      servicos,
    });
  } catch (erro) {
    console.error('Erro na API do Admin:', erro);
    return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
  }
}
