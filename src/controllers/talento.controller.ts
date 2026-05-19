import { Request, Response } from 'express';
import { criarTalentoDto, atualizarTalentoDto } from '../dtos/talento.dto';

// Simulação de banco de dados
let talentos: any[] = [];
let nextId = 1;

export const listar = (req: Request, res: Response) => {
  const { nome } = req.query;
  let resultado = talentos;

  if (nome && typeof nome === 'string') {
    resultado = resultado.filter(t => t.nome.toLowerCase().includes(nome.toLowerCase()));
  }

  res.json(resultado);
};

export const obterPorId = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    return;
  }

  const talento = talentos.find(t => t.id === id);
  if (!talento) {
    res.status(404).json({ erro: 'Talento não encontrado.' });
    return;
  }

  res.json(talento);
};

export const criar = (req: Request, res: Response): void => {
  const validacao = criarTalentoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  const novoTalento = { id: nextId++, ...validacao.data };
  talentos.push(novoTalento);

  res.status(201).json(novoTalento);
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

  const index = talentos.findIndex(t => t.id === id);
  if (index === -1) {
    res.status(404).json({ erro: 'Talento não encontrado.' });
    return;
  }

  talentos[index] = { id, ...validacao.data };
  res.json(talentos[index]);
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

  const index = talentos.findIndex(t => t.id === id);
  if (index === -1) {
    res.status(404).json({ erro: 'Talento não encontrado.' });
    return;
  }

  talentos[index] = { ...talentos[index], ...validacao.data };
  res.json(talentos[index]);
};

export const remover = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    return;
  }

  const index = talentos.findIndex(t => t.id === id);
  if (index === -1) {
    res.status(404).json({ erro: 'Talento não encontrado.' });
    return;
  }

  talentos.splice(index, 1);
  res.status(204).send();
};
