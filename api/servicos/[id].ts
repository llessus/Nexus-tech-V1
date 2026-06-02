import type { VercelRequest, VercelResponse } from '@vercel/node';
import { criarServicoDto, atualizarServicoDto } from '../../src/dtos/servico.dto';
import * as servicoRepository from '../../src/repositories/servico.repository';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = Number(req.query.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: 'O ID deve ser um número válido.' });
  }

  if (req.method === 'GET') {
    try {
      const servico = await servicoRepository.obterServicoPorId(id);
      if (!servico) return res.status(404).json({ erro: 'Serviço não encontrado.' });
      return res.json(servico);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  if (req.method === 'PUT') {
    const validacao = criarServicoDto.safeParse(req.body);
    if (!validacao.success) return res.status(400).json(validacao.error.flatten().fieldErrors);

    try {
      const servico = await servicoRepository.substituirServico(id, validacao.data);
      if (!servico) return res.status(404).json({ erro: 'Serviço não encontrado.' });
      return res.json(servico);
    } catch (erro: any) {
      if (erro?.message?.includes('foreign key') || erro?.message?.includes('violates foreign key')) {
        return res.status(400).json({ erro: 'O talento informado não existe.' });
      }
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  if (req.method === 'PATCH') {
    const validacao = atualizarServicoDto.safeParse(req.body);
    if (!validacao.success) return res.status(400).json(validacao.error.flatten().fieldErrors);

    try {
      const servico = await servicoRepository.atualizarServico(id, validacao.data);
      if (!servico) return res.status(404).json({ erro: 'Serviço não encontrado.' });
      return res.json(servico);
    } catch (erro: any) {
      if (erro?.message?.includes('foreign key') || erro?.message?.includes('violates foreign key')) {
        return res.status(400).json({ erro: 'O talento informado não existe.' });
      }
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const removido = await servicoRepository.removerServico(id);
      if (!removido) return res.status(404).json({ erro: 'Serviço não encontrado.' });
      return res.status(204).send(undefined);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido.' });
}
