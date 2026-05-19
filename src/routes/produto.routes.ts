import { Router } from 'express';
import * as produtoController from '../controllers/produto.controller';

const router = Router();

router.get('/', produtoController.listar);
router.get('/:id', produtoController.obterPorId);
router.post('/', produtoController.criar);
router.put('/:id', produtoController.substituir);
router.patch('/:id', produtoController.atualizar);
router.delete('/:id', produtoController.remover);

export default router;
