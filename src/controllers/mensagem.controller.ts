import { Request, Response } from 'express';
import { criarMensagemDto } from '../dtos/mensagem.dto';
import * as mensagemRepository from '../repositories/mensagem.repository';

const erroInterno = (res: Response, erro: unknown) => {
  console.error(erro);
  res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
};

export const criar = (req: Request, res: Response): void => {
  const validacao = criarMensagemDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  try {
    const { remetenteId, destinatarioId, conteudo } = validacao.data;
    const novaMensagem = mensagemRepository.enviarMensagem(
      remetenteId,
      destinatarioId,
      conteudo
    );
    res.status(201).json(novaMensagem);
  } catch (erro) {
    erroInterno(res, erro);
  }
};

export const obterConversa = (req: Request, res: Response): void => {
  const usuarioId = Number(req.params.usuarioId);
  const outroId = Number(req.params.outroId);

  if (isNaN(usuarioId) || isNaN(outroId)) {
    res.status(400).json({ erro: 'Os IDs fornecidos devem ser números válidos.' });
    return;
  }

  try {
    const conversa = mensagemRepository.obterConversa(usuarioId, outroId);
    res.json(conversa);
  } catch (erro) {
    erroInterno(res, erro);
  }
};

export const obterContatos = (req: Request, res: Response): void => {
  const usuarioId = Number(req.params.usuarioId);

  if (isNaN(usuarioId)) {
    res.status(400).json({ erro: 'O usuarioId deve ser um número válido.' });
    return;
  }

  try {
    const contatos = mensagemRepository.obterContatosRecentes(usuarioId);
    res.json(contatos);
  } catch (erro) {
    erroInterno(res, erro);
  }
};

export const marcarLida = (req: Request, res: Response): void => {
  const usuarioId = Number(req.params.usuarioId);
  const outroId = Number(req.params.outroId);

  if (isNaN(usuarioId) || isNaN(outroId)) {
    res.status(400).json({ erro: 'Os IDs fornecidos devem ser números válidos.' });
    return;
  }

  try {
    mensagemRepository.marcarConversaComoLida(usuarioId, outroId);
    res.status(204).send();
  } catch (erro) {
    erroInterno(res, erro);
  }
};

export const obterNaoLidas = (req: Request, res: Response): void => {
  const usuarioId = Number(req.params.usuarioId);

  if (isNaN(usuarioId)) {
    res.status(400).json({ erro: 'O usuarioId deve ser um número válido.' });
    return;
  }

  try {
    const totalNaoLidas = mensagemRepository.contarNaoLidas(usuarioId);
    res.json({ totalNaoLidas });
  } catch (erro) {
    erroInterno(res, erro);
  }
};
