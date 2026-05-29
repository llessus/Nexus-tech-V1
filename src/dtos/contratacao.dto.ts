import { z } from 'zod';

export const criarContratacaoDto = z.object({
  clienteId: z.number().int().positive(),
  talentoId: z.number().int().positive(),
  horas: z.number().int().positive(),
  valorTotal: z.number().positive(),
});
