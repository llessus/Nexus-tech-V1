import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loginDto } from '../../src/dtos/auth.dto';
import * as usuarioRepository from '../../src/repositories/usuario.repository';
import { validarSenha } from '../../src/utils/password';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const validacao = loginDto.safeParse(req.body);

  if (!validacao.success) {
    return res.status(400).json({ campos: validacao.error.flatten().fieldErrors });
  }

  try {
    const usuario = await usuarioRepository.buscarUsuarioPorEmail(validacao.data.email);

    if (!usuario || !validarSenha(validacao.data.senha, usuario.senhaHash)) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    return res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipoConta: usuario.tipoConta,
      },
    });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
  }
}
