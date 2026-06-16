import React, { useEffect, useState } from 'react';
import { 
  MapPin, 
  Globe, 
  CheckCircle,
  Star,
  Camera,
  Save,
  X,
  Sparkles,
  BookOpen,
  Linkedin,
  Github,
  Instagram
} from 'lucide-react';

import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { obterTalentoPorId, atualizarTalento, Talento } from '../api/talentos';
import { getUsuarioLogado, atualizarPerfil } from '../api/auth';
import './TalentProfilePage.css';
import './DashboardPage.css'; // Reusing topbar styles

const TalentProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [talent, setTalent] = useState<Talento | null>(null);
  const [loading, setLoading] = useState(true);

  // Logged-in user checks
  const usuarioLogado = getUsuarioLogado();
  const isOwner = usuarioLogado && talent && (usuarioLogado.id === talent.usuarioId || usuarioLogado.email === talent.email);

  // Inline edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editNome, setEditNome] = useState('');
  const [editRole, setEditRole] = useState('');
  const [editHourlyRate, setEditHourlyRate] = useState<number>(100);
  const [editSkills, setEditSkills] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  const [editPortfolioImages, setEditPortfolioImages] = useState<string[]>([]);
  const [editLocation, setEditLocation] = useState('');
  const [editLanguages, setEditLanguages] = useState('');
  const [editLinkedin, setEditLinkedin] = useState('');
  const [editGithub, setEditGithub] = useState('');
  const [editPortfolio, setEditPortfolio] = useState('');
  const [editInstagram, setEditInstagram] = useState('');

  
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingPortfolioIdx, setUploadingPortfolioIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    obterTalentoPorId(Number(id))
      .then(data => {
        setTalent(data);
        setEditNome(data.nome);
        setEditRole(data.role);
        setEditHourlyRate(data.hourlyRate);
        setEditSkills(data.skills ? data.skills.join(', ') : '');
        setEditBio(data.bio || '');
        setEditAvatarUrl(data.avatarUrl || null);
        setEditPortfolioImages(data.portfolioImages || []);
        
        // Load Location and Languages from localStorage or default
        const metaRaw = localStorage.getItem(`nexus:talent_meta_${data.id}`);
        if (metaRaw) {
          const meta = JSON.parse(metaRaw);
          setEditLocation(meta.location || '');
          setEditLanguages(meta.languages || '');
          setEditLinkedin(meta.linkedin || '');
          setEditGithub(meta.github || '');
          setEditPortfolio(meta.portfolio || '');
          setEditInstagram(meta.instagram || '');
        } else {
          setEditLocation(data.id % 2 === 0 ? "Remoto" : "São Paulo");
          setEditLanguages("Português, Inglês");
          setEditLinkedin('');
          setEditGithub('');
          setEditPortfolio('');
          setEditInstagram('');
        }

        
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar talento:', err);
        setLoading(false);
      });
  }, [id]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        throw new Error('Falha no upload do avatar');
      }

      const data = await response.json();
      setEditAvatarUrl(data.url);
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handlePortfolioChange = async (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPortfolioIdx(idx);
    try {
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST',
        body: file,
      });

      if (!response.ok) {
        throw new Error('Falha no upload do portfólio');
      }

      const data = await response.json();
      const newImages = [...editPortfolioImages];
      newImages[idx] = data.url;
      setEditPortfolioImages(newImages);
    } catch (err) {
      console.error(err);
      alert('Erro ao fazer upload da imagem.');
    } finally {
      setUploadingPortfolioIdx(null);
    }
  };

  const handleSave = async () => {
    if (!talent) return;
    if (!editNome.trim()) {
      alert('O nome não pode estar vazio.');
      return;
    }
    if (!editRole.trim()) {
      alert('A ocupação não pode estar vazia.');
      return;
    }

    setSaving(true);
    try {
      // 1. Atualizar perfil básico (usuário)
      if (talent.usuarioId) {
        await atualizarPerfil(talent.usuarioId, editNome, editAvatarUrl);
      }

      // 2. Atualizar detalhes do talento
      const skillsArray = editSkills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const updated = await atualizarTalento(talent.id, {
        nome: editNome,
        role: editRole,
        hourlyRate: Number(editHourlyRate),
        skills: skillsArray,
        bio: editBio,
        avatarUrl: editAvatarUrl,
        portfolioImages: editPortfolioImages.filter(Boolean)
      });

      // Save location, languages and social links to localStorage
      localStorage.setItem(`nexus:talent_meta_${talent.id}`, JSON.stringify({
        location: editLocation,
        languages: editLanguages,
        linkedin: editLinkedin,
        github: editGithub,
        portfolio: editPortfolio,
        instagram: editInstagram
      }));


      if (updated) {
        setTalent(updated);
        setEditNome(updated.nome);
        setEditRole(updated.role);
        setEditHourlyRate(updated.hourlyRate);
        setEditSkills(updated.skills ? updated.skills.join(', ') : '');
        setEditBio(updated.bio || '');
        setEditAvatarUrl(updated.avatarUrl || null);
        setEditPortfolioImages(updated.portfolioImages || []);
      }

      setIsEditing(false);
      // Notificar outros componentes (Topbar)
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error(err);
      alert('Falha ao salvar as alterações do perfil.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (!talent) return;
    setEditNome(talent.nome);
    setEditRole(talent.role);
    setEditHourlyRate(talent.hourlyRate);
    setEditSkills(talent.skills ? talent.skills.join(', ') : '');
    setEditBio(talent.bio || '');
    setEditAvatarUrl(talent.avatarUrl || null);
    setEditPortfolioImages(talent.portfolioImages || []);

    const metaRaw = localStorage.getItem(`nexus:talent_meta_${talent.id}`);
    if (metaRaw) {
      const meta = JSON.parse(metaRaw);
      setEditLocation(meta.location || '');
      setEditLanguages(meta.languages || '');
      setEditLinkedin(meta.linkedin || '');
      setEditGithub(meta.github || '');
      setEditPortfolio(meta.portfolio || '');
      setEditInstagram(meta.instagram || '');
    } else {
      setEditLocation(talent.id % 2 === 0 ? "Remoto" : "São Paulo");
      setEditLanguages("Português, Inglês");
      setEditLinkedin('');
      setEditGithub('');
      setEditPortfolio('');
      setEditInstagram('');
    }


    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Topbar />
        <main className="profile-main" style={{ textAlign: 'center', padding: '5rem', color: '#a1a1aa' }}>
          Carregando informações do talento...
        </main>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="profile-container">
        <Topbar />
        <main className="profile-main" style={{ textAlign: 'center', padding: '5rem', color: '#a1a1aa' }}>
          <h2>Talento não encontrado</h2>
          <button className="btn-cyan" onClick={() => navigate('/dashboard')} style={{ marginTop: '1.5rem', width: 'auto', display: 'inline-flex' }}>
            Voltar ao Marketplace
          </button>
        </main>
      </div>
    );
  }

  // Simular notas consistentes por ID
  const rating = 4.8 + (talent.id % 3) * 0.1;
  const location = talent.id % 2 === 0 ? "Remoto" : "São Paulo";
  const numReviews = 45 + (talent.id * 13) % 80;
  const numCompletedProjects = 15 + (talent.id * 17) % 50;

  return (
    <div className="profile-container">
      <Topbar />

      <main className="profile-main">
        {/* Header Block */}
        <div className="profile-header-card">
          <div className="profile-header-left">
            <div className="profile-avatar-wrapper">
              {isEditing ? (
                <div 
                  className="profile-avatar-edit-trigger"
                  onClick={() => document.getElementById('avatar-file-input')?.click()}
                  style={{ cursor: 'pointer', width: '100%', height: '100%' }}
                >
                  <img 
                    src={editAvatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop"} 
                    alt={editNome} 
                    className="profile-avatar"
                  />
                  <div className="profile-avatar-overlay">
                    <Camera size={20} />
                  </div>
                </div>
              ) : (
                <img 
                  src={talent.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop"} 
                  alt={talent.nome} 
                  className="profile-avatar"
                />
              )}
              <input 
                type="file" 
                id="avatar-file-input" 
                accept="image/*" 
                style={{ display: 'none' }} 
                onChange={handleAvatarChange} 
                disabled={uploadingAvatar} 
              />
              <div className="profile-verified-badge">
                <CheckCircle size={16} />
              </div>
            </div>
            
            <div className="profile-info">
              {isEditing ? (
                <div className="profile-edit-header-inputs">
                  <input 
                    type="text" 
                    value={editNome} 
                    onChange={e => setEditNome(e.target.value)} 
                    className="profile-inline-input name-input"
                    placeholder="Nome"
                  />
                  <input 
                    type="text" 
                    value={editRole} 
                    onChange={e => setEditRole(e.target.value)} 
                    className="profile-inline-input role-input"
                    placeholder="Ocupação"
                  />
                  {uploadingAvatar && <small style={{ color: '#00e5ff', display: 'block', marginTop: '0.25rem' }}>Carregando avatar...</small>}
                </div>
              ) : (
                <>
                  <h1>{talent.nome}</h1>
                  <div className="profile-level-tag">NÍVEL ESPECIALISTA</div>
                  <div className="profile-role">{talent.role}</div>
                </>
              )}
              
              <div className="profile-meta">
                <div className="profile-meta-item">
                  <MapPin size={16} />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editLocation} 
                      onChange={e => setEditLocation(e.target.value)} 
                      className="profile-inline-input"
                      style={{ fontSize: '0.85rem', width: '120px', padding: '0.2rem 0.5rem', background: 'rgba(31, 41, 55, 0.5)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', borderRadius: '0.25rem', outline: 'none' }}
                      placeholder="Cidade"
                    />
                  ) : (
                    editLocation
                  )}
                </div>
                <div className="profile-meta-item">
                  <Globe size={16} />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editLanguages} 
                      onChange={e => setEditLanguages(e.target.value)} 
                      className="profile-inline-input"
                      style={{ fontSize: '0.85rem', width: '180px', padding: '0.2rem 0.5rem', background: 'rgba(31, 41, 55, 0.5)', border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff', borderRadius: '0.25rem', outline: 'none' }}
                      placeholder="Idiomas"
                    />
                  ) : (
                    editLanguages
                  )}
                </div>
              </div>

              {/* Modo de Visualização dos Links Sociais */}
              {!isEditing && (editLinkedin || editGithub || editPortfolio || editInstagram) && (
                <div className="profile-social-links">
                  {editLinkedin && (
                    <a href={editLinkedin.startsWith('http') ? editLinkedin : `https://${editLinkedin}`} target="_blank" rel="noopener noreferrer" className="profile-social-link">
                      <Linkedin size={16} />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {editGithub && (
                    <a href={editGithub.startsWith('http') ? editGithub : `https://${editGithub}`} target="_blank" rel="noopener noreferrer" className="profile-social-link">
                      <Github size={16} />
                      <span>GitHub</span>
                    </a>
                  )}
                  {editPortfolio && (
                    <a href={editPortfolio.startsWith('http') ? editPortfolio : `https://${editPortfolio}`} target="_blank" rel="noopener noreferrer" className="profile-social-link">
                      <Globe size={16} />
                      <span>Portfólio</span>
                    </a>
                  )}
                  {editInstagram && (
                    <a href={editInstagram.startsWith('http') ? editInstagram : `https://${editInstagram}`} target="_blank" rel="noopener noreferrer" className="profile-social-link">
                      <Instagram size={16} />
                      <span>Instagram</span>
                    </a>
                  )}
                </div>
              )}


              {/* Modo de Edição dos Links Sociais */}
              {isEditing && (
                <div className="profile-edit-social-inputs" style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                  <input 
                    type="text" 
                    value={editLinkedin} 
                    onChange={e => setEditLinkedin(e.target.value)} 
                    className="profile-inline-input" 
                    style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', width: '150px' }}
                    placeholder="LinkedIn (URL ou usuário)"
                  />
                  <input 
                    type="text" 
                    value={editGithub} 
                    onChange={e => setEditGithub(e.target.value)} 
                    className="profile-inline-input" 
                    style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', width: '150px' }}
                    placeholder="GitHub (URL ou usuário)"
                  />
                  <input 
                    type="text" 
                    value={editPortfolio} 
                    onChange={e => setEditPortfolio(e.target.value)} 
                    className="profile-inline-input" 
                    style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', width: '150px' }}
                    placeholder="Portfólio URL"
                  />
                  <input 
                    type="text" 
                    value={editInstagram} 
                    onChange={e => setEditInstagram(e.target.value)} 
                    className="profile-inline-input" 
                    style={{ fontSize: '0.8rem', padding: '0.2rem 0.5rem', width: '150px' }}
                    placeholder="Instagram (URL ou usuário)"
                  />
                </div>
              )}

            </div>
          </div>

          <div className="profile-actions">
            {isOwner ? (
              isEditing ? (
                <>
                  <button className="btn-outline" onClick={handleCancel} disabled={saving}>
                    <X size={16} /> Cancelar
                  </button>
                  <button className="btn-cyan" onClick={handleSave} disabled={saving || uploadingAvatar || uploadingPortfolioIdx !== null}>
                    <Save size={16} /> {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </>
              ) : (
                <button className="btn-cyan" onClick={() => setIsEditing(true)}>
                  Editar Perfil
                </button>
              )
            ) : (
              <>
                <button 
                  className="btn-outline"
                  onClick={() => navigate(`/chat?talentoId=${talent.id}`)}
                >
                  Enviar Mensagem
                </button>
                <button className="btn-cyan" onClick={() => navigate(`/hire/${talent.id}`)}>Contratar Talento</button>
              </>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="profile-stat-label">AVALIAÇÃO DOS CLIENTES</div>
            <div className="profile-stat-value">
              {rating.toFixed(1)}
              <div className="profile-stars">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star 
                    key={i} 
                    size={20} 
                    fill={i <= Math.round(rating) ? "currentColor" : "none"} 
                    color={i <= Math.round(rating) ? "currentColor" : "#52525b"} 
                  />
                ))}
              </div>
            </div>
            <div className="profile-stat-sub">({numReviews} avaliações)</div>
          </div>
          
          <div className="profile-stat-card">
            <div className="profile-stat-label">PROJETOS CONCLUÍDOS</div>
            <div className="profile-stat-value">{numCompletedProjects}</div>
            <div className="profile-stat-sub highlight">+3 este mês</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-label">TEMPO DE RESPOSTA</div>
            <div className="profile-stat-value">&lt; 2h</div>
            <div className="profile-stat-sub">Top 5% no Nexus-Tech</div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-label">TAXA DE RETENÇÃO</div>
            <div className="profile-stat-value">96%</div>
            <div className="profile-stat-sub">Parcerias de longo prazo</div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="profile-content-grid">
          {/* Left Column */}
          <div>
            <div className="profile-portfolio-header">

              <div className="profile-section-title" style={{margin: 0, border: 'none'}}>Portfólio</div>
              {!isEditing && talent.portfolioImages && talent.portfolioImages.length > 0 && (
                <span className="profile-portfolio-subtitle">Projetos Principais</span>
              )}
            </div>

            {isEditing ? (
              <div className="profile-portfolio-edit-grid">
                {[0, 1, 2].map((idx) => {
                  const img = editPortfolioImages[idx];
                  return (
                    <div 
                      key={idx} 
                      className={`profile-portfolio-upload-box ${idx === 2 ? 'large' : ''}`}
                      onClick={() => document.getElementById(`portfolio-file-${idx}`)?.click()}
                    >
                      {img ? (
                        <img src={img} alt={`Projeto ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div className="upload-box-placeholder">
                          <Camera size={24} />
                          <span>Projeto {idx + 1}</span>
                        </div>
                      )}
                      {uploadingPortfolioIdx === idx && (
                        <div className="upload-box-loading">
                          Carregando...
                        </div>
                      )}
                      <input 
                        type="file" 
                        id={`portfolio-file-${idx}`} 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={e => handlePortfolioChange(e, idx)} 
                      />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="profile-portfolio-grid">
                {talent.portfolioImages && talent.portfolioImages.length > 0 ? (
                  talent.portfolioImages.map((imgUrl, idx) => (
                    <div key={idx} className={`profile-portfolio-item ${idx === 2 ? 'large' : ''}`}>
                      <img src={imgUrl} alt={`Projeto ${idx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))
                ) : (
                  <div className="profile-portfolio-empty">
                    Nenhum projeto cadastrado no portfólio.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            <div className="profile-sidebar-card">
              <div className="profile-sidebar-title">Habilidades</div>
              
              {isEditing ? (
                <div style={{ marginBottom: '1.5rem' }}>
                  <input 
                    type="text" 
                    value={editSkills} 
                    onChange={e => setEditSkills(e.target.value)} 
                    className="profile-inline-input"
                    placeholder="React, Node.js, TypeScript"
                    style={{ width: '100%' }}
                  />
                  <small style={{ color: '#71717a', fontSize: '11px', marginTop: '0.25rem', display: 'block' }}>
                    Separe as habilidades por vírgula.
                  </small>
                </div>
              ) : (
                <div className="profile-skills-tags">
                  {talent.skills && talent.skills.length > 0 ? (
                    talent.skills.map(skill => (
                      <span key={skill} className="profile-skill-tag">{skill}</span>
                    ))
                  ) : (
                    <span style={{ color: '#71717a', fontSize: '13px' }}>Nenhuma habilidade listada.</span>
                  )}
                </div>
              )}

              <div className="profile-info-row" style={{ marginTop: '1.5rem' }}>
                <span className="profile-info-label">Valor Hora</span>
                {isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ color: '#a1a1aa', fontSize: '14px' }}>R$</span>
                    <input 
                      type="number" 
                      value={editHourlyRate} 
                      onChange={e => setEditHourlyRate(Number(e.target.value))} 
                      className="profile-inline-input"
                      style={{ width: '80px', textAlign: 'right' }}
                    />
                    <span style={{ color: '#a1a1aa', fontSize: '14px' }}>/h</span>
                  </div>
                ) : (
                  <span className="profile-info-value">R$ {talent.hourlyRate}/h</span>
                )}
              </div>
              <div className="profile-info-row">
                <span className="profile-info-label">Disponibilidade</span>
                <span className="profile-info-value">30h / semana</span>
              </div>
              <div className="profile-info-row" style={{marginBottom: 0}}>
                <span className="profile-info-label">Último Login</span>
                <span className="profile-info-value">Ativo agora</span>
              </div>
            </div>

            {/* Testimonials and education were mocked, removed as requested */}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TalentProfilePage;
