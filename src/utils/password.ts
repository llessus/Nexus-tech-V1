import { pbkdf2Sync, randomBytes, timingSafeEqual } from 'crypto';

const ITERATIONS = 100000;
const KEY_LENGTH = 32;
const DIGEST = 'sha256';

export const criarHashSenha = (senha: string): string => {
  const salt = randomBytes(16).toString('base64url');
  const hash = pbkdf2Sync(senha, salt, ITERATIONS, KEY_LENGTH, DIGEST).toString('base64');

  return `pbkdf2-sha256$${ITERATIONS}$${salt}$${hash}`;
};

export const validarSenha = (senha: string, senhaHash: string): boolean => {
  const [algoritmo, iterationsValue, salt, hash] = senhaHash.split('$');

  if (algoritmo !== 'pbkdf2-sha256' || !iterationsValue || !salt || !hash) {
    return false;
  }

  const iterations = Number(iterationsValue);
  const expected = Buffer.from(hash, 'base64');
  const received = pbkdf2Sync(senha, salt, iterations, expected.length, DIGEST);

  return expected.length === received.length && timingSafeEqual(expected, received);
};
