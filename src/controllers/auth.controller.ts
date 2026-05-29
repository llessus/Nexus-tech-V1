import { Request, Response } from 'express';
import { loginDto, registrarUsuarioDto } from '../dtos/auth.dto';
import * as usuarioRepository from '../repositories/usuario.repository';
import { criarHashSenha, validarSenha } from '../utils/password';

export const registrar = (req: Request, res: Response): void => {
  const validacao = registrarUsuarioDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json({ campos: validacao.error.flatten().fieldErrors });
    return;
  }

  try {
    if (usuarioRepository.buscarUsuarioPorEmail(validacao.data.email)) {
      res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
      return;
    }

    const senhaHash = criarHashSenha(validacao.data.senha);
    const usuario = usuarioRepository.criarUsuario(validacao.data, senhaHash);
    res.status(201).json({ usuario });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
  }
};

export const login = (req: Request, res: Response): void => {
  const validacao = loginDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json({ campos: validacao.error.flatten().fieldErrors });
    return;
  }

  try {
    const usuario = usuarioRepository.buscarUsuarioPorEmail(validacao.data.email);

    if (!usuario || !validarSenha(validacao.data.senha, usuario.senhaHash)) {
      res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
      return;
    }

    res.json({
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipoConta: usuario.tipoConta
      }
    });
  } catch (erro) {
    console.error(erro);
    res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
  }
};

