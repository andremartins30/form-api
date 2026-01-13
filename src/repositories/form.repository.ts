import { prisma } from '../db/prisma';
import { FormSubmission } from '@prisma/client';

export class FormRepository {
    /**
     * Cria uma nova submissão de formulário
     */
    async create(data: {
        formVersion: string;
        payload: any;
    }): Promise<FormSubmission> {
        return await prisma.formSubmission.create({
            data: {
                formVersion: data.formVersion,
                payload: data.payload,
            },
        });
    }

    /**
     * Lista todas as submissões ordenadas por data de criação (mais recentes primeiro)
     */
    async findAll(): Promise<FormSubmission[]> {
        return await prisma.formSubmission.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    /**
     * Busca uma submissão por ID
     */
    async findById(id: string): Promise<FormSubmission | null> {
        return await prisma.formSubmission.findUnique({
            where: { id },
        });
    }
}
