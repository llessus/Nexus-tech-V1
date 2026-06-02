import type { VercelRequest, VercelResponse } from '@vercel/node';
import { registrarUsuarioDto } from '../../src/dtos/auth.dto';
import * as usuarioRepository from '../../src/repositories/usuario.repository';
import { criarHashSenha } from '../../src/utils/password';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  const validacao = registrarUsuarioDto.safeParse(req.body);

  if (!validacao.success) {
    return res.status(400).json({ campos: validacao.error.flatten().fieldErrors });
  }

  try {
    const existente = await usuarioRepository.buscarUsuarioPorEmail(validacao.data.email);
    if (existente) {
      return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
    }

    const senhaHash = criarHashSenha(validacao.data.senha);
    const usuario = await usuarioRepository.criarUsuario(validacao.data, senhaHash);
    return res.status(201).json({ usuario });
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
  }
}
