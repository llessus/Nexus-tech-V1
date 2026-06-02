import type { VercelRequest, VercelResponse } from '@vercel/node';
import { criarTalentoDto } from '../../src/dtos/talento.dto';
import * as talentoRepository from '../../src/repositories/talento.repository';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const nome = typeof req.query.nome === 'string' ? req.query.nome : undefined;
      const talentos = await talentoRepository.listarTalentos(nome);
      return res.json(talentos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  if (req.method === 'POST') {
    const validacao = criarTalentoDto.safeParse(req.body);

    if (!validacao.success) {
      return res.status(400).json(validacao.error.flatten().fieldErrors);
    }

    try {
      const novoTalento = await talentoRepository.criarTalento(validacao.data);
      return res.status(201).json(novoTalento);
    } catch (erro: any) {
      if (erro?.message?.includes('unique') || erro?.message?.includes('duplicate')) {
        return res.status(409).json({ erro: 'Já existe um talento cadastrado com este e-mail.' });
      }
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido.' });
}
