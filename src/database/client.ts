import { neon } from '@neondatabase/serverless';

export function getSQL() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL não está definida nas variáveis de ambiente.');
  }
  return neon(databaseUrl);
}
