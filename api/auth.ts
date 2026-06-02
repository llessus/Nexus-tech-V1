import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loginDto, registrarUsuarioDto } from '../src/dtos/auth.dto';
import * as usuarioRepository from '../src/repositories/usuario.repository';
import { validarSenha, criarHashSenha } from '../src/utils/password';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '';
  const path = url.split('?')[0];

  if (path.endsWith('/login') && req.method === 'POST') {
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
  } else if (path.endsWith('/register') && req.method === 'POST') {
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
  } else {
    return res.status(404).json({ erro: 'Rota não encontrada.' });
  }
}
