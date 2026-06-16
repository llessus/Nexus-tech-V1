import React, { useEffect, useState } from 'react';
import { 
  CheckCircle,
  Clock,
  Star,
  Zap,
  ShieldCheck,
  CreditCard,
  Building,
  Check
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import Topbar from '../components/Topbar';
import { obterTalentoPorId, Talento } from '../api/talentos';
import { getUsuarioLogado } from '../api/auth';

import './HireTalentPage.css';

const HireTalentPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [talent, setTalent] = useState<Talento | null>(null);
  const [loading, setLoading] = useState(true);

  const [hours, setHours] = useState(5);
  const [selectedDate, setSelectedDate] = useState('22');
  const [paymentMethod, setPaymentMethod] = useState<'cartao' | 'pix' | null>(null);
  const [isProcessing] = useState(false);
  const [showConfirmModal] = useState(false);


  const dates = ['20', '21', '22', '23', '24', '25', '26'];

  useEffect(() => {
    if (!id) return;
    obterTalentoPorId(Number(id))
      .then(data => {
        setTalent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar talento:', err);
        setLoading(false);
      });
  }, [id]);

  const handleConfirm = async () => {
    if (!paymentMethod) {
      alert("Por favor, selecione uma forma de pagamento.");
      return;
    }
    
    const usuario = getUsuarioLogado();
    if (!usuario) {
      alert("Você precisa estar logado para contratar.");
      navigate('/login');
      return;
    }

    // Redirecionar para o checkout com os parâmetros
    navigate(`/checkout?talentoId=${talent.id}&hours=${hours}`);
  };

  if (loading) {
    return (
      <div className="hire-container">
        <Topbar />
        <main className="hire-main" style={{ textAlign: 'center', padding: '5rem', color: '#a1a1aa' }}>
          Carregando informações para contratação...
        </main>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="hire-container">
        <Topbar />
        <main className="hire-main" style={{ textAlign: 'center', padding: '5rem', color: '#a1a1aa' }}>
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
  const numReviews = 45 + (talent.id * 13) % 80;
  
  // Dynamic Pricing Calculation
  const hourlyCost = hours * talent.hourlyRate;
  const platformFee = hourlyCost * 0.05;
  const totalCost = hourlyCost + platformFee;

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <div className="hire-container">
      <Topbar />

      <main className="hire-main">
        <div className="hire-breadcrumb">
          MARKETPLACE / {talent.role.toUpperCase()}
        </div>

        <div className="hire-header-row">
          <div>
            <h1 className="hire-title">Contratação de {talent.nome}</h1>
            <div className="hire-badges">
              <div className="hire-badge verified">
                <CheckCircle size={14} />
                TALENTO VERIFICADO
              </div>
              <div className="hire-badge">
                <Clock size={14} />
                Resposta em &lt; 2h
              </div>
            </div>
          </div>
          <div className="hire-price-block">
            <div className="hire-price-label">INVESTIMENTO</div>
            <div className="hire-price-value">R$ {talent.hourlyRate}<span className="hire-price-unit">/hora</span></div>
          </div>
        </div>

        <div className="hire-grid">
          {/* Left Column */}
          <div>
            <div className="hire-card">
              <h2 className="hire-section-title">Avaliações do Talento</h2>
              
              <div className="hire-rating-overview">
                <div className="hire-rating-big">
                  <div className="hire-rating-number">{rating.toFixed(1)}</div>
                  <div className="hire-rating-stars">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star 
                        key={i} 
                        size={16} 
                        fill={i <= Math.round(rating) ? "currentColor" : "none"} 
                        color={i <= Math.round(rating) ? "currentColor" : "#52525b"} 
                      />
                    ))}
                  </div>
                  <div className="hire-rating-count">{numReviews} depoimentos</div>
                </div>

                <div className="hire-rating-bars">
                  <div className="hire-rating-bar-row">
                    <span>5</span>
                    <div className="hire-rating-bar-bg"><div className="hire-rating-bar-fill" style={{width: '92%'}}></div></div>
                    <span>92%</span>
                  </div>
                  <div className="hire-rating-bar-row">
                    <span>4</span>
                    <div className="hire-rating-bar-bg"><div className="hire-rating-bar-fill" style={{width: '6%'}}></div></div>
                    <span>6%</span>
                  </div>
                  <div className="hire-rating-bar-row">
                    <span>3</span>
                    <div className="hire-rating-bar-bg"><div className="hire-rating-bar-fill" style={{width: '2%'}}></div></div>
                    <span>2%</span>
                  </div>
                  <div className="hire-rating-bar-row">
                    <span>2</span>
                    <div className="hire-rating-bar-bg"><div className="hire-rating-bar-fill" style={{width: '0%'}}></div></div>
                    <span>0%</span>
                  </div>
                  <div className="hire-rating-bar-row">
                    <span>1</span>
                    <div className="hire-rating-bar-bg"><div className="hire-rating-bar-fill" style={{width: '0%'}}></div></div>
                    <span>0%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hire-card" style={{padding: '0'}}>
              <div style={{padding: '2rem'}}>
                {/* Review 1 */}
                <div className="hire-review-header">
                  <div className="hire-review-user">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100&auto=format&fit=crop" alt="Ana" className="hire-review-avatar" />
                    <div>
                      <div className="hire-review-name">Ana Paula Silveira</div>
                      <div className="hire-review-role">Product Manager @ FinTech Inc.</div>
                    </div>
                  </div>
                  <div className="hire-review-date">14 de Out, 2023</div>
                </div>
                <div className="hire-review-stars">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                </div>
                <div className="hire-review-text">
                  "Superou todas as expectativas. O profissional não apenas foca na entrega rápida, mas traz insights profundos que mudaram nosso projeto logo na primeira semana de pareamento."
                </div>

                {/* Review 2 */}
                <div className="hire-review-item">
                  <div className="hire-review-header">
                    <div className="hire-review-user">
                      <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" alt="Ricardo" className="hire-review-avatar" />
                      <div>
                        <div className="hire-review-name">Ricardo Mendes</div>
                        <div className="hire-review-role">CTO @ Nexus Systems</div>
                      </div>
                    </div>
                    <div className="hire-review-date">02 de Out, 2023</div>
                  </div>
                  <div className="hire-review-stars">
                    {[1, 2, 3, 4].map(i => <Star key={i} size={12} fill="currentColor" />)}
                    <Star size={12} color="#52525b" />
                  </div>
                  <div className="hire-review-text">
                    "Entrega muito ágil e documentação extremamente técnica e detalhada. Ótima comunicação de ponta a ponta durante o escopo."
                  </div>
                </div>
              </div>
              
              <button className="hire-btn-ghost" style={{borderTop: '1px solid rgba(255, 255, 255, 0.05)'}}>
                VER MAIS COMENTÁRIOS
              </button>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <div className="hire-card">
              <h2 className="hire-checkout-title">
                <Zap size={20} color="#00e5ff" />
                Contratação Imediata
              </h2>

              <label className="hire-label">SELECIONAR DATA</label>
              <div className="hire-dates-scroll">
                {dates.map(date => (
                  <button 
                    key={date}
                    className={`hire-date-btn ${selectedDate === date ? 'active' : ''}`}
                    onClick={() => setSelectedDate(date)}
                  >
                    {date}
                  </button>
                ))}
              </div>

              <label className="hire-label">CARGA HORÁRIA</label>
              <select 
                className="hire-select"
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              >
                <option value={5}>5 horas (Aceleração e Imersão)</option>
                <option value={10}>10 horas (Sprint Técnica)</option>
                <option value={20}>20 horas (Projeto Completo)</option>
              </select>

              {/* Payment Method Section */}
              <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                <label className="hire-label">FORMA DE PAGAMENTO</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button 
                    onClick={() => setPaymentMethod('cartao')}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem',
                      backgroundColor: paymentMethod === 'cartao' ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                      border: `1px solid ${paymentMethod === 'cartao' ? '#00e5ff' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '0.5rem', color: paymentMethod === 'cartao' ? '#00e5ff' : '#a1a1aa', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <CreditCard size={20} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Cartão</span>
                  </button>
                  <button 
                    onClick={() => setPaymentMethod('pix')}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem',
                      backgroundColor: paymentMethod === 'pix' ? 'rgba(0, 229, 255, 0.1)' : 'transparent',
                      border: `1px solid ${paymentMethod === 'pix' ? '#00e5ff' : 'rgba(255, 255, 255, 0.1)'}`,
                      borderRadius: '0.5rem', color: paymentMethod === 'pix' ? '#00e5ff' : '#a1a1aa', cursor: 'pointer', transition: 'all 0.2s'
                    }}
                  >
                    <Building size={20} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Pix</span>
                  </button>
                </div>
              </div>

              <div className="hire-cost-row">
                <span>Taxa Horária ({hours}h)</span>
                <span>{formatCurrency(hourlyCost)}</span>
              </div>
              <div className="hire-cost-row">
                <span>Plataforma Nexus (5%)</span>
                <span>{formatCurrency(platformFee)}</span>
              </div>

              <div className="hire-total-row">
                <span>Total Estimado</span>
                <span className="hire-total-value">{formatCurrency(totalCost)}</span>
              </div>

              <button 
                className="auth-submit-btn" 
                style={{ marginTop: 0, opacity: isProcessing ? 0.7 : 1 }}
                onClick={handleConfirm}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processando...' : 'Confirmar Contratação'}
              </button>
              <div className="hire-secure-text">
                Pagamento processado via NexusEscrow™ para sua segurança.
              </div>
            </div>

            <div className="hire-guarantee-card">
              <ShieldCheck className="hire-guarantee-icon" size={24} />
              <div>
                <div className="hire-guarantee-title">Garantia Nexus</div>
                <div className="hire-guarantee-desc">Seus fundos só são liberados após aprovação da entrega.</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal Overlay */}
      {showConfirmModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: '#121212', border: '1px solid rgba(0, 229, 255, 0.2)',
            borderRadius: '1.5rem', padding: '3rem 2rem', maxWidth: '400px', width: '90%',
            textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.8)'
          }}>
            <div style={{
              width: '64px', height: '64px', backgroundColor: 'rgba(0, 229, 255, 0.1)',
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem', color: '#00e5ff', border: '1px solid rgba(0, 229, 255, 0.3)'
            }}>
              <Check size={32} />
            </div>
            
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>
              Contratação<br/>Confirmada!
            </h2>
            
            <p style={{ color: '#a1a1aa', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '2rem' }}>
              O contrato com o profissional {talent.nome} foi gerado com sucesso. Agora você pode alinhar os próximos passos diretamente na sua caixa de mensagens.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                onClick={() => navigate(`/chat?talentoId=${talent.id}`)}
                style={{
                  backgroundColor: '#00e5ff', color: 'black', border: 'none', borderRadius: '0.5rem',
                  padding: '1rem', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                Ir para Mensagens
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                style={{
                  backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255, 255, 255, 0.2)', 
                  borderRadius: '0.5rem', padding: '1rem', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
                Voltar ao Marketplace
              </button>
            </div>
            
            <div style={{ 
              display: 'flex', justifyContent: 'space-between', marginTop: '2rem', 
              fontSize: '0.7rem', color: '#52525b', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1rem'
            }}>
              <span>ID: #NX-88294-TK</span>
              <span><ShieldCheck size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> CONTRATO PROTEGIDO</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HireTalentPage;
