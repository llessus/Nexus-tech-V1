import { Request, Response } from 'express';
import { criarProdutoDto, atualizarProdutoDto } from '../dtos/produto.dto';

// Simulação de banco de dados
let produtos: any[] = [];
let nextId = 1;

export const listar = (req: Request, res: Response) => {
  const { nome } = req.query;
  let resultado = produtos;

  if (nome && typeof nome === 'string') {
    resultado = resultado.filter(p => p.nome.toLowerCase().includes(nome.toLowerCase()));
  }

  res.json(resultado);
};

export const obterPorId = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    return;
  }

  const produto = produtos.find(p => p.id === id);
  if (!produto) {
    res.status(404).json({ erro: 'Produto não encontrado.' });
    return;
  }

  res.json(produto);
};

export const criar = (req: Request, res: Response): void => {
  const validacao = criarProdutoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  const novoProduto = { id: nextId++, ...validacao.data };
  produtos.push(novoProduto);

  res.status(201).json(novoProduto);
};

export const substituir = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    return;
  }

  const validacao = criarProdutoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  const index = produtos.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ erro: 'Produto não encontrado.' });
    return;
  }

  produtos[index] = { id, ...validacao.data };
  res.json(produtos[index]);
};

export const atualizar = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    return;
  }

  const validacao = atualizarProdutoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  const index = produtos.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ erro: 'Produto não encontrado.' });
    return;
  }

  produtos[index] = { ...produtos[index], ...validacao.data };
  res.json(produtos[index]);
};

export const remover = (req: Request, res: Response): void => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    return;
  }

  const index = produtos.findIndex(p => p.id === id);
  if (index === -1) {
    res.status(404).json({ erro: 'Produto não encontrado.' });
    return;
  }

  produtos.splice(index, 1);
  res.status(204).send();
};
