import { db } from '../database/client';
import { CriarProdutoDto, AtualizarProdutoDto } from '../dtos/produto.dto';

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao?: string | null;
  imagemUrl?: string | null;
}

const toProduto = (row: any): Produto => ({
  id: row.id,
  nome: row.nome,
  preco: row.preco,
  descricao: row.descricao,
  imagemUrl: row.imagem_url,
});

export const listarProdutos = (nome?: string): Produto[] => {
  if (nome) {
    const rows = db.prepare(
      'SELECT id, nome, preco, descricao, imagem_url FROM produtos WHERE nome LIKE ? ORDER BY id'
    ).all(`%${nome}%`);
    return rows.map(toProduto);
  }

  const rows = db.prepare(
    'SELECT id, nome, preco, descricao, imagem_url FROM produtos ORDER BY id'
  ).all();
  return rows.map(toProduto);
};

export const obterProdutoPorId = (id: number): Produto | null => {
  const row = db.prepare(
    'SELECT id, nome, preco, descricao, imagem_url FROM produtos WHERE id = ?'
  ).get(id) as any;

  return row ? toProduto(row) : null;
};

export const criarProduto = (produto: CriarProdutoDto): Produto => {
  const result = db.prepare(
    'INSERT INTO produtos (nome, preco, descricao, imagem_url) VALUES (?, ?, ?, ?)'
  ).run(produto.nome, produto.preco, produto.descricao ?? null, produto.imagemUrl ?? null);

  return {
    id: Number(result.lastInsertRowid),
    nome: produto.nome,
    preco: produto.preco,
    descricao: produto.descricao ?? null,
    imagemUrl: produto.imagemUrl ?? null,
  };
};

export const substituirProduto = (id: number, produto: CriarProdutoDto): Produto | null => {
  const result = db.prepare(
    'UPDATE produtos SET nome = ?, preco = ?, descricao = ?, imagem_url = ?, updated_at = datetime(\'now\') WHERE id = ?'
  ).run(produto.nome, produto.preco, produto.descricao ?? null, produto.imagemUrl ?? null, id);

  if (result.changes === 0) return null;
  return obterProdutoPorId(id);
};

export const atualizarProduto = (id: number, produto: AtualizarProdutoDto): Produto | null => {
  const existente = obterProdutoPorId(id);
  if (!existente) return null;

  const nome = produto.nome ?? existente.nome;
  const preco = produto.preco ?? existente.preco;
  const descricao = produto.descricao ?? existente.descricao;
  const imagemUrl = produto.imagemUrl ?? existente.imagemUrl;

  db.prepare(
    'UPDATE produtos SET nome = ?, preco = ?, descricao = ?, imagem_url = ?, updated_at = datetime(\'now\') WHERE id = ?'
  ).run(nome, preco, descricao ?? null, imagemUrl ?? null, id);

  return obterProdutoPorId(id);
};

export const removerProduto = (id: number): boolean => {
  const result = db.prepare('DELETE FROM produtos WHERE id = ?').run(id);
  return result.changes > 0;
};
