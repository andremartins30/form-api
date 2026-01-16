import { Router } from 'express';
import { FormController } from '../controllers/form.controller';

const router = Router();
const formController = new FormController();

/**
 * POST /api/forms/planos
 * Cria um novo plano de formulário
 */
router.post('/planos', formController.createPlano);

/**
 * GET /api/forms/planos
 * Lista todos os planos (compatibilidade legada)
 * @deprecated Use GET /api/planos
 */
router.get('/planos', formController.getAllPlanos);

/**
 * GET /api/forms/planos/:id
 * Busca um plano específico por ID
 * @deprecated Use GET /api/planos/:id
 */
router.get('/planos/:id', formController.getPlanoById);

export default router;
