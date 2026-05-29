import { Request, Response } from 'express';
import { criarProdutoDto, atualizarProdutoDto } from '../dtos/produto.dto';
import * as produtoRepository from '../repositories/produto.repository';

const erroInterno = (res: Response, erro: unknown) => {
  console.error(erro);
  res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
};

export const listar = (req: Request, res: Response): void => {
  try {
    const { nome } = req.query;
    const produtos = produtoRepository.listarProdutos(typeof nome === 'string' ? nome : undefined);
    res.json(produtos);
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
    const produto = produtoRepository.obterProdutoPorId(id);
    if (!produto) {
      res.status(404).json({ erro: 'Produto não encontrado.' });
      return;
    }

    res.json(produto);
  } catch (erro) {
    erroInterno(res, erro);
  }
};

export const criar = (req: Request, res: Response): void => {
  const validacao = criarProdutoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  try {
    const novoProduto = produtoRepository.criarProduto(validacao.data);
    res.status(201).json(novoProduto);
  } catch (erro) {
    erroInterno(res, erro);
  }
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

  try {
    const produto = produtoRepository.substituirProduto(id, validacao.data);
    if (!produto) {
      res.status(404).json({ erro: 'Produto não encontrado.' });
      return;
    }

    res.json(produto);
  } catch (erro) {
    erroInterno(res, erro);
  }
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

  try {
    const produto = produtoRepository.atualizarProduto(id, validacao.data);
    if (!produto) {
      res.status(404).json({ erro: 'Produto não encontrado.' });
      return;
    }

    res.json(produto);
  } catch (erro) {
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
    const removido = produtoRepository.removerProduto(id);
    if (!removido) {
      res.status(404).json({ erro: 'Produto não encontrado.' });
      return;
    }

    res.status(204).send();
  } catch (erro) {
    erroInterno(res, erro);
  }
};
