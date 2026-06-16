import React, { useState, useEffect } from 'react';
import { Camera, LogOut, Save, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { getUsuarioLogado, logout, atualizarPerfil } from '../api/auth.js';
import { obterTalentoPorUsuarioId, atualizarTalento } from '../api/talentos.js';
import { addNotification } from '../utils/notifications';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const usuario = getUsuarioLogado();
  const [activeTab, setActiveTab] = useState('perfil');

  // Basic User states
  const [nome, setNome] = useState(usuario?.nome ?? '');
  const [avatarUrl, setAvatarUrl] = useState(usuario?.avatarUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [salvo, setSalvo] = useState(false);

  // Provider-specific states
  const [talentoId, setTalentoId] = useState<number | null>(null);
  const [ocupacao, setOcupacao] = useState('');
  const [bio, setBio] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number>(100);
  const [skills, setSkills] = useState('');
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [loadingTalento, setLoadingTalento] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  useEffect(() => {
    const carregarTalento = async () => {
      if (usuario && usuario.tipoConta === 'prestador') {
        setLoadingTalento(true);
        try {
          const talento = await obterTalentoPorUsuarioId(usuario.id);
          if (talento) {
            setTalentoId(talento.id);
            setOcupacao(talento.role || '');
            setBio(talento.bio || '');
            setHourlyRate(talento.hourlyRate || 100);
            setSkills(talento.skills ? talento.skills.join(', ') : '');
            setPortfolioImages(talento.portfolioImages || []);
          }
        } catch (err) {
          console.error('Erro ao buscar dados de talento:', err);
        } finally {
          setLoadingTalento(false);
        }
      }
    };
    carregarTalento();
  }, [usuario?.id]);

  if (!usuario) {
    navigate('/login');
    return null;
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da imagem.');
      }

      const data = await response.json();
      setAvatarUrl(data.url);
    } catch (err) {
      console.error('Erro no upload:', err);
      alert('Falha ao carregar a foto de perfil.');
    } finally {
      setUploading(false);
    }
  };

  const handlePortfolioUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        throw new Error('Erro no upload.');
      }

      const data = await response.json();
      const novasFotos = [...portfolioImages];
      novasFotos[index] = data.url;
      setPortfolioImages(novasFotos);
    } catch (err) {
      console.error(err);
      alert('Falha ao carregar imagem do portfólio.');
    } finally {
      setUploadingIndex(null);
    }
  };

  const getPortfolioImage = (index: number): string => {
    return portfolioImages[index] || '';
  };

  const handleSalvar = async () => {
    try {
      // 1. Atualizar perfil de usuário (nome, avatar)
      await atualizarPerfil(usuario.id, nome, avatarUrl);

      // 2. Se for prestador, atualizar perfil de talento (role, bio, valor hora, habilidades, portfólio)
      if (usuario.tipoConta === 'prestador' && talentoId) {
        const skillsArray = skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);

        await atualizarTalento(talentoId, {
          role: ocupacao,
          bio: bio,
          hourlyRate: Number(hourlyRate),
          skills: skillsArray,
          portfolioImages: portfolioImages.filter(Boolean),
        });
      }

      addNotification({
        type: 'system',
        title: 'Perfil Atualizado',
        description: 'Suas informações de perfil foram salvas com sucesso.',
      });
      setSalvo(true);
      setTimeout(() => setSalvo(false), 2000);
    } catch (err) {
      console.error('Erro ao salvar perfil:', err);
      alert('Falha ao salvar as alterações do perfil.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const iniciais = nome
    .split(' ')
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  const tipoLabel =
    usuario.tipoConta === 'prestador'
      ? 'Prestador'
      : usuario.tipoConta === 'admin'
      ? 'Administrador'
      : 'Cliente';

  return (
    <div className="settings-container">
      <Topbar />

      <main className="settings-main">
        <div className="settings-header">
          <h1 className="settings-title">Configurações de Perfil</h1>
          <p className="settings-subtitle">Gerencie suas informações pessoais, notificações e segurança da conta.</p>
        </div>

        <div className="settings-grid">
          <div className="settings-menu">
            <button 
              className={`settings-menu-item ${activeTab === 'perfil' ? 'active' : ''}`}
              onClick={() => setActiveTab('perfil')}
            >
              {usuario.tipoConta === 'prestador' ? 'Perfil do Prestador' : 'Perfil do Cliente'}
            </button>
            <button 
              className={`settings-menu-item ${activeTab === 'conta' ? 'active' : ''}`}
              onClick={() => setActiveTab('conta')}
            >
              Conta & Segurança
            </button>
            <button 
              className={`settings-menu-item ${activeTab === 'notificacoes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notificacoes')}
            >
              Notificações
            </button>
            <button 
              className={`settings-menu-item ${activeTab === 'pagamento' ? 'active' : ''}`}
              onClick={() => setActiveTab('pagamento')}
            >
              Pagamento & Faturamento
            </button>
          </div>

          <div className="settings-content">
            {activeTab === 'perfil' && (
              <div className="settings-card">
                <h2 className="settings-card-title">Informações do Perfil</h2>

                <div className="settings-avatar-section">
                  <div 
                    className="settings-avatar-wrapper"
                    onClick={() => document.getElementById('avatar-upload-input')?.click()}
                    style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
                  >
                    {avatarUrl ? (
                      <img src={avatarUrl} alt={nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div className="settings-avatar-iniciais" style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center' }}>
                        {iniciais || <UserCircle size={40} />}
                      </div>
                    )}
                    <div className="settings-avatar-edit">
                      <Camera size={16} />
                    </div>
                  </div>
                  <input
                    type="file"
                    id="avatar-upload-input"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <div className="settings-avatar-info">
                    <h3>{nome}</h3>
                    <p>{tipoLabel} · {usuario.email}</p>
                    {uploading && <small style={{ color: '#00e5ff' }}>Enviando imagem...</small>}
                    <button 
                      type="button" 
                      onClick={() => navigate('/profile')} 
                      style={{ 
                        background: 'rgba(0, 229, 255, 0.1)', 
                        border: '1px solid rgba(0, 229, 255, 0.3)', 
                        color: '#00e5ff', 
                        padding: '0.3rem 0.75rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '11px', 
                        cursor: 'pointer', 
                        marginTop: '0.5rem',
                        fontWeight: 600
                      }}
                    >
                      Visualizar Perfil
                    </button>
                  </div>
                  <button
                    type="button"
                    className="settings-logout-btn"
                    onClick={handleLogout}
                  >
                    <LogOut size={16} />
                    Sair da conta
                  </button>
                </div>

                <div className="settings-form-grid">
                  <div className="settings-form-group">
                    <label className="settings-label">Nome de Exibição</label>
                    <input
                      type="text"
                      className="settings-input"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                    />
                  </div>

                  {usuario.tipoConta === 'prestador' && (
                    <>
                      {loadingTalento ? (
                        <p style={{ color: '#a1a1aa', fontSize: '13px' }}>Carregando dados de prestador...</p>
                      ) : (
                        <>
                          <div className="settings-form-group">
                            <label className="settings-label">Ocupação Profissional</label>
                            <input
                              type="text"
                              className="settings-input"
                              value={ocupacao}
                              onChange={(e) => setOcupacao(e.target.value)}
                              placeholder="Ex: Full Stack Developer"
                            />
                          </div>

                          <div className="settings-form-group">
                            <label className="settings-label">Valor Hora (R$/h)</label>
                            <input
                              type="number"
                              className="settings-input"
                              value={hourlyRate}
                              onChange={(e) => setHourlyRate(Number(e.target.value))}
                              placeholder="Ex: 150"
                            />
                          </div>

                          <div className="settings-form-group">
                            <label className="settings-label">Habilidades (Separadas por vírgula)</label>
                            <input
                              type="text"
                              className="settings-input"
                              value={skills}
                              onChange={(e) => setSkills(e.target.value)}
                              placeholder="React, Node.js, PostgreSQL"
                            />
                          </div>

                          <div className="settings-form-group full-width">
                            <label className="settings-label">Biografia</label>
                            <textarea
                              className="settings-textarea"
                              value={bio}
                              onChange={(e) => setBio(e.target.value)}
                              placeholder="Conte um pouco sobre você e sua experiência..."
                            ></textarea>
                          </div>

                          <div className="settings-form-group full-width">
                            <label className="settings-label" style={{ marginBottom: '0.2rem' }}>Imagens do Portfólio (Máximo 3)</label>
                            <p style={{ color: '#71717a', fontSize: '12px', margin: '0 0 0.5rem' }}>Carregue fotos de projetos para exibir no seu perfil de prestador.</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
                              {[0, 1, 2].map((idx) => {
                                const img = getPortfolioImage(idx);
                                return (
                                  <div 
                                    key={idx} 
                                    style={{ 
                                      height: '140px', 
                                      border: '1px dashed rgba(255, 255, 255, 0.15)', 
                                      borderRadius: '8px', 
                                      overflow: 'hidden', 
                                      cursor: 'pointer', 
                                      position: 'relative',
                                      background: '#121212',
                                      display: 'grid',
                                      placeItems: 'center'
                                    }}
                                    onClick={() => document.getElementById(`portfolio-upload-${idx}`)?.click()}
                                  >
                                    {img ? (
                                      <img src={img} alt={`Projeto ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                      <div style={{ textAlign: 'center', padding: '1rem', color: '#71717a' }}>
                                        <Camera size={20} style={{ margin: '0 auto 0.5rem' }} />
                                        <span style={{ fontSize: '11px', display: 'block' }}>Projeto {idx + 1}</span>
                                      </div>
                                    )}
                                    {uploadingIndex === idx && (
                                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'grid', placeItems: 'center', color: '#00e5ff', fontSize: '11px' }}>
                                        Enviando...
                                      </div>
                                    )}
                                    <input 
                                      type="file"
                                      id={`portfolio-upload-${idx}`}
                                      accept="image/*"
                                      style={{ display: 'none' }}
                                      onChange={(e) => handlePortfolioUpload(e, idx)}
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                {usuario.tipoConta === 'prestador' && !loadingTalento && (
                  <>
                    <h3 className="settings-section-title" style={{ marginTop: '2.5rem' }}>Links Sociais</h3>
                    <div className="settings-form-grid">
                      <div className="settings-form-group">
                        <label className="settings-label">LinkedIn</label>
                        <input
                          type="text"
                          className="settings-input"
                          value={linkedin}
                          onChange={(e) => setLinkedin(e.target.value)}
                          placeholder="linkedin.com/in/seu-perfil"
                        />
                      </div>
                      <div className="settings-form-group">
                        <label className="settings-label">GitHub</label>
                        <input
                          type="text"
                          className="settings-input"
                          value={github}
                          onChange={(e) => setGithub(e.target.value)}
                          placeholder="github.com/seu-usuario"
                        />
                      </div>
                      <div className="settings-form-group full-width">
                        <label className="settings-label">Portfólio URL</label>
                        <input
                          type="text"
                          className="settings-input"
                          value={portfolio}
                          onChange={(e) => setPortfolio(e.target.value)}
                          placeholder="https://seu-portfolio.com"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
                  {salvo && <span className="settings-saved-msg">✓ Salvo com sucesso!</span>}
                  <button
                    className="auth-submit-btn"
                    style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 0 }}
                    onClick={handleSalvar}
                    disabled={uploading || uploadingIndex !== null}
                  >
                    <Save size={18} />
                    Salvar Alterações
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'conta' && (
              <div className="settings-card">
                <h2 className="settings-card-title">Conta & Segurança</h2>
                <div className="settings-form-grid">
                  <div className="settings-form-group full-width">
                    <label className="settings-label">E-mail</label>
                    <input type="email" className="settings-input" value={usuario.email} disabled />
                  </div>
                  <div className="settings-form-group full-width">
                    <label className="settings-label">Tipo de Conta</label>
                    <input type="text" className="settings-input" value={tipoLabel} disabled />
                  </div>
                </div>
              </div>
            )}

            {(activeTab === 'notificacoes' || activeTab === 'pagamento') && (
              <div className="settings-card">
                <p style={{ color: '#a1a1aa' }}>Esta seção está em desenvolvimento.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
