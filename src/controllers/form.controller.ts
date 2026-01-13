import { Request, Response } from 'express';
import { FormService } from '../services/form.service';
import { z } from 'zod';

export class FormController {
    private formService: FormService;

    constructor() {
        this.formService = new FormService();
    }

    /**
     * POST /api/forms/submissions
     * Cria uma nova submissão de formulário
     */
    createSubmission = async (req: Request, res: Response): Promise<void> => {
        try {
            const submission = await this.formService.createSubmission(req.body);

            res.status(201).json({
                success: true,
                data: submission,
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
            console.error('Erro ao criar submissão:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
            });
        }
    };

    /**
     * GET /api/forms/submissions
     * Lista todas as submissões
     */
    getAllSubmissions = async (req: Request, res: Response): Promise<void> => {
        try {
            const submissions = await this.formService.getAllSubmissions();

            res.status(200).json({
                success: true,
                data: submissions,
                count: submissions.length,
            });
        } catch (error) {
            console.error('Erro ao listar submissões:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
            });
        }
    };

    /**
     * GET /api/forms/submissions/:id
     * Busca uma submissão específica por ID
     */
    getSubmissionById = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = String(req.params.id);
            const submission = await this.formService.getSubmissionById(id);

            if (!submission) {
                res.status(404).json({
                    success: false,
                    error: 'Submissão não encontrada',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: submission,
            });
        } catch (error) {
            console.error('Erro ao buscar submissão:', error);
            res.status(500).json({
                success: false,
                error: 'Erro interno do servidor',
            });
        }
    };
}
