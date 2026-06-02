import type { VercelRequest, VercelResponse } from '@vercel/node';
import { criarContratacaoDto } from '../src/dtos/contratacao.dto';
import * as contratacaoRepository from '../src/repositories/contratacao.repository';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '';
  const path = url.split('?')[0];
  const parts = path.split('/').filter(Boolean);

  if (parts.length === 2) {
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
  } else if (parts.length === 4 && parts[2] === 'cliente') {
    if (req.method !== 'GET') {
      return res.status(405).json({ erro: 'Método não permitido.' });
    }

    const clienteId = Number(parts[3]);
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

  return res.status(404).json({ erro: 'Rota não encontrada.' });
}
