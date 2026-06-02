import type { VercelRequest, VercelResponse } from '@vercel/node';
import { criarServicoDto } from '../../src/dtos/servico.dto';
import * as servicoRepository from '../../src/repositories/servico.repository';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const titulo = typeof req.query.titulo === 'string' ? req.query.titulo : undefined;
      const servicos = await servicoRepository.listarServicos(titulo);
      return res.json(servicos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  if (req.method === 'POST') {
    const validacao = criarServicoDto.safeParse(req.body);
    if (!validacao.success) {
      return res.status(400).json(validacao.error.flatten().fieldErrors);
    }

    try {
      const novoServico = await servicoRepository.criarServico(validacao.data);
      return res.status(201).json(novoServico);
    } catch (erro: any) {
      if (erro?.message?.includes('foreign key') || erro?.message?.includes('violates foreign key')) {
        return res.status(400).json({ erro: 'O talento informado não existe.' });
      }
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido.' });
}
