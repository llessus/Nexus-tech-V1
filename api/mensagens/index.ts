import type { VercelRequest, VercelResponse } from '@vercel/node';
import { criarMensagemDto } from '../../src/dtos/mensagem.dto';
import * as mensagemRepository from '../../src/repositories/mensagem.repository';

export default async function handler(req: VercelRequest, res: VercelResponse) {
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
}
