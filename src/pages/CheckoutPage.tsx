import React, { useEffect, useState } from 'react';
import { 
  CreditCard, Lock, ShieldCheck, Check, ArrowLeft, 
  Building, Smartphone
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { obterTalentoPorId, Talento } from '../api/talentos';
import { getUsuarioLogado } from '../api/auth';
import { criarContratacao } from '../api/contratacoes';
import { addNotification } from '../utils/notifications';
import './CheckoutPage.css';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const talentoId = Number(params.get('talentoId'));
  const hours = Number(params.get('hours') || 5);

  const [talent, setTalent] = useState<Talento | null>(null);
  const [loading, setLoading] = useState(true);
  const [payMethod, setPayMethod] = useState<'card' | 'pix'>('card');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');

  // Card form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  useEffect(() => {
    if (!talentoId) return;
    obterTalentoPorId(talentoId)
      .then(data => { setTalent(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [talentoId]);

  if (loading) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">Carregando dados de pagamento...</div>
      </div>
    );
  }

  if (!talent) {
    return (
      <div className="checkout-container">
        <div className="checkout-loading">
          <h2>Talento não encontrado</h2>
          <button className="checkout-btn-primary" onClick={() => navigate('/dashboard')}>
            Voltar ao Marketplace
          </button>
        </div>
      </div>
    );
  }

  const hourlyTotal = hours * talent.hourlyRate;
  const platformFee = hourlyTotal * 0.05;
  const total = hourlyTotal + platformFee;
  const formatCurrency = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handlePay = async () => {
    if (payMethod === 'card') {
      if (!cardNumber || !cardName || !cardExpiry || !cardCVC) {
        alert('Preencha todos os campos do cartão.');
        return;
      }
    }

    const usuario = getUsuarioLogado();
    if (!usuario) {
      navigate('/login');
      return;
    }

    setStep('processing');
    setProcessing(true);

    // Simula processamento de 3 segundos
    await new Promise(res => setTimeout(res, 3000));

    try {
      await criarContratacao(usuario.id, talent!.id, hours, total);
      
      // Adiciona notificações
      addNotification({
        type: 'payment',
        title: 'Pagamento Aprovado',
        description: `Pagamento de ${formatCurrency(total)} para ${talent!.nome} foi processado com sucesso.`,
      });
      addNotification({
        type: 'hire',
        title: 'Contratação Confirmada',
        description: `Você contratou ${talent!.nome} (${talent!.role}) por ${hours}h.`,
      });

      setStep('success');
    } catch (err) {
      console.error(err);
      alert('Erro ao processar pagamento.');
      setStep('form');
    } finally {
      setProcessing(false);
    }
  };

  if (step === 'processing') {
    return (
      <div className="checkout-container">
        <div className="checkout-processing-screen">
          <div className="checkout-spinner" />
          <h2>Processando Pagamento...</h2>
          <p>Verificando dados com a operadora. Não feche esta página.</p>
          <div className="checkout-processing-steps">
            <div className="checkout-pstep done"><Check size={14} /> Dados validados</div>
            <div className="checkout-pstep active"><div className="checkout-mini-spinner" /> Processando transação</div>
            <div className="checkout-pstep"><Lock size={14} /> Confirmação de segurança</div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="checkout-container">
        <div className="checkout-success-screen">
          <div className="checkout-success-icon">
            <Check size={40} />
          </div>
          <h2>Pagamento Aprovado!</h2>
          <p className="checkout-success-desc">
            A contratação de <strong>{talent.nome}</strong> foi processada com sucesso. 
            O valor de <strong>{formatCurrency(total)}</strong> será retido no NexusEscrow™ até a aprovação da entrega.
          </p>
          <div className="checkout-receipt">
            <div className="checkout-receipt-row">
              <span>ID da Transação</span>
              <span>#NX-{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="checkout-receipt-row">
              <span>Profissional</span>
              <span>{talent.nome}</span>
            </div>
            <div className="checkout-receipt-row">
              <span>Carga Horária</span>
              <span>{hours}h</span>
            </div>
            <div className="checkout-receipt-row">
              <span>Método</span>
              <span>{payMethod === 'card' ? 'Cartão de Crédito' : 'PIX'}</span>
            </div>
            <div className="checkout-receipt-row total">
              <span>Total Pago</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          <div className="checkout-success-actions">
            <button className="checkout-btn-primary" onClick={() => navigate(`/chat?talentoId=${talent!.id}`)}>
              Enviar Mensagem
            </button>
            <button className="checkout-btn-secondary" onClick={() => navigate('/dashboard')}>
              Voltar ao Marketplace
            </button>
          </div>
          <div className="checkout-secure-badge">
            <ShieldCheck size={14} />
            Transação protegida por NexusEscrow™
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="checkout-wrapper">
        {/* Left: Payment Form */}
        <div className="checkout-form-side">
          <button className="checkout-back" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Voltar
          </button>

          <div className="checkout-form-header">
            <Lock size={20} className="checkout-lock-icon" />
            <div>
              <h1>Pagamento Seguro</h1>
              <p>Seus dados são criptografados e protegidos.</p>
            </div>
          </div>

          {/* Payment Method Tabs */}
          <div className="checkout-method-tabs">
            <button 
              className={`checkout-method-tab ${payMethod === 'card' ? 'active' : ''}`}
              onClick={() => setPayMethod('card')}
            >
              <CreditCard size={18} />
              Cartão de Crédito
            </button>
            <button 
              className={`checkout-method-tab ${payMethod === 'pix' ? 'active' : ''}`}
              onClick={() => setPayMethod('pix')}
            >
              <Smartphone size={18} />
              PIX
            </button>
          </div>

          {payMethod === 'card' && (
            <div className="checkout-card-form">
              <div className="checkout-field">
                <label>Número do Cartão</label>
                <div className="checkout-input-wrapper">
                  <CreditCard size={16} className="checkout-input-icon" />
                  <input 
                    type="text" 
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                  />
                </div>
              </div>
              <div className="checkout-field">
                <label>Nome no Cartão</label>
                <input 
                  type="text" 
                  placeholder="Como aparece no cartão"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                />
              </div>
              <div className="checkout-field-row">
                <div className="checkout-field">
                  <label>Validade</label>
                  <input 
                    type="text" 
                    placeholder="MM/AA"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                  />
                </div>
                <div className="checkout-field">
                  <label>CVC</label>
                  <input 
                    type="text" 
                    placeholder="123"
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
          )}

          {payMethod === 'pix' && (
            <div className="checkout-pix-section">
              <div className="checkout-pix-qr">
                <div className="checkout-pix-qr-placeholder">
                  <Smartphone size={40} />
                  <span>QR Code PIX</span>
                  <small>Escaneie com seu app bancário</small>
                </div>
              </div>
              <div className="checkout-pix-info">
                <p>Copie o código PIX abaixo ou escaneie o QR Code para realizar o pagamento.</p>
                <div className="checkout-pix-code">
                  <code>00020126580014br.gov.bcb.pix0136nexustech-{talentoId}-{hours}h</code>
                  <button onClick={() => { navigator.clipboard?.writeText(`nexustech-pix-${talentoId}`); alert('Código PIX copiado!'); }}>
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          )}

          <button 
            className="checkout-pay-btn"
            onClick={handlePay}
            disabled={processing}
          >
            <Lock size={16} />
            {payMethod === 'card' ? `Pagar ${formatCurrency(total)}` : `Confirmar PIX ${formatCurrency(total)}`}
          </button>

          <div className="checkout-trust-badges">
            <span><ShieldCheck size={14} /> SSL 256-bit</span>
            <span><Lock size={14} /> PCI Compliant</span>
            <span><Building size={14} /> NexusEscrow™</span>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="checkout-summary-side">
          <h2>Resumo do Pedido</h2>

          <div className="checkout-talent-info">
            <img 
              src={talent.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} 
              alt={talent.nome}
              className="checkout-talent-avatar"
            />
            <div>
              <h3>{talent.nome}</h3>
              <p>{talent.role}</p>
            </div>
          </div>

          <div className="checkout-summary-rows">
            <div className="checkout-summary-row">
              <span>Taxa Horária ({hours}h × {formatCurrency(talent.hourlyRate)})</span>
              <span>{formatCurrency(hourlyTotal)}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Plataforma Nexus (5%)</span>
              <span>{formatCurrency(platformFee)}</span>
            </div>
            <div className="checkout-summary-divider" />
            <div className="checkout-summary-row total">
              <span>Total</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>

          <div className="checkout-guarantee">
            <ShieldCheck size={20} />
            <div>
              <strong>Garantia Nexus</strong>
              <p>Seus fundos só são liberados após aprovação da entrega. 100% seguro.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
