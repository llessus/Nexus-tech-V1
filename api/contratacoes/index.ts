import type { VercelRequest, VercelResponse } from '@vercel/node';
import { criarContratacaoDto } from '../../src/dtos/contratacao.dto';
import * as contratacaoRepository from '../../src/repositories/contratacao.repository';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const validacao = criarContratacaoDto.safeParse(req.body);

  if (!validacao.success) {
    return res.status(400).json(validacao.error.flatten().fieldErrors);
  }

  try {
    const { clienteId, talentoId, horas, valorTotal } = validacao.data;
    const novaContratacao = await contratacaoRepository.criarContratacao(
      clienteId,
      talentoId,
      horas,
      valorTotal
    );
    return res.status(201).json(novaContratacao);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
  }
}
