import React, { useState, useEffect } from 'react';
import { listarProdutos, criarProduto, Produto } from '../api/produtos';
import { CriarProdutoDto } from '../dtos/produto.dto';
import './ProdutosDemo.css';

export const ProdutosDemo: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  // Estados para o formulário (POST)
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [errosValidacao, setErrosValidacao] = useState<Record<string, string[]>>({});

  // 1. Efeito para carregar os produtos quando o componente monta
  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    setLoading(true);
    setErro(null);
    try {
      const dados = await listarProdutos();
      setProdutos(dados);
    } catch (error) {
      console.error('Erro ao listar:', error);
      setErro('Falha ao conectar com a API. Certifique-se de que o servidor (npm run dev:api) está rodando.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Disparar a criação de um novo produto (POST)
  const handleCriarProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrosValidacao({});
    
    try {
      const novoProdutoDto: CriarProdutoDto = {
        nome,
        preco: Number(preco),
        descricao: descricao || undefined,
      };
      
      const criado = await criarProduto(novoProdutoDto);
      
      // Atualizamos a lista em tela com o novo item retornado
      setProdutos((prev) => [...prev, criado]);
      
      // Limpamos o formulário
      setNome('');
      setPreco('');
      setDescricao('');
      
    } catch (error: any) {
      if (error.status === 400 && error.errors) {
        // Exibimos os erros do Zod provindos do backend
        setErrosValidacao(error.errors);
      } else {
        setErro('Erro inesperado ao criar o produto.');
      }
    }
  };

  return (
    <div className="demo-container">
      <h2 className="demo-title">Integração Front-end vs Back-end</h2>
      
      {/* Feedback de Erro Geral */}
      {erro && <div className="demo-error">{erro}</div>}
      
      <div className="demo-layout">
        {/* Formulário de Criação */}
        <div className="demo-form-section">
          <h3>Cadastrar Novo Serviço/Produto</h3>
          <form onSubmit={handleCriarProduto} className="demo-form">
            <div className="form-group">
              <label>Nome do Serviço</label>
              <input 
                value={nome} 
                onChange={e => setNome(e.target.value)}
                placeholder="Ex: Consultoria em React" 
              />
              {errosValidacao.nome && (
                <span className="field-error">{errosValidacao.nome.join(', ')}</span>
              )}
            </div>

            <div className="form-group">
              <label>Preço (R$)</label>
              <input 
                type="number"
                step="0.01"
                value={preco} 
                onChange={e => setPreco(e.target.value)}
                placeholder="Ex: 150.00" 
              />
              {errosValidacao.preco && (
                <span className="field-error">{errosValidacao.preco.join(', ')}</span>
              )}
            </div>

            <div className="form-group">
              <label>Descrição (opcional)</label>
              <textarea 
                value={descricao} 
                onChange={e => setDescricao(e.target.value)}
                placeholder="Detalhes sobre o serviço..."
                rows={3}
              />
              {errosValidacao.descricao && (
                <span className="field-error">{errosValidacao.descricao.join(', ')}</span>
              )}
            </div>

            <button type="submit" className="demo-btn-submit">
              Criar Serviço
            </button>
          </form>
        </div>

        {/* Listagem (GET) */}
        <div className="demo-list-section">
          <h3>Lista de Serviços em Memória</h3>
          
          {loading ? (
            <p>Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p className="demo-empty">Nenhum serviço cadastrado ainda. Crie um ao lado!</p>
          ) : (
            <ul className="demo-list">
              {produtos.map((p) => (
                <li key={p.id} className="demo-list-item">
                  <div className="item-header">
                    <strong>{p.nome}</strong>
                    <span className="item-price">R$ {p.preco.toFixed(2)}</span>
                  </div>
                  {p.descricao && <p className="item-desc">{p.descricao}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
