import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

async function readBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: any[] = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', (err) => reject(err));
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  try {
    const filename = req.query.filename as string;
    if (!filename) {
      return res.status(400).json({ erro: 'O parâmetro filename é obrigatório.' });
    }

    const bodyBuffer = await readBody(req);
    if (bodyBuffer.length === 0) {
      return res.status(400).json({ erro: 'O corpo da requisição não pode estar vazio.' });
    }

    const blob = await put(filename, bodyBuffer, {
      access: 'public',
    });

    return res.json(blob);
  } catch (erro) {
    console.error(erro);
    return res.status(500).json({ erro: 'Erro ao fazer upload da imagem.' });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
