import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as mensagemRepository from '../../../src/repositories/mensagem.repository';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const usuarioId = Number(req.query.usuarioId);

  if (isNaN(usuarioId)) {
    return res.status(400).json({ erro: 'O usuarioId deve ser um número válido.' });
  }

  try {
    const contatos = await mensagemRepository.obterContatosRecentes(usuarioId);
    return res.json(contatos);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
  }
}
