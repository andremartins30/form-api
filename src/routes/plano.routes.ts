import { Router } from 'express';
import { FormController } from '../controllers/form.controller';

const router = Router();
const formController = new FormController();

/**
 * GET /api/planos/list
 * Lista resumida de planos (otimizado para listagem)
 * Query params: municipio, categoriaId, formType, status, dataInicio, dataFim, cnpj, page, limit
 */
router.get('/list', formController.getPlanosLight);

/**
 * GET /api/planos
 * Lista planos com filtros e paginação
 * Query params: municipio, categoriaId, formType, status, dataInicio, dataFim, cnpj, page, limit
 */
router.get('/', formController.getPlanos);

/**
 * GET /api/planos/stats
 * Gera estatísticas agregadas dos planos
 * Query params: municipio, formType, status
 * IMPORTANTE: Esta rota deve vir ANTES de /:id para não capturar "stats" como ID
 */
router.get('/stats', formController.getStats);

/**
 * GET /api/planos/:id
 * Busca um plano específico por ID com todos os relacionamentos
 */
router.get('/:id', formController.getPlanoById);

/**
 * POST /api/planos
 * Cria um novo plano de formulário
 */
router.post('/', formController.createPlano);

/**
 * PUT /api/planos/:id
 * Atualiza um plano existente
 */
router.put('/:id', formController.updatePlano);

export default router;
