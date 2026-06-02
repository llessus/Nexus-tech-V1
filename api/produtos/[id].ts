import type { VercelRequest, VercelResponse } from '@vercel/node';
import { criarProdutoDto, atualizarProdutoDto } from '../../src/dtos/produto.dto';
import * as produtoRepository from '../../src/repositories/produto.repository';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = Number(req.query.id);

  if (isNaN(id)) {
    return res.status(400).json({ erro: 'O ID deve ser um número válido.' });
  }

  if (req.method === 'GET') {
    try {
      const produto = await produtoRepository.obterProdutoPorId(id);
      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
      return res.json(produto);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  if (req.method === 'PUT') {
    const validacao = criarProdutoDto.safeParse(req.body);
    if (!validacao.success) return res.status(400).json(validacao.error.flatten().fieldErrors);

    try {
      const produto = await produtoRepository.substituirProduto(id, validacao.data);
      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
      return res.json(produto);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  if (req.method === 'PATCH') {
    const validacao = atualizarProdutoDto.safeParse(req.body);
    if (!validacao.success) return res.status(400).json(validacao.error.flatten().fieldErrors);

    try {
      const produto = await produtoRepository.atualizarProduto(id, validacao.data);
      if (!produto) return res.status(404).json({ erro: 'Produto não encontrado.' });
      return res.json(produto);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const removido = await produtoRepository.removerProduto(id);
      if (!removido) return res.status(404).json({ erro: 'Produto não encontrado.' });
      return res.status(204).send(undefined);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido.' });
}
