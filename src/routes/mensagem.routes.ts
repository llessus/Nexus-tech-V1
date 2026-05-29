import { Router } from 'express';
import * as mensagemController from '../controllers/mensagem.controller';

const router = Router();

router.post('/', mensagemController.criar);
router.get('/:usuarioId/conversa/:outroId', mensagemController.obterConversa);
router.get('/:usuarioId/contatos', mensagemController.obterContatos);
router.patch('/:usuarioId/conversa/:outroId/lida', mensagemController.marcarLida);
router.get('/:usuarioId/nao-lidas', mensagemController.obterNaoLidas);

export default router;
