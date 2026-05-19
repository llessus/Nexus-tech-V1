import { z } from 'zod';

export const criarServicoDto = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().min(10, 'A descrição deve ter no mínimo 10 caracteres'),
  preco: z.number().positive('O preço deve ser positivo'),
  talentoId: z.number().positive('O ID do talento é obrigatório e deve ser positivo')
});

export const atualizarServicoDto = criarServicoDto.partial();
