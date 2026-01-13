import { prisma } from '../db/prisma';

export class CategoryRepository {
    async findAll() {
        return prisma.category.findMany({
            where: { active: true },
            include: {
                items: {
                    where: { active: true },
                    orderBy: { order: 'asc' }
                }
            },
            orderBy: { order: 'asc' }
        });
    }

    async findByValue(value: string) {
        return prisma.category.findUnique({
            where: { value },
            include: {
                items: {
                    where: { active: true },
                    orderBy: { order: 'asc' }
                }
            }
        });
    }

    async create(data: { value: string; label: string; order?: number }) {
        return prisma.category.create({
            data
        });
    }

    async update(id: number, data: { label?: string; order?: number; active?: boolean }) {
        return prisma.category.update({
            where: { id },
            data
        });
    }

    async delete(id: number) {
        return prisma.category.delete({
            where: { id }
        });
    }
}
