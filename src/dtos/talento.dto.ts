import { z } from 'zod';

export const criarTalentoDto = z.object({
  nome: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  role: z.string().min(1, 'A ocupação (role) é obrigatória'),
  hourlyRate: z.number().positive('O valor hora deve ser positivo'),
  skills: z.array(z.string()).min(1, 'Deve ter pelo menos uma habilidade'),
  bio: z.string().optional(),
  avatarUrl: z.string().url('A URL do avatar deve ser válida.').optional()
});

export const atualizarTalentoDto = criarTalentoDto.partial();
