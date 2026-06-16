import type { VercelRequest, VercelResponse } from '@vercel/node';
import { criarMensagemDto } from '../src/dtos/mensagem.dto.js';
import * as mensagemRepository from '../src/repositories/mensagem.repository.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const url = req.url || '';
  const path = url.split('?')[0];
  const parts = path.split('/').filter(Boolean);

  // parts could be:
  // ["api", "mensagens"]
  // ["api", "mensagens", ":usuarioId", "contatos"]
  // ["api", "mensagens", ":usuarioId", "nao-lidas"]
  // ["api", "mensagens", ":usuarioId", "conversa", ":outroId"]
  // ["api", "mensagens", ":usuarioId", "conversa", ":outroId", "lida"]

  if (parts.length === 2) {
    if (req.method !== 'POST') {
      return res.status(405).json({ erro: 'Método não permitido.' });
    }

    const validacao = criarMensagemDto.safeParse(req.body);
    if (!validacao.success) {
      return res.status(400).json(validacao.error.flatten().fieldErrors);
    }

    try {
      const { remetenteId, destinatarioId, conteudo } = validacao.data;
      const novaMensagem = await mensagemRepository.enviarMensagem(
        remetenteId,
        destinatarioId,
        conteudo
      );
      return res.status(201).json(novaMensagem);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  } else if (parts.length === 4 && parts[3] === 'contatos') {
    if (req.method !== 'GET') {
      return res.status(405).json({ erro: 'Método não permitido.' });
    }

    const usuarioId = Number(parts[2]);
    if (isNaN(usuarioId)) {
      return res.status(400).json({ erro: 'O usuarioId deve ser um número válido.' });
    }

    try {
      const contatos = await mensagemRepository.obterContatosRecentes(usuarioId);
      return res.json(contatos);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  } else if (parts.length === 4 && parts[3] === 'nao-lidas') {
    if (req.method !== 'GET') {
      return res.status(405).json({ erro: 'Método não permitido.' });
    }

    const usuarioId = Number(parts[2]);
    if (isNaN(usuarioId)) {
      return res.status(400).json({ erro: 'O usuarioId deve ser um número válido.' });
    }

    try {
      const totalNaoLidas = await mensagemRepository.contarNaoLidas(usuarioId);
      return res.json({ totalNaoLidas });
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  } else if (parts.length === 5 && parts[3] === 'conversa') {
    if (req.method !== 'GET') {
      return res.status(405).json({ erro: 'Método não permitido.' });
    }

    const usuarioId = Number(parts[2]);
    const outroId = Number(parts[4]);

    if (isNaN(usuarioId) || isNaN(outroId)) {
      return res.status(400).json({ erro: 'Os IDs fornecidos devem ser números válidos.' });
    }

    try {
      const conversa = await mensagemRepository.obterConversa(usuarioId, outroId);
      return res.json(conversa);
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  } else if (parts.length === 6 && parts[3] === 'conversa' && parts[5] === 'lida') {
    if (req.method !== 'PATCH') {
      return res.status(405).json({ erro: 'Método não permitido.' });
    }

    const usuarioId = Number(parts[2]);
    const outroId = Number(parts[4]);

    if (isNaN(usuarioId) || isNaN(outroId)) {
      return res.status(400).json({ erro: 'Os IDs fornecidos devem ser números válidos.' });
    }

    try {
      await mensagemRepository.marcarConversaComoLida(usuarioId, outroId);
      return res.status(204).end();
    } catch (erro) {
      console.error(erro);
      return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
    }
  } else if (parts.length === 3) {
    const mensagemId = Number(parts[2]);
    if (isNaN(mensagemId)) {
      return res.status(400).json({ erro: 'O ID da mensagem deve ser um número válido.' });
    }

    if (req.method === 'DELETE') {
      try {
        await mensagemRepository.deletarMensagem(mensagemId);
        return res.status(204).end();
      } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
      }
    } else if (req.method === 'PATCH') {
      try {
        const { conteudo } = req.body;
        if (!conteudo || typeof conteudo !== 'string') {
          return res.status(400).json({ erro: 'O conteúdo é obrigatório e deve ser uma string.' });
        }
        const mensagemAtualizada = await mensagemRepository.editarMensagem(mensagemId, conteudo);
        return res.json(mensagemAtualizada);
      } catch (erro) {
        console.error(erro);
        return res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
      }
    } else {
      return res.status(405).json({ erro: 'Método não permitido.' });
    }
  }

  return res.status(404).json({ erro: 'Rota não encontrada.' });
}

