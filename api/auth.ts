import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loginDto, registrarUsuarioDto } from '../src/dtos/auth.dto.js';
import * as usuarioRepository from '../src/repositories/usuario.repository.js';
import { validarSenha, criarHashSenha } from '../src/utils/password.js';

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
          avatarUrl: usuario.avatarUrl,
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
  } else if (path.endsWith('/perfil') && (req.method === 'PUT' || req.method === 'PATCH')) {
    const { id, nome, avatarUrl } = req.body;
    if (!id || !nome) {
      return res.status(400).json({ erro: 'ID e Nome são obrigatórios.' });
    }
    try {
      const usuarioAtualizado = await usuarioRepository.atualizarUsuario(Number(id), nome, avatarUrl || null);
      if (!usuarioAtualizado) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }
      return res.json({ usuario: usuarioAtualizado });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  } else if (path.endsWith('/usuario') && req.method === 'GET') {
    const idStr = req.query.id;
    if (!idStr) {
      return res.status(400).json({ erro: 'O ID do usuário é obrigatório.' });
    }
    const id = Number(idStr);
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'O ID deve ser um número válido.' });
    }
    try {
      const usuario = await usuarioRepository.buscarUsuarioPorId(id);
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }
      return res.json({ usuario });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  } else {
    return res.status(404).json({ erro: 'Rota não encontrada.' });
  }
}
