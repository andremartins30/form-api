import { Request, Response } from 'express';
import { FormService } from '../services/form.service';
import { z } from 'zod';
import { PlanoFilters } from '../types/formPlano.types';

export class FormController {
    private formService: FormService;

    constructor() {
        this.formService = new FormService();
    }

    /**
     * POST /api/planos
     * Cria um novo plano de formulário (versão híbrida)
     */
    createPlano = async (req: Request, res: Response): Promise<void> => {
        try {
            const plano = await this.formService.createPlano(req.body);

            res.status(201).json({
                success: true,
                data: {
                    id: plano.id,
                    nomeProponente: plano.nomeProponente,
                    cnpj: plano.cnpj,
                    municipio: plano.municipio,
                    formType: plano.formType,
                    status: plano.status,
                    createdAt: plano.createdAt,
                },
                message: 'Plano criado com sucesso',
            });
        } catch (error) {
            // Erro de validação Zod
            if (error instanceof z.ZodError) {
                res.status(400).json({
                    success: false,
                    error: 'Dados inválidos',
                    details: error.issues,
                });
                return;
            }

            // Outros erros
            console.error('Erro ao criar plano:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
            });
        }
    };

    /**
     * GET /api/planos/list
     * Lista resumida de planos (otimizado para listagem)
     * Query params: municipio, categoriaId, formType, status, dataInicio, dataFim, cnpj, page, limit
     */
    getPlanosLight = async (req: Request, res: Response): Promise<void> => {
        try {
            const filters: PlanoFilters = {
                municipio: req.query.municipio as string,
                categoriaId: req.query.categoriaId ? parseInt(req.query.categoriaId as string) : undefined,
                formType: req.query.formType as string,
                status: req.query.status as string,
                cnpj: req.query.cnpj as string,
                dataInicio: req.query.dataInicio ? new Date(req.query.dataInicio as string) : undefined,
                dataFim: req.query.dataFim ? new Date(req.query.dataFim as string) : undefined,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
            };

            const result = await this.formService.getPlanosLight(filters);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error('Erro ao listar planos (light):', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
            });
        }
    };

    /**
     * GET /api/planos
     * Lista planos com filtros e paginação (completo)
     * Query params: municipio, categoriaId, formType, status, dataInicio, dataFim, cnpj, page, limit
     */
    getPlanos = async (req: Request, res: Response): Promise<void> => {
        try {
            const filters: PlanoFilters = {
                municipio: req.query.municipio as string,
                categoriaId: req.query.categoriaId ? parseInt(req.query.categoriaId as string) : undefined,
                formType: req.query.formType as string,
                status: req.query.status as string,
                cnpj: req.query.cnpj as string,
                dataInicio: req.query.dataInicio ? new Date(req.query.dataInicio as string) : undefined,
                dataFim: req.query.dataFim ? new Date(req.query.dataFim as string) : undefined,
                page: req.query.page ? parseInt(req.query.page as string) : 1,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 50,
            };

            const result = await this.formService.getPlanos(filters);

            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            console.error('Erro ao listar planos:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
            });
        }
    };

    /**
     * GET /api/planos/:id
     * Busca um plano específico por ID com todos os relacionamentos
     */
    getPlanoById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            const plano = await this.formService.getPlanoById(id);

            if (!plano) {
                res.status(404).json({
                    success: false,
                    error: 'Plano não encontrado',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: plano,
            });
        } catch (error) {
            console.error('Erro ao buscar plano:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
            });
        }
    };

    /**
     * GET /api/planos/stats
     * Gera estatísticas agregadas dos planos
     * Query params: municipio, formType, status
     */
    getStats = async (req: Request, res: Response): Promise<void> => {
        try {
            const filters: Partial<PlanoFilters> = {
                municipio: req.query.municipio as string,
                formType: req.query.formType as string,
                status: req.query.status as string,
            };

            const stats = await this.formService.getStats(filters);

            res.status(200).json({
                success: true,
                data: stats,
            });
        } catch (error) {
            console.error('Erro ao gerar estatísticas:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
            });
        }
    };

    /**
     * PUT /api/planos/:id
     * Atualiza um plano existente
     */
    updatePlano = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            console.log('🔄 [UPDATE] Recebendo atualização para plano:', id);
            console.log('📦 [UPDATE] Body recebido:', JSON.stringify(req.body, null, 2));

            const plano = await this.formService.updatePlano(id, req.body);

            console.log('✅ [UPDATE] Plano atualizado com sucesso:', plano.id);

            res.status(200).json({
                success: true,
                data: {
                    id: plano.id,
                    nomeProponente: plano.nomeProponente,
                    cnpj: plano.cnpj,
                    municipio: plano.municipio,
                    formType: plano.formType,
                    status: plano.status,
                    updatedAt: plano.updatedAt,
                },
                message: 'Plano atualizado com sucesso',
            });
        } catch (error) {
            // Plano não encontrado
            if (error instanceof Error && error.message === 'Plano não encontrado') {
                console.error('❌ [UPDATE] Plano não encontrado');
                res.status(404).json({
                    success: false,
                    error: 'Plano não encontrado',
                });
                return;
            }

            // Plano não pode ser editado (aprovado ou negado)
            if (error instanceof Error && error.message.includes('Não é possível editar')) {
                console.error('❌ [UPDATE] Status não permite edição:', error.message);
                res.status(403).json({
                    success: false,
                    error: error.message,
                });
                return;
            }

            // Erro de validação Zod
            if (error instanceof z.ZodError) {
                console.error('❌ [UPDATE] Erro de validação:', error.issues);
                res.status(400).json({
                    success: false,
                    error: 'Dados inválidos',
                    details: error.issues,
                });
                return;
            }

            // Outros erros
            console.error('❌ [UPDATE] Erro ao atualizar plano:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
            });
        }
    };

    /**
     * GET /api/forms/planos (compatibilidade legada)
     * @deprecated Use GET /api/planos
     */
    getAllPlanos = async (req: Request, res: Response): Promise<void> => {
        try {
            const planos = await this.formService.getAllPlanos();

            res.status(200).json({
                success: true,
                data: planos,
                count: planos.length,
            });
        } catch (error) {
            console.error('Erro ao listar planos:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
            });
        }
    };
}
