import { Router } from 'express';
import * as talentoController from '../controllers/talento.controller';

const router = Router();

router.get('/', talentoController.listar);
router.get('/:id', talentoController.obterPorId);
router.post('/', talentoController.criar);
router.put('/:id', talentoController.substituir);
router.patch('/:id', talentoController.atualizar);
router.delete('/:id', talentoController.remover);

export default router;
