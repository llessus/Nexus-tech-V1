import { z } from 'zod';

export const criarMensagemDto = z.object({
  remetenteId: z.number().int().positive(),
  destinatarioId: z.number().int().positive(),
  conteudo: z.string().min(1).max(1000),
}).refine(data => data.remetenteId !== data.destinatarioId, {
  message: 'Não é possível enviar mensagens para si mesmo.',
  path: ['destinatarioId'],
});
