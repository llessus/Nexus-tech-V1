import { Request, Response } from 'express';
import { criarServicoDto, atualizarServicoDto } from '../dtos/servico.dto';
import * as servicoRepository from '../repositories/servico.repository';

const erroInterno = (res: Response, erro: unknown) => {
  console.error(erro);
  res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
};

const erroRelacionamento = (erro: any) => erro?.message?.includes('FOREIGN KEY constraint failed');

export const listar = (req: Request, res: Response): void => {
  try {
    const { titulo } = req.query;
    const servicos = servicoRepository.listarServicos(typeof titulo === 'string' ? titulo : undefined);
    res.json(servicos);
  } catch (erro) {
    erroInterno(res, erro);
  }
};

export const obterPorId = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    return;
  }

  try {
    const servico = servicoRepository.obterServicoPorId(id);
    if (!servico) {
      res.status(404).json({ erro: 'Serviço não encontrado.' });
      return;
    }

    res.json(servico);
  } catch (erro) {
    erroInterno(res, erro);
  }
};

export const criar = (req: Request, res: Response): void => {
  const validacao = criarServicoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  try {
    const novoServico = servicoRepository.criarServico(validacao.data);
    res.status(201).json(novoServico);
  } catch (erro: any) {
    if (erroRelacionamento(erro)) {
      res.status(400).json({ erro: 'O talento informado não existe.' });
      return;
    }

    erroInterno(res, erro);
  }
};

export const substituir = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    return;
  }

  const validacao = criarServicoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  try {
    const servico = servicoRepository.substituirServico(id, validacao.data);
    if (!servico) {
      res.status(404).json({ erro: 'Serviço não encontrado.' });
      return;
    }

    res.json(servico);
  } catch (erro: any) {
    if (erroRelacionamento(erro)) {
      res.status(400).json({ erro: 'O talento informado não existe.' });
      return;
    }

    erroInterno(res, erro);
  }
};

export const atualizar = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    return;
  }

  const validacao = atualizarServicoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  try {
    const servico = servicoRepository.atualizarServico(id, validacao.data);
    if (!servico) {
      res.status(404).json({ erro: 'Serviço não encontrado.' });
      return;
    }

    res.json(servico);
  } catch (erro: any) {
    if (erroRelacionamento(erro)) {
      res.status(400).json({ erro: 'O talento informado não existe.' });
      return;
    }

    erroInterno(res, erro);
  }
};

export const remover = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    return;
  }

  try {
    const removido = servicoRepository.removerServico(id);
    if (!removido) {
      res.status(404).json({ erro: 'Serviço não encontrado.' });
      return;
    }

    res.status(204).send();
  } catch (erro) {
    erroInterno(res, erro);
  }
};
