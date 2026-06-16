import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Send, Search, UserCircle2, ArrowLeft, Loader2, Home, Image as ImageIcon, Mic, Smile, Play, Pause, X } from 'lucide-react';
import Topbar from '../components/Topbar';
import { getUsuarioLogado } from '../api/auth';
import { obterTalentoPorId } from '../api/talentos';
import { 
  enviarMensagem, 
  obterConversa, 
  obterContatos, 
  marcarConversaComoLida, 
  deletarMensagem,
  editarMensagem,
  ContatoChat, 
  Mensagem 
} from '../api/mensagens';

import './ChatPage.css';

// Tech-themed animated GIFs and stickers placeholders
const TECH_GIFS = [
  { name: 'Coding', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHBhM2g5dGpwOWYwd2d1NWF5czNpZG5wZnN2a3I0dzhhZ3hnbjQ0ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3zhxq2ttgN6rEw8Clg/giphy.gif' },
  { name: 'Working Hard', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExM2F3NGM1am02bDVydHR5azVlNG81NXBmdTFmZmtzbnpkZjh1dWR0NyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26tn33aiTi1jkl6H6/giphy.gif' },
  { name: 'Mind Blown', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExczJmN2ZzZjJzY2lxa2FudGNrbDRid2Vrb21tdWZtYzhxN3J0dzU5ayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l3q2XHFQOPshWNckg/giphy.gif' },
  { name: 'Success', url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2JpbmFzcmZ4eTh2dWd6MG52ZW5pM2JocHR3ZnphMDJleWRxY2s0biZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kyLYXonQpkUsMs3LJ5/giphy.gif' }
];

const TECH_STICKERS = [
  { name: 'Rocket', url: 'https://api.placeholder.com/120/120?text=%F0%9F%9A%80' },
  { name: 'Code', url: 'https://api.placeholder.com/120/120?text=%F0%9F%92%BB' },
  { name: 'Sparkles', url: 'https://api.placeholder.com/120/120?text=%E2%9C%A8' },
  { name: 'Nexus', url: 'https://api.placeholder.com/120/120?text=Nexus' }
];

// Sub-component for playing real voice messages
const AudioMessagePlayer: React.FC<{ url: string }> = ({ url }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState('--:--');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(url);
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.floor(audio.duration % 60);
      setDuration(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    if (audio.readyState >= 1) {
      handleLoadedMetadata();
    }

    return () => {
      audio.pause();
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(e => console.error("Error playing audio:", e));
      setIsPlaying(true);
    }
  };

  const handleBarClick = (index: number) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const targetTime = (index / 15) * audioRef.current.duration;
    audioRef.current.currentTime = targetTime;
  };

  return (
    <div className="chat-audio-player-card">
      <button 
        type="button" 
        onClick={togglePlay}
        className="audio-play-btn"
      >
        {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" style={{ marginLeft: '2px' }} />}
      </button>
      <div className="audio-wave-visualizer">
        {[30, 70, 50, 90, 40, 80, 60, 95, 35, 75, 55, 85, 45, 65, 30].map((height, barIdx) => {
          const barProgress = (barIdx / 15) * 100;
          const active = progress > barProgress;
          return (
            <div 
              key={barIdx} 
              className="audio-wave-bar"
              onClick={() => handleBarClick(barIdx)}
              style={{ 
                height: `${height}%`, 
                background: active ? '#00e5ff' : 'rgba(255, 255, 255, 0.2)', 
                cursor: 'pointer'
              }} 
            />
          );
        })}
      </div>
      <span className="audio-duration-txt">{duration}</span>
    </div>
  );
};


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

  // Additional states for media chat
  const [isUploading, setIsUploading] = useState(false);
  const [showGifPanel, setShowGifPanel] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // States and refs for voice recording and context menu
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<any>(null);

  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, messageId: number, conteudo: string } | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const longPressTimeoutRef = useRef<any>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);


  const isImageUrl = (url: string) => {
    const imageRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp|svg)(?:\?.*)?)$/i;
    return imageRegex.test(url) || (url.startsWith('http') && (url.includes('public.blob.vercel-storage.com') || url.includes('/api/placeholder')));
  };

  const renderMessageContent = (content: string) => {
    if (content.startsWith('[AUDIO]:')) {
      const url = content.replace('[AUDIO]:', '');
      return <AudioMessagePlayer url={url} />;
    }
    if (isImageUrl(content)) {
      return (
        <div className="chat-message-image-card">
          <img src={content} alt="Imagem do Chat" />
        </div>
      );
    }
    return <p>{content}</p>;
  };

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !usuarioLogado || !contatoSelecionado) return;

    setIsUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar imagem.');
      }

      const data = await response.json();
      
      const msg = await enviarMensagem(usuarioLogado.id, contatoSelecionado.id, data.url);
      setMensagens(prev => [...prev, msg]);
      carregarListaContatos(contatoSelecionado.id);
    } catch (err) {
      console.error(err);
      alert('Erro ao carregar imagem no chat.');
    } finally {
      setIsUploading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (audioBlob.size === 0) return;

        setIsSending(true);
        try {
          const file = new File([audioBlob], 'voicenote.webm', { type: 'audio/webm' });
          const response = await fetch(`/api/upload?filename=voicenote.webm`, {
            method: 'POST',
            body: file,
          });

          if (!response.ok) {
            throw new Error('Falha no upload do áudio.');
          }

          const data = await response.json();
          const msg = await enviarMensagem(usuarioLogado.id, contatoSelecionado!.id, `[AUDIO]:${data.url}`);
          setMensagens(prev => [...prev, msg]);
          carregarListaContatos(contatoSelecionado!.id);
        } catch (err) {
          console.error(err);
          alert('Erro ao enviar áudio gravado.');
        } finally {
          setIsSending(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } catch (err) {
      console.error('Erro ao acessar microfone:', err);
      alert('Não foi possível acessar seu microfone. Verifique as permissões de gravação de áudio.');
    }
  };

  const stopRecordingAndSend = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.ondataavailable = null;
      mediaRecorderRef.current.onstop = null;
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
  };

  const handleRecordVoiceNote = () => {
    if (isRecording) {
      stopRecordingAndSend();
    } else {
      startRecording();
    }
  };

  // Close context menu handler
  useEffect(() => {
    const closeMenu = () => setContextMenu(null);
    window.addEventListener('click', closeMenu);
    return () => window.removeEventListener('click', closeMenu);
  }, []);

  const handleContextMenu = (e: React.MouseEvent, m: Mensagem) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      messageId: m.id,
      conteudo: m.conteudo
    });
  };

  const handleTouchStart = (e: React.TouchEvent, m: Mensagem) => {
    const touch = e.touches[0];
    const x = touch.clientX;
    const y = touch.clientY;
    
    longPressTimeoutRef.current = setTimeout(() => {
      setContextMenu({
        x,
        y,
        messageId: m.id,
        conteudo: m.conteudo
      });
    }, 600);
  };

  const handleTouchEnd = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
    }
  };

  const handleSaveEdit = async (messageId: number) => {
    if (!editingText.trim()) return;
    try {
      await editarMensagem(messageId, editingText.trim());
      setMensagens(prev => prev.map(msg => msg.id === messageId ? { ...msg, conteudo: editingText.trim() } : msg));
      setEditingMessageId(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao editar mensagem.');
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Deseja realmente apagar esta mensagem para todos?')) return;
    try {
      await deletarMensagem(messageId);
      setMensagens(prev => prev.filter(msg => msg.id !== messageId));
      setContextMenu(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir mensagem.');
    }
  };


  const handleSendMedia = async (url: string) => {
    if (!usuarioLogado || !contatoSelecionado) return;
    setShowGifPanel(false);
    try {
      const msg = await enviarMensagem(usuarioLogado.id, contatoSelecionado.id, url);
      setMensagens(prev => [...prev, msg]);
      carregarListaContatos(contatoSelecionado.id);
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar mídia.');
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
                    <div className="chat-contact-avatar" style={{ overflow: 'hidden' }}>
                      {c.avatarUrl ? (
                        <img src={c.avatarUrl} alt={c.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        iniciais || <UserCircle2 size={36} />
                      )}
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
                <div className="chat-header-avatar" style={{ overflow: 'hidden' }}>
                  {contatoSelecionado.avatarUrl ? (
                    <img src={contatoSelecionado.avatarUrl} alt={contatoSelecionado.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    contatoSelecionado.nome
                      .split(' ')
                      .slice(0, 2)
                      .map(p => p[0])
                      .join('')
                      .toUpperCase()
                  )}
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
                          style={{ display: 'flex', gap: '0.5rem', margin: '0.5rem 0', alignItems: 'flex-end' }}
                        >
                          {/* Recebido: Avatar do outro à esquerda */}
                          {!isSentByMe && (
                            <div className="chat-bubble-avatar-small" style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #0077ff, #00e5ff)', color: 'black', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {contatoSelecionado.avatarUrl ? (
                                <img src={contatoSelecionado.avatarUrl} alt={contatoSelecionado.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                contatoSelecionado.nome
                                  .split(' ')
                                  .slice(0, 2)
                                  .map(p => p[0])
                                  .join('')
                                  .toUpperCase()
                              )}
                            </div>
                          )}

                          {/* Conteúdo da bolha */}
                          <div 
                            className="chat-message-bubble"
                            onContextMenu={isSentByMe ? (e) => handleContextMenu(e, m) : undefined}
                            onTouchStart={isSentByMe ? (e) => handleTouchStart(e, m) : undefined}
                            onTouchEnd={isSentByMe ? handleTouchEnd : undefined}
                          >
                            {editingMessageId === m.id ? (
                              <div className="chat-message-edit-inline" onClick={(e) => e.stopPropagation()}>
                                <textarea
                                  value={editingText}
                                  onChange={(e) => setEditingText(e.target.value)}
                                  className="chat-message-edit-textarea"
                                  rows={2}
                                />
                                <div className="chat-message-edit-actions">
                                  <button type="button" className="btn-cancel" onClick={() => setEditingMessageId(null)}>Cancelar</button>
                                  <button type="button" className="btn-save" onClick={() => handleSaveEdit(m.id)}>Salvar</button>
                                </div>
                              </div>
                            ) : (
                              renderMessageContent(m.conteudo)
                            )}
                            <span className="chat-message-time">{timeStr}</span>
                          </div>


                          {/* Enviado: Meu avatar à direita */}
                          {isSentByMe && (
                            <div className="chat-bubble-avatar-small" style={{ width: '28px', height: '28px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'linear-gradient(135deg, #00e5ff, #0077ff)', color: 'black', fontWeight: 'bold', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {usuarioLogado.avatarUrl ? (
                                <img src={usuarioLogado.avatarUrl} alt={usuarioLogado.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                usuarioLogado.nome
                                  .split(' ')
                                  .slice(0, 2)
                                  .map(p => p[0])
                                  .join('')
                                  .toUpperCase()
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Footer de Envio */}
              <footer className="chat-window-footer" style={{ position: 'relative' }}>
                {/* File Input Oculto para Imagens */}
                <input 
                  type="file" 
                  id="chat-image-file-input" 
                  accept="image/*" 
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />

                {/* Painel de GIFs/Stickers */}
                {showGifPanel && (
                  <div className="chat-gif-sticker-panel">
                    <div className="gif-panel-header">
                      <span>GIFs e Stickers Populares</span>
                      <button type="button" className="btn-close-gif" onClick={() => setShowGifPanel(false)}><X size={14} /></button>
                    </div>
                    <div className="gif-panel-grid-container">
                      <div className="media-section-title">GIFs Animados</div>
                      <div className="gif-grid">
                        {TECH_GIFS.map((gif, gIdx) => (
                          <div key={gIdx} className="gif-item-wrapper" onClick={() => handleSendMedia(gif.url)}>
                            <img src={gif.url} alt={gif.name} />
                          </div>
                        ))}
                      </div>
                      
                      <div className="media-section-title" style={{ marginTop: '1rem' }}>Stickers</div>
                      <div className="sticker-grid">
                        {TECH_STICKERS.map((st, sIdx) => (
                          <div key={sIdx} className="sticker-item-wrapper" onClick={() => handleSendMedia(st.url)}>
                            <img src={st.url} alt={st.name} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleEnviar} className="chat-input-form" style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  {isRecording ? (
                    <div className="recording-status-container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#ef4444', fontSize: '13px', padding: '0.5rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span className="recording-dot" style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }} />
                        <strong>Gravando... ({recordingTime}s)</strong>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: '#a1a1aa' }}>Clique no microfone para enviar</span>
                        <button 
                          type="button" 
                          onClick={cancelRecording}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          title="Cancelar gravação"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ) : (

                    <textarea 
                      placeholder="Escreva sua mensagem aqui..."
                      value={novoConteudo}
                      onChange={(e) => setNovoConteudo(e.target.value)}
                      onKeyDown={handleKeyPress}
                      rows={1}
                      disabled={isUploading}
                    />
                  )}
                  
                  <div className="chat-input-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {!isRecording && (
                      <>
                        {/* Botão Gravar Voz */}
                        <button 
                          type="button" 
                          className="chat-action-btn"
                          onClick={handleRecordVoiceNote}
                          title="Gravar mensagem de voz (2s)"
                          style={{ background: 'none', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Mic size={18} />
                        </button>

                        {/* Botão Upload Imagem */}
                        <button 
                          type="button" 
                          className="chat-action-btn"
                          onClick={() => document.getElementById('chat-image-file-input')?.click()}
                          title="Enviar Imagem"
                          disabled={isUploading}
                          style={{ background: 'none', border: 'none', color: isUploading ? '#00e5ff' : '#a1a1aa', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {isUploading ? <Loader2 size={18} className="spinner" /> : <ImageIcon size={18} />}
                        </button>

                        {/* Botão GIFs/Stickers */}
                        <button 
                          type="button" 
                          className="chat-action-btn"
                          onClick={() => setShowGifPanel(!showGifPanel)}
                          title="Mandar GIF ou Sticker"
                          style={{ background: 'none', border: 'none', color: showGifPanel ? '#00e5ff' : '#a1a1aa', cursor: 'pointer', padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Smile size={18} />
                        </button>
                      </>
                    )}

                    {/* Botão Enviar Mensagem padrão */}
                    {!isRecording && (
                      <button 
                        type="submit" 
                        disabled={!novoConteudo.trim() || isSending}
                        className="chat-send-btn"
                      >
                        <Send size={18} />
                      </button>
                    )}
                  </div>
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
      {contextMenu && (
        <div 
          className="chat-context-menu"
          style={{ 
            position: 'fixed', 
            top: `${contextMenu.y}px`, 
            left: `${contextMenu.x}px`,
            zIndex: 9999,
            background: '#121212',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            padding: '4px'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            className="context-menu-item"
            onClick={() => {
              setEditingMessageId(contextMenu.messageId);
              setEditingText(contextMenu.conteudo);
              setContextMenu(null);
            }}
            style={{ 
              display: 'block', 
              width: '100%', 
              textAlign: 'left', 
              background: 'none', 
              border: 'none', 
              color: 'white', 
              padding: '8px 12px', 
              fontSize: '13px', 
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Editar Mensagem
          </button>
          <button 
            className="context-menu-item delete"
            onClick={() => handleDeleteMessage(contextMenu.messageId)}
            style={{ 
              display: 'block', 
              width: '100%', 
              textAlign: 'left', 
              background: 'none', 
              border: 'none', 
              color: '#ef4444', 
              padding: '8px 12px', 
              fontSize: '13px', 
              cursor: 'pointer',
              borderRadius: '4px'
            }}
          >
            Apagar para Todos
          </button>
        </div>
      )}
    </div>
  );
};


export default ChatPage;
