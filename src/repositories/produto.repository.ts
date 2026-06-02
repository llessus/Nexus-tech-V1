import { getSQL } from '../database/client';
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
  preco: Number(row.preco),
  descricao: row.descricao,
  imagemUrl: row.imagem_url,
});

export const listarProdutos = async (nome?: string): Promise<Produto[]> => {
  const sql = getSQL();

  if (nome) {
    const rows = await sql`
      SELECT id, nome, preco, descricao, imagem_url FROM produtos
      WHERE nome ILIKE ${'%' + nome + '%'} ORDER BY id
    `;
    return rows.map(toProduto);
  }

  const rows = await sql`SELECT id, nome, preco, descricao, imagem_url FROM produtos ORDER BY id`;
  return rows.map(toProduto);
};

export const obterProdutoPorId = async (id: number): Promise<Produto | null> => {
  const sql = getSQL();
  const rows = await sql`SELECT id, nome, preco, descricao, imagem_url FROM produtos WHERE id = ${id}`;
  return rows.length > 0 ? toProduto(rows[0]) : null;
};

export const criarProduto = async (produto: CriarProdutoDto): Promise<Produto> => {
  const sql = getSQL();

  const inserted = await sql`
    INSERT INTO produtos (nome, preco, descricao, imagem_url)
    VALUES (${produto.nome}, ${produto.preco}, ${produto.descricao ?? null}, ${produto.imagemUrl ?? null})
    RETURNING id, nome, preco, descricao, imagem_url
  `;

  return toProduto(inserted[0]);
};

export const substituirProduto = async (id: number, produto: CriarProdutoDto): Promise<Produto | null> => {
  const sql = getSQL();

  const updated = await sql`
    UPDATE produtos SET nome = ${produto.nome}, preco = ${produto.preco},
           descricao = ${produto.descricao ?? null}, imagem_url = ${produto.imagemUrl ?? null}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, nome, preco, descricao, imagem_url
  `;

  return updated.length > 0 ? toProduto(updated[0]) : null;
};

export const atualizarProduto = async (id: number, produto: AtualizarProdutoDto): Promise<Produto | null> => {
  const existente = await obterProdutoPorId(id);
  if (!existente) return null;

  const nome = produto.nome ?? existente.nome;
  const preco = produto.preco ?? existente.preco;
  const descricao = produto.descricao ?? existente.descricao;
  const imagemUrl = produto.imagemUrl ?? existente.imagemUrl;

  const sql = getSQL();
  const updated = await sql`
    UPDATE produtos SET nome = ${nome}, preco = ${preco},
           descricao = ${descricao ?? null}, imagem_url = ${imagemUrl ?? null}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING id, nome, preco, descricao, imagem_url
  `;

  return updated.length > 0 ? toProduto(updated[0]) : null;
};

export const removerProduto = async (id: number): Promise<boolean> => {
  const sql = getSQL();
  const result = await sql`DELETE FROM produtos WHERE id = ${id} RETURNING id`;
  return result.length > 0;
};
