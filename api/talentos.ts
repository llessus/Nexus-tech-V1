import type { VercelRequest, VercelResponse } from '@vercel/node';
import { criarTalentoDto, atualizarTalentoDto } from '../src/dtos/talento.dto.js';
import * as talentoRepository from '../src/repositories/talento.repository.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '';
  const path = url.split('?')[0];
  const parts = path.split('/').filter(Boolean);
  
  const idStr = parts[2];
  const id = idStr ? Number(idStr) : null;

  if (id === null) {
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
  } else {
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    }

    if (req.method === 'GET') {
      try {
        const talento = await talentoRepository.obterTalentoPorId(id);
        if (!talento) return res.status(404).json({ erro: 'Talento não encontrado.' });
        return res.json(talento);
      } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
      }
    }

    if (req.method === 'PUT') {
      const validacao = criarTalentoDto.safeParse(req.body);
      if (!validacao.success) return res.status(400).json(validacao.error.flatten().fieldErrors);

      try {
        const talento = await talentoRepository.substituirTalento(id, validacao.data);
        if (!talento) return res.status(404).json({ erro: 'Talento não encontrado.' });
        return res.json(talento);
      } catch (erro: any) {
        if (erro?.message?.includes('unique') || erro?.message?.includes('duplicate')) {
          return res.status(409).json({ erro: 'Já existe um talento cadastrado com este e-mail.' });
        }
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
      }
    }

    if (req.method === 'PATCH') {
      const validacao = atualizarTalentoDto.safeParse(req.body);
      if (!validacao.success) return res.status(400).json(validacao.error.flatten().fieldErrors);

      try {
        const talento = await talentoRepository.atualizarTalento(id, validacao.data);
        if (!talento) return res.status(404).json({ erro: 'Talento não encontrado.' });
        return res.json(talento);
      } catch (erro: any) {
        if (erro?.message?.includes('unique') || erro?.message?.includes('duplicate')) {
          return res.status(409).json({ erro: 'Já existe um talento cadastrado com este e-mail.' });
        }
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
      }
    }

    if (req.method === 'DELETE') {
      try {
        const removido = await talentoRepository.removerTalento(id);
        if (!removido) return res.status(404).json({ erro: 'Talento não encontrado.' });
        return res.status(204).end();
      } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
      }
    }
  }

  return res.status(405).json({ erro: 'Método não permitido.' });
}
