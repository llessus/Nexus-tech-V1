import { Router } from 'express';
import * as contratacaoController from '../controllers/contratacao.controller';

const router = Router();

router.post('/', contratacaoController.criar);
router.get('/cliente/:clienteId', contratacaoController.listarPorCliente);

export default router;
