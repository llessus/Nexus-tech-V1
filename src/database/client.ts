import { neon } from '@neondatabase/serverless';

export function getSQL() {
  const databaseUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL ou POSTGRES_URL não está definida nas variáveis de ambiente.');
  }
  return neon(databaseUrl);
}
