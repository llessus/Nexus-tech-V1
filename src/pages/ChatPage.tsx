import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Search, UserCircle2, ArrowLeft, Loader2, Home } from 'lucide-react';
import Topbar from '../components/Topbar';
import { getUsuarioLogado } from '../api/auth';
import { obterTalentoPorId } from '../api/talentos';
import { 
  enviarMensagem, 
  obterConversa, 
  obterContatos, 
  marcarConversaComoLida, 
  ContatoChat, 
  Mensagem 
} from '../api/mensagens';
import './ChatPage.css';

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const usuarioLogado = getUsuarioLogado();

  const [contatos, setContatos] = useState<ContatoChat[]>([]);
  const [contatoSelecionado, setContatoSelecionado] = useState<ContatoChat | null>(null);
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novoConteudo, setNovoConteudo] = useState('');
  const [filtroBusca, setFiltroBusca] = useState('');
  
  const [loadingContatos, setLoadingContatos] = useState(true);
  const [loadingConversa, setLoadingConversa] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Redireciona se deslogado
  useEffect(() => {
    if (!usuarioLogado) {
      navigate('/login');
    }
  }, [usuarioLogado, navigate]);

  // Carrega lista de contatos ao abrir a página
  const carregarListaContatos = (selectIdAfterLoad?: number) => {
    if (!usuarioLogado) return;
    obterContatos(usuarioLogado.id)
      .then(data => {
        setContatos(data);
        setLoadingContatos(false);
        if (selectIdAfterLoad) {
          const found = data.find(c => c.id === selectIdAfterLoad);
          if (found) {
            setContatoSelecionado(found);
          }
        }
      })
      .catch(err => {
        console.error('Erro ao buscar contatos:', err);
        setLoadingContatos(false);
      });
  };

  useEffect(() => {
    carregarListaContatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Polling para novos contatos e novas mensagens a cada 3 segundos
  useEffect(() => {
    if (!usuarioLogado) return;
    const interval = setInterval(() => {
      // Recarrega contatos em background
      obterContatos(usuarioLogado.id)
        .then(data => {
          setContatos(data);
          // Se tiver uma conversa ativa, atualiza as mensagens e marca como lidas
          if (contatoSelecionado) {
            obterConversa(usuarioLogado.id, contatoSelecionado.id)
              .then(msgs => {
                setMensagens(msgs);
              });
            marcarConversaComoLida(usuarioLogado.id, contatoSelecionado.id).catch(() => {});
          }
        });
    }, 3000);

    return () => clearInterval(interval);
  }, [usuarioLogado, contatoSelecionado]);

  // Lida com query params (?talentoId=... ou ?usuarioId=...)
  useEffect(() => {
    if (!usuarioLogado) return;

    const talentoIdParam = searchParams.get('talentoId');
    const usuarioIdParam = searchParams.get('usuarioId');

    if (talentoIdParam) {
      // Buscar o usuarioId a partir do talento
      obterTalentoPorId(Number(talentoIdParam))
        .then(talento => {
          if (talento && talento.usuarioId) {
            abrirOuCriarContato(talento.usuarioId, talento.nome, talento.email, 'prestador');
          } else {
            console.error('Talento sem usuário correspondente.');
          }
        })
        .catch(err => console.error(err));
      // Remove query param para não re-abrir
      setSearchParams({}, { replace: true });
    } else if (usuarioIdParam) {
      const uId = Number(usuarioIdParam);
      const nomeParam = searchParams.get('nome') || 'Cliente';
      const emailParam = searchParams.get('email') || '';
      const tipoParam = (searchParams.get('tipoConta') as any) || 'cliente';
      abrirOuCriarContato(uId, nomeParam, emailParam, tipoParam);
      setSearchParams({}, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Rola até o fim sempre que as mensagens mudam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const abrirOuCriarContato = (outroId: number, nomeFallback: string, emailFallback: string, tipoFallback: any) => {
    if (!usuarioLogado) return;
    // Se o contato já existe na lista, seleciona ele
    const existente = contatos.find(c => c.id === outroId);
    if (existente) {
      setContatoSelecionado(existente);
      carregarMensagensConversa(existente.id);
    } else {
      // Cria um contato temporário/novo na lista
      const novoContato: ContatoChat = {
        id: outroId,
        nome: nomeFallback,
        email: emailFallback,
        tipoConta: tipoFallback,
        ultimaMensagem: '',
        dataUltimaMensagem: '',
        naoLidas: 0
      };
      setContatos(prev => [novoContato, ...prev]);
      setContatoSelecionado(novoContato);
      carregarMensagensConversa(outroId);
    }
  };

  const carregarMensagensConversa = (outroId: number) => {
    if (!usuarioLogado) return;
    setLoadingConversa(true);
    obterConversa(usuarioLogado.id, outroId)
      .then(msgs => {
        setMensagens(msgs);
        setLoadingConversa(false);
        // Marca como lidas no banco
        marcarConversaComoLida(usuarioLogado.id, outroId).catch(() => {});
      })
      .catch(err => {
        console.error(err);
        setLoadingConversa(false);
      });
  };

  const handleSelecionarContato = (contato: ContatoChat) => {
    setContatoSelecionado(contato);
    carregarMensagensConversa(contato.id);
  };

  const handleEnviar = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!usuarioLogado || !contatoSelecionado || !novoConteudo.trim() || isSending) return;

    setIsSending(true);
    const texto = novoConteudo;
    setNovoConteudo('');

    try {
      const msg = await enviarMensagem(usuarioLogado.id, contatoSelecionado.id, texto);
      setMensagens(prev => [...prev, msg]);
      setIsSending(false);
      // Atualiza a lista de contatos para subir o atual
      carregarListaContatos(contatoSelecionado.id);
    } catch (err) {
      console.error(err);
      alert('Falha ao enviar mensagem');
      setNovoConteudo(texto);
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const contatosFiltrados = contatos.filter(c => 
    c.nome.toLowerCase().includes(filtroBusca.toLowerCase()) ||
    c.email.toLowerCase().includes(filtroBusca.toLowerCase())
  );

  if (!usuarioLogado) return null;

  return (
    <div className="chat-layout-wrapper">
      <Topbar />

      <div className="chat-main-container">
        {/* Painel Esquerdo (Lista de Conversas) */}
        <aside className={`chat-sidebar ${contatoSelecionado ? 'hidden-on-mobile' : ''}`}>
          <div className="chat-sidebar-header">
            <h3>Conversas</h3>
            <button 
              className="chat-back-home-btn"
              onClick={() => {
                if (usuarioLogado.tipoConta === 'admin') navigate('/admin');
                else if (usuarioLogado.tipoConta === 'prestador') navigate('/provider');
                else navigate('/dashboard');
              }}
              title="Voltar ao Painel"
            >
              <Home size={18} />
              <span>Painel</span>
            </button>
          </div>

          <div className="chat-search-bar">
            <Search size={16} className="chat-search-icon" />
            <input 
              type="text" 
              placeholder="Pesquisar contatos..." 
              value={filtroBusca}
              onChange={(e) => setFiltroBusca(e.target.value)}
            />
          </div>

          <div className="chat-contacts-list">
            {loadingContatos ? (
              <div className="chat-loading-spinner">
                <Loader2 className="spinner" size={24} />
                <span>Carregando conversas...</span>
              </div>
            ) : contatosFiltrados.length === 0 ? (
              <div className="chat-empty-sidebar">
                Nenhum contato encontrado.
              </div>
            ) : (
              contatosFiltrados.map(c => {
                const isSelected = contatoSelecionado?.id === c.id;
                const iniciais = c.nome
                  .split(' ')
                  .slice(0, 2)
                  .map(p => p[0])
                  .join('')
                  .toUpperCase();

                return (
                  <div 
                    key={c.id} 
                    className={`chat-contact-item ${isSelected ? 'active' : ''} ${c.naoLidas > 0 ? 'unread' : ''}`}
                    onClick={() => handleSelecionarContato(c)}
                  >
                    <div className="chat-contact-avatar">
                      {iniciais || <UserCircle2 size={36} />}
                      {c.naoLidas > 0 && <span className="chat-unread-badge">{c.naoLidas}</span>}
                    </div>
                    <div className="chat-contact-details">
                      <div className="chat-contact-row">
                        <strong className="chat-contact-name">{c.nome}</strong>
                        <span className="chat-contact-type">
                          {c.tipoConta === 'prestador' ? 'Prestador' : 'Cliente'}
                        </span>
                      </div>
                      <p className="chat-contact-last-msg">
                        {c.ultimaMensagem || <span style={{ fontStyle: 'italic', color: '#52525b' }}>Sem mensagens</span>}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* Painel Direito (Mensagens) */}
        <main className={`chat-conversation-area ${!contatoSelecionado ? 'hidden-on-mobile empty' : ''}`}>
          {contatoSelecionado ? (
            <div className="chat-active-window">
              {/* Header do Chat */}
              <header className="chat-window-header">
                <button 
                  className="chat-back-to-list-btn"
                  onClick={() => setContatoSelecionado(null)}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="chat-header-avatar">
                  {contatoSelecionado.nome
                    .split(' ')
                    .slice(0, 2)
                    .map(p => p[0])
                    .join('')
                    .toUpperCase()
                  }
                </div>
                <div className="chat-header-info">
                  <h4>{contatoSelecionado.nome}</h4>
                  <span className="chat-header-status">Online · {contatoSelecionado.email}</span>
                </div>
              </header>

              {/* Corpo de Mensagens */}
              <div className="chat-messages-scroll">
                {loadingConversa ? (
                  <div className="chat-loading-spinner" style={{ height: '100%' }}>
                    <Loader2 className="spinner" size={32} />
                    <span>Carregando histórico...</span>
                  </div>
                ) : mensagens.length === 0 ? (
                  <div className="chat-conversation-empty">
                    <p>Inicie a conversa com <strong>{contatoSelecionado.nome}</strong>.</p>
                    <span>Diga olá para alinhar os próximos passos do projeto!</span>
                  </div>
                ) : (
                  <div className="chat-conversation-list">
                    {mensagens.map(m => {
                      const isSentByMe = m.remetenteId === usuarioLogado.id;
                      const timeStr = new Date(m.createdAt).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      });

                      return (
                        <div 
                          key={m.id} 
                          className={`chat-message-bubble-wrapper ${isSentByMe ? 'sent' : 'received'}`}
                        >
                          <div className="chat-message-bubble">
                            <p>{m.conteudo}</p>
                            <span className="chat-message-time">{timeStr}</span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Footer de Envio */}
              <footer className="chat-window-footer">
                <form onSubmit={handleEnviar} className="chat-input-form">
                  <textarea 
                    placeholder="Escreva sua mensagem aqui..."
                    value={novoConteudo}
                    onChange={(e) => setNovoConteudo(e.target.value)}
                    onKeyDown={handleKeyPress}
                    rows={1}
                  />
                  <button 
                    type="submit" 
                    disabled={!novoConteudo.trim() || isSending}
                    className="chat-send-btn"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </footer>
            </div>
          ) : (
            <div className="chat-empty-state">
              <div className="chat-empty-icon-wrapper">
                <Send size={40} style={{ transform: 'rotate(-45deg) translate(4px, -4px)' }} />
              </div>
              <h3>Suas Mensagens Diretas</h3>
              <p>Selecione um contato na lista lateral para visualizar as conversas e alinhar propostas.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
