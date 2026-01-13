import { z } from 'zod';
import { FormRepository } from '../repositories/form.repository';
import { FormSubmission } from '@prisma/client';

// Schema de validação Zod para submissão de formulário
export const createSubmissionSchema = z.object({
    formVersion: z.string().min(1, 'formVersion é obrigatório'),
    answers: z.record(z.string(), z.any()).or(z.any()), // Aceita qualquer objeto JSON
});

export type CreateSubmissionInput = z.infer<typeof createSubmissionSchema>;

export class FormService {
    private formRepository: FormRepository;

    constructor() {
        this.formRepository = new FormRepository();
    }

    /**
     * Valida e cria uma nova submissão de formulário
     */
    async createSubmission(input: CreateSubmissionInput): Promise<FormSubmission> {
        // Validação com Zod
        const validatedData = createSubmissionSchema.parse(input);

        // Persistir no banco
        const submission = await this.formRepository.create({
            formVersion: validatedData.formVersion,
            payload: validatedData.answers,
        });

        return submission;
    }

    /**
     * Lista todas as submissões
     */
    async getAllSubmissions(): Promise<FormSubmission[]> {
        return await this.formRepository.findAll();
    }

    /**
     * Busca uma submissão específica por ID
     */
    async getSubmissionById(id: string): Promise<FormSubmission | null> {
        return await this.formRepository.findById(id);
    }
}
