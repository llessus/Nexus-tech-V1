import { Request, Response } from 'express';
import { criarServicoDto, atualizarServicoDto } from '../dtos/servico.dto';

// Simulação de banco de dados
let servicos: any[] = [];
let nextId = 1;

export const listar = (req: Request, res: Response) => {
  const { titulo } = req.query;
  let resultado = servicos;

  if (titulo && typeof titulo === 'string') {
    resultado = resultado.filter(s => s.titulo.toLowerCase().includes(titulo.toLowerCase()));
  }

  res.json(resultado);
};

export const obterPorId = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    return;
  }

  const servico = servicos.find(s => s.id === id);
  if (!servico) {
    res.status(404).json({ erro: 'Serviço não encontrado.' });
    return;
  }

  res.json(servico);
};

export const criar = (req: Request, res: Response): void => {
  const validacao = criarServicoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  const novoServico = { id: nextId++, ...validacao.data };
  servicos.push(novoServico);

  res.status(201).json(novoServico);
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

  const index = servicos.findIndex(s => s.id === id);
  if (index === -1) {
    res.status(404).json({ erro: 'Serviço não encontrado.' });
    return;
  }

  servicos[index] = { id, ...validacao.data };
  res.json(servicos[index]);
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

  const index = servicos.findIndex(s => s.id === id);
  if (index === -1) {
    res.status(404).json({ erro: 'Serviço não encontrado.' });
    return;
  }

  servicos[index] = { ...servicos[index], ...validacao.data };
  res.json(servicos[index]);
};

export const remover = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    return;
  }

  const index = servicos.findIndex(s => s.id === id);
  if (index === -1) {
    res.status(404).json({ erro: 'Serviço não encontrado.' });
    return;
  }

  servicos.splice(index, 1);
  res.status(204).send();
};
