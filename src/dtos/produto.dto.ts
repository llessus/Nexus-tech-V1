import { z } from 'zod';

export const criarProdutoDto = z.object({
  nome: z.string({
    required_error: 'O nome é obrigatório.',
    invalid_type_error: 'O nome deve ser uma string.',
  }).min(3, 'O nome deve ter no mínimo 3 caracteres.'),
  preco: z.number({
    required_error: 'O preço é obrigatório.',
    invalid_type_error: 'O preço deve ser um número.',
  }).positive('O preço deve ser maior que zero.'),
  descricao: z.string().optional(),
});

export const atualizarProdutoDto = criarProdutoDto.partial();

export type CriarProdutoDto = z.infer<typeof criarProdutoDto>;
export type AtualizarProdutoDto = z.infer<typeof atualizarProdutoDto>;
