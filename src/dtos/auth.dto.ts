import { z } from 'zod';

export const registrarUsuarioDto = z.object({
  nome: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  email: z.string().email('Informe um e-mail válido.'),
  senha: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  tipoConta: z.enum(['cliente', 'prestador'], {
    required_error: 'Escolha o tipo de conta.',
  }),
});

export const loginDto = z.object({
  email: z.string().email('Informe um e-mail válido.'),
  senha: z.string().min(1, 'Informe a senha.'),
});

export type RegistrarUsuarioDto = z.infer<typeof registrarUsuarioDto>;
export type LoginDto = z.infer<typeof loginDto>;
