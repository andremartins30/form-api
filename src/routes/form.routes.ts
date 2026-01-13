import { Router } from 'express';
import { FormController } from '../controllers/form.controller';

const router = Router();
const formController = new FormController();

/**
 * POST /api/forms/submissions
 * Cria uma nova submissão de formulário
 */
router.post('/submissions', formController.createSubmission);

/**
 * GET /api/forms/submissions
 * Lista todas as submissões
 */
router.get('/submissions', formController.getAllSubmissions);

/**
 * GET /api/forms/submissions/:id
 * Busca uma submissão específica por ID
 */
router.get('/submissions/:id', formController.getSubmissionById);

export default router;
