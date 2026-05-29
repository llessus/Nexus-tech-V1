import { Request, Response } from 'express';
import { criarContratacaoDto } from '../dtos/contratacao.dto';
import * as contratacaoRepository from '../repositories/contratacao.repository';

const erroInterno = (res: Response, erro: unknown) => {
  console.error(erro);
  res.status(500).json({ erro: 'Erro ao acessar o banco de dados.' });
};

export const criar = (req: Request, res: Response): void => {
  const validacao = criarContratacaoDto.safeParse(req.body);

  if (!validacao.success) {
    res.status(400).json(validacao.error.flatten().fieldErrors);
    return;
  }

  try {
    const { clienteId, talentoId, horas, valorTotal } = validacao.data;
    const novaContratacao = contratacaoRepository.criarContratacao(
      clienteId,
      talentoId,
      horas,
      valorTotal
    );
    res.status(201).json(novaContratacao);
  } catch (erro) {
    erroInterno(res, erro);
  }
};

export const listarPorCliente = (req: Request, res: Response): void => {
  const clienteId = Number(req.params.clienteId);

  if (isNaN(clienteId)) {
    res.status(400).json({ erro: 'O clienteId deve ser um número válido.' });
    return;
  }

  try {
    const contratacoes = contratacaoRepository.listarContratacoesPorCliente(clienteId);
    res.json(contratacoes);
  } catch (erro) {
    erroInterno(res, erro);
  }
};
