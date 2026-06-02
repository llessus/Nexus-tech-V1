import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as mensagemRepository from '../../../../../src/repositories/mensagem.repository';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PATCH') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const usuarioId = Number(req.query.usuarioId);
  const outroId = Number(req.query.outroId);

  if (isNaN(usuarioId) || isNaN(outroId)) {
    return res.status(400).json({ erro: 'Os IDs fornecidos devem ser números válidos.' });
  }

  try {
    await mensagemRepository.marcarConversaComoLida(usuarioId, outroId);
    return res.status(204).send(undefined);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
  }
}
