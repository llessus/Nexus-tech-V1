export interface Projeto {
  id: string;
  tipo: string;
  titulo: string;
  descricao: string;
  tecnologias: string;
  orcamento: string;
  prazo: string;
  clienteId: number;
  clienteNome: string;
  clienteEmail: string;
  createdAt: string;
}

const STORAGE_KEY = 'nexus:projetos_v1';

const INITIAL_PROJECTS: Projeto[] = [
  {
    id: 'proj_1',
    tipo: 'Design UI/UX',
    titulo: 'Redesign Completo de Dashboard SaaS',
    descricao: 'Procuramos um Designer experiente para reformular nossa interface SaaS atual. Temos wireframes prontos, precisamos de alta fidelidade no Figma e protótipo interativo. O foco principal é em usabilidade e clean style.',
    tecnologias: 'Figma, Tailwind CSS, Componentização',
    orcamento: 'R$ 4.800,00',
    prazo: 'Curto prazo (1-2 semanas)',
    clienteId: 9991,
    clienteNome: 'Mariana Silveira',
    clienteEmail: 'mariana.bi@empresa.com',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 dia atrás
  },
  {
    id: 'proj_2',
    tipo: 'Desenvolvimento Web',
    titulo: 'Integração de Gateway de Pagamento (Stripe/Pix)',
    descricao: 'Precisamos de um dev Back-End ou Full-Stack para integrar pagamento via Pix e cartão de crédito em nossa plataforma de cursos baseada em React e Node.js.',
    tecnologias: 'React, Node.js, Express, Stripe API',
    orcamento: 'R$ 3.500,00',
    prazo: 'Urgente (menos de 1 semana)',
    clienteId: 9992,
    clienteNome: 'Ricardo Mendes',
    clienteEmail: 'ricardo.mendes@loja.com',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 dias atrás
  },
  {
    id: 'proj_3',
    tipo: 'Aplicativo Mobile',
    titulo: 'Aplicativo Cross-Platform para Controle de Hábitos',
    descricao: 'Desenvolvimento de aplicativo móvel minimalista para rastreamento de hábitos saudáveis, com notificações push diárias e gráficos de progresso simples. Queremos rodar em iOS e Android.',
    tecnologias: 'Flutter ou React Native, SQLite',
    orcamento: 'R$ 7.200,00',
    prazo: 'Médio prazo (2-4 semanas)',
    clienteId: 9993,
    clienteNome: 'Sabrina Carvalho',
    clienteEmail: 'sabrina@nexus.tech',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 dias atrás
  }
];

export const obterProjetos = (): Projeto[] => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PROJECTS));
    return INITIAL_PROJECTS;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_PROJECTS;
  }
};

export const salvarProjeto = (projeto: Omit<Projeto, 'id' | 'createdAt'>): Projeto => {
  const projetos = obterProjetos();
  const novo: Projeto = {
    ...projeto,
    id: 'proj_' + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString()
  };
  projetos.unshift(novo); // Adiciona ao início
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projetos));
  return novo;
};
