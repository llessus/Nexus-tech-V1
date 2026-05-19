import { Router } from 'express';
import * as servicoController from '../controllers/servico.controller';

const router = Router();

router.get('/', servicoController.listar);
router.get('/:id', servicoController.obterPorId);
router.post('/', servicoController.criar);
router.put('/:id', servicoController.substituir);
router.patch('/:id', servicoController.atualizar);
router.delete('/:id', servicoController.remover);

export default router;
