import { getSQL } from '../database/client.js';

export interface AdminStats {
  totalUsuarios: number;
  servicosAtivos: number;
  totalReceita: number;
  aprovacoesPendentes: number;
}

export interface AdminUser {
  id: number;
  nome: string;
  email: string;
  tipoConta: string;
  createdAt: string;
  avatarUrl: string | null;
}

export interface AdminContratacao {
  id: number;
  clienteNome: string;
  clienteEmail: string;
  talentoNome: string;
  talentoRole: string;
  horas: number;
  valorTotal: number;
  status: string;
  createdAt: string;
}

export interface AdminServico {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  talentoNome: string;
  talentoEmail: string;
  createdAt: string;
}

export const obterStats = async (): Promise<AdminStats> => {
  const sql = getSQL();

  const totalUsuariosResult = await sql`SELECT COUNT(*)::int as count FROM usuarios`;
  const servicosAtivosResult = await sql`SELECT COUNT(*)::int as count FROM contratacoes WHERE status = 'Confirmado' OR status = 'Em andamento'`;
  const totalReceitaResult = await sql`SELECT SUM(valor_total)::numeric as sum FROM contratacoes`;
  
  // Aprovações pendentes: número de usuários do tipo prestador cadastrados recentemente 
  // que ainda não têm nenhuma contratação iniciada.
  const pendentesResult = await sql`
    SELECT COUNT(*)::int as count 
    FROM usuarios u
    WHERE u.tipo_conta = 'prestador' 
      AND u.id NOT IN (
        SELECT DISTINCT t.usuario_id 
        FROM talentos t 
        JOIN contratacoes c ON c.talento_id = t.id
      )
  `;

  return {
    totalUsuarios: totalUsuariosResult[0]?.count || 0,
    servicosAtivos: servicosAtivosResult[0]?.count || 0,
    totalReceita: Number(totalReceitaResult[0]?.sum || 0),
    aprovacoesPendentes: pendentesResult[0]?.count || 0,
  };
};

export const listarTodosUsuarios = async (): Promise<AdminUser[]> => {
  const sql = getSQL();
  const rows = await sql`
    SELECT id, nome, email, tipo_conta, created_at, avatar_url 
    FROM usuarios 
    ORDER BY created_at DESC
  `;
  return rows.map((row: any) => ({
    id: row.id,
    nome: row.nome,
    email: row.email,
    tipoConta: row.tipo_conta,
    createdAt: row.created_at,
    avatarUrl: row.avatar_url,
  }));
};

export const listarTodasContratacoes = async (): Promise<AdminContratacao[]> => {
  const sql = getSQL();
  const rows = await sql`
    SELECT 
      c.id, 
      c.horas, 
      c.valor_total, 
      c.status, 
      c.created_at,
      u.nome as cliente_nome, 
      u.email as cliente_email,
      t.nome as talento_nome, 
      t.role as talento_role
    FROM contratacoes c
    JOIN usuarios u ON c.cliente_id = u.id
    JOIN talentos t ON c.talento_id = t.id
    ORDER BY c.created_at DESC
  `;
  return rows.map((row: any) => ({
    id: row.id,
    clienteNome: row.cliente_nome,
    clienteEmail: row.cliente_email,
    talentoNome: row.talento_nome,
    talentoRole: row.talento_role,
    horas: row.horas,
    valorTotal: Number(row.valor_total),
    status: row.status,
    createdAt: row.created_at,
  }));
};

export const listarTodosServicos = async (): Promise<AdminServico[]> => {
  const sql = getSQL();
  const rows = await sql`
    SELECT 
      s.id, 
      s.titulo, 
      s.descricao, 
      s.preco, 
      s.created_at,
      t.nome as talento_nome, 
      t.email as talento_email
    FROM servicos s
    JOIN talentos t ON s.talento_id = t.id
    ORDER BY s.id DESC
  `;
  return rows.map((row: any) => ({
    id: row.id,
    titulo: row.titulo,
    descricao: row.descricao,
    preco: Number(row.preco),
    talentoNome: row.talento_nome,
    talentoEmail: row.talento_email,
    createdAt: row.created_at,
  }));
};
