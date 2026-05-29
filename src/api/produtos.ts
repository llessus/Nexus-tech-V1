import { CriarProdutoDto, AtualizarProdutoDto } from '../dtos/produto.dto';

// Para simplificar, assumimos que a API está rodando localmente na porta 3000
const API_URL = 'http://localhost:3000/produtos';

export interface Produto {
  id: number;
  nome: string;
  preco: number;
  descricao?: string;
  imagemUrl?: string;
}

// GET: Operação de leitura, sem body, idempotente
export const listarProdutos = async (nome?: string): Promise<Produto[]> => {
  const url = nome ? `${API_URL}?nome=${encodeURIComponent(nome)}` : API_URL;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Falha ao buscar produtos');
  }
  
  return response.json();
};

export const obterProdutoPorId = async (id: number): Promise<Produto> => {
  const response = await fetch(`${API_URL}/${id}`);
  
  if (!response.ok) {
    throw new Error('Falha ao buscar produto');
  }
  
  return response.json();
};

// POST: Criar recurso, não-idempotente, deve retornar Status 201
export const criarProduto = async (produto: CriarProdutoDto): Promise<Produto> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produto),
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw { status: response.status, errors: errorData };
  }
  
  return response.json();
};

// PUT: Substituição INTEGRAL do recurso
export const substituirProduto = async (id: number, produto: CriarProdutoDto): Promise<Produto> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produto),
  });
  
  if (!response.ok) {
    throw new Error('Falha ao substituir produto');
  }
  
  return response.json();
};

// PATCH: Atualização PARCIAL do recurso
export const atualizarProduto = async (id: number, produto: AtualizarProdutoDto): Promise<Produto> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(produto),
  });
  
  if (!response.ok) {
    throw new Error('Falha ao atualizar produto');
  }
  
  return response.json();
};

// DELETE: Remoção de recurso
export const removerProduto = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) {
    throw new Error('Falha ao remover produto');
  }
};
