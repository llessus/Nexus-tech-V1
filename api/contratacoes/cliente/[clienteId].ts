import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as contratacaoRepository from '../../../src/repositories/contratacao.repository';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const clienteId = Number(req.query.clienteId);

  if (isNaN(clienteId)) {
    return res.status(400).json({ erro: 'O clienteId deve ser um número válido.' });
  }

  try {
    const contratacoes = await contratacaoRepository.listarContratacoesPorCliente(clienteId);
    return res.json(contratacoes);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
  }
}
