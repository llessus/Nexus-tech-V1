import type { VercelRequest, VercelResponse } from '@vercel/node';
import { criarProdutoDto } from '../../src/dtos/produto.dto';
import * as produtoRepository from '../../src/repositories/produto.repository';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      const nome = typeof req.query.nome === 'string' ? req.query.nome : undefined;
      const produtos = await produtoRepository.listarProdutos(nome);
      return res.json(produtos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  if (req.method === 'POST') {
    const validacao = criarProdutoDto.safeParse(req.body);
    if (!validacao.success) {
      return res.status(400).json(validacao.error.flatten().fieldErrors);
    }

    try {
      const novoProduto = await produtoRepository.criarProduto(validacao.data);
      return res.status(201).json(novoProduto);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  }

  return res.status(405).json({ erro: 'Método não permitido.' });
}
