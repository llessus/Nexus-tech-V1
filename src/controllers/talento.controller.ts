import { Request, Response } from 'express';
import { criarTalentoDto, atualizarTalentoDto } from '../dtos/talento.dto';
import * as talentoRepository from '../repositories/talento.repository';

const erroInterno = (res: Response, erro: unknown) => {
  console.error(erro);
  res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
};

export const listar = (req: Request, res: Response): void => {
  try {
    const { nome } = req.query;
    const talentos = talentoRepository.listarTalentos(typeof nome === 'string' ? nome : undefined);
    res.json(talentos);
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
    const talento = talentoRepository.obterTalentoPorId(id);
    if (!talento) {
      res.status(404).json({ erro: 'Talento não encontrado.' });
      return;
    }

    res.json(talento);
  } catch (erro) {
    erroInterno(res, erro);
  }
};

export const criar = (req: Request, res: Response): void => {
  const validacao = criarTalentoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  try {
    const novoTalento = talentoRepository.criarTalento(validacao.data);
    res.status(201).json(novoTalento);
  } catch (erro: any) {
    if (erro?.message?.includes('UNIQUE constraint failed')) {
      res.status(409).json({ erro: 'Já existe um talento cadastrado com este e-mail.' });
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

  const validacao = criarTalentoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  try {
    const talento = talentoRepository.substituirTalento(id, validacao.data);
    if (!talento) {
      res.status(404).json({ erro: 'Talento não encontrado.' });
      return;
    }

    res.json(talento);
  } catch (erro: any) {
    if (erro?.message?.includes('UNIQUE constraint failed')) {
      res.status(409).json({ erro: 'Já existe um talento cadastrado com este e-mail.' });
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

  const validacao = atualizarTalentoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  try {
    const talento = talentoRepository.atualizarTalento(id, validacao.data);
    if (!talento) {
      res.status(404).json({ erro: 'Talento não encontrado.' });
      return;
    }

    res.json(talento);
  } catch (erro: any) {
    if (erro?.message?.includes('UNIQUE constraint failed')) {
      res.status(409).json({ erro: 'Já existe um talento cadastrado com este e-mail.' });
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
    const removido = talentoRepository.removerTalento(id);
    if (!removido) {
      res.status(404).json({ erro: 'Talento não encontrado.' });
      return;
    }

    res.status(204).send();
  } catch (erro) {
    erroInterno(res, erro);
  }
};
