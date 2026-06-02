import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, Save, X, CheckCircle2, ShoppingBag } from 'lucide-react';
import Topbar from '../components/Topbar';
import { getUsuarioLogado, obterUsuarioPorId, atualizarPerfil, UsuarioLogado } from '../api/auth';
import { listarContratacoesPorCliente, ContratacaoComTalento } from '../api/contratacoes';
import './ClientProfilePage.css';

const ClientProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const usuarioLogado = getUsuarioLogado();

  const [usuario, setUsuario] = useState<UsuarioLogado | null>(null);
  const [contratacoes, setContratacoes] = useState<ContratacaoComTalento[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editNome, setEditNome] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const isOwner = usuarioLogado?.id === Number(id);

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const loadData = async () => {
      try {
        const userData = await obterUsuarioPorId(Number(id));
        setUsuario(userData);
        setEditNome(userData.nome);
        setEditAvatarUrl(userData.avatarUrl || null);

        // Fetch hired services history
        const servicesData = await listarContratacoesPorCliente(Number(id));
        setContratacoes(servicesData);
      } catch (err) {
        console.error('Erro ao carregar dados do cliente:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        throw new Error('Falha no upload da imagem.');
      }

      const data = await response.json();
      setEditAvatarUrl(data.url);
    } catch (err) {
      console.error(err);
      alert('Falha ao fazer upload da imagem.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!usuario) return;
    if (!editNome.trim()) {
      alert('O nome não pode estar em branco.');
      return;
    }

    setSaving(true);
    try {
      const updatedUser = await atualizarPerfil(usuario.id, editNome, editAvatarUrl);
      setUsuario(updatedUser);
      setIsEditing(false);
      // Forçar atualização do Topbar ao re-renderizar
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Erro ao salvar perfil do cliente:', err);
      alert('Falha ao atualizar perfil do cliente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="client-profile-container">
        <Topbar />
        <main className="client-profile-main" style={{ textAlign: 'center', padding: '5rem', color: '#a1a1aa' }}>
          Carregando informações do perfil do cliente...
        </main>
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="client-profile-container">
        <Topbar />
        <main className="client-profile-main" style={{ textAlign: 'center', padding: '5rem', color: '#a1a1aa' }}>
          <h2>Cliente não encontrado</h2>
          <button className="btn-cyan" onClick={() => navigate('/dashboard')} style={{ marginTop: '1.5rem', width: 'auto', display: 'inline-flex' }}>
            Voltar ao Marketplace
          </button>
        </main>
      </div>
    );
  }

  const initials = usuario.nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="client-profile-container">
      <Topbar />

      <main className="client-profile-main">
        {/* Profile Card Header */}
        <div className="client-profile-card">
          <div className="client-profile-header-left">
            <div className="client-avatar-wrapper">
              {isEditing ? (
                <div 
                  className="client-avatar-edit-box" 
                  onClick={() => document.getElementById('client-avatar-upload')?.click()}
                  style={{ cursor: 'pointer' }}
                >
                  {editAvatarUrl ? (
                    <img src={editAvatarUrl} alt={editNome} className="client-avatar" />
                  ) : (
                    <div className="client-avatar-initials">{initials}</div>
                  )}
                  <div className="client-avatar-upload-overlay">
                    <Camera size={20} />
                  </div>
                </div>
              ) : (
                usuario.avatarUrl ? (
                  <img src={usuario.avatarUrl} alt={usuario.nome} className="client-avatar" />
                ) : (
                  <div className="client-avatar-initials">{initials}</div>
                )
              )}
              <input 
                type="file" 
                id="client-avatar-upload" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleAvatarChange} 
                disabled={uploading} 
              />
            </div>

            <div className="client-info">
              {isEditing ? (
                <div className="client-edit-form">
                  <input
                    type="text"
                    value={editNome}
                    onChange={(e) => setEditNome(e.target.value)}
                    className="client-edit-input"
                    placeholder="Nome do Cliente"
                  />
                  {uploading && <span className="client-uploading-text">Enviando foto...</span>}
                </div>
              ) : (
                <h1>{usuario.nome}</h1>
              )}
              <div className="client-level-tag">CLIENTE CONTRATANTE</div>
              <p className="client-email">{usuario.email}</p>
            </div>
          </div>

          {isOwner && (
            <div className="client-profile-actions">
              {isEditing ? (
                <>
                  <button className="btn-outline" onClick={() => { setIsEditing(false); setEditNome(usuario.nome); setEditAvatarUrl(usuario.avatarUrl || null); }} disabled={saving}>
                    <X size={16} /> Cancelar
                  </button>
                  <button className="btn-cyan" onClick={handleSave} disabled={saving || uploading}>
                    <Save size={16} /> {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </>
              ) : (
                <button className="btn-outline" onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </button>
              )}
            </div>
          )}
        </div>

        {/* Hired Services Section */}
        <section className="client-services-section">
          <div className="client-services-title">
            <ShoppingBag size={22} className="title-icon" />
            <h2>Serviços Contratados ({contratacoes.length})</h2>
          </div>

          {contratacoes.length === 0 ? (
            <div className="client-empty-services">
              <p>Você não contratou nenhum serviço até o momento.</p>
              {isOwner && (
                <button className="btn-cyan" onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem', width: 'auto' }}>
                  Explorar Talentos no Marketplace
                </button>
              )}
            </div>
          ) : (
            <div className="client-services-grid">
              {contratacoes.map((c) => (
                <div key={c.id} className="client-service-card">
                  <div className="card-top">
                    <div className="talent-info">
                      <img 
                        src={c.talentoAvatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} 
                        alt={c.talentoNome} 
                        className="talent-avatar-sm"
                      />
                      <div>
                        <h3>{c.talentoNome}</h3>
                        <p>{c.talentoRole}</p>
                      </div>
                    </div>
                    <div className="status-badge">
                      <CheckCircle2 size={14} />
                      <span>{c.status}</span>
                    </div>
                  </div>

                  <div className="card-divider" />

                  <div className="card-details">
                    <div className="detail-item">
                      <span>Carga Horária</span>
                      <strong>{c.horas} horas</strong>
                    </div>
                    <div className="detail-item">
                      <span>Investimento Total</span>
                      <strong className="cyan-text">{formatCurrency(c.valorTotal)}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Contratado em</span>
                      <span>{new Date(c.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>

                  <div className="card-footer">
                    <button className="btn-outline btn-full" onClick={() => navigate(`/chat?talentoId=${c.talentoId}`)}>
                      Entrar em contato
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ClientProfilePage;
