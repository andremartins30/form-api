import { prisma } from '../db/prisma';

export class ItemRepository {
    async findByCategoryId(categoryId: number) {
        return prisma.item.findMany({
            where: {
                categoryId,
                active: true
            },
            orderBy: { order: 'asc' }
        });
    }

    async create(data: {
        categoryId: number;
        value: string;
        label: string;
        order?: number
    }) {
        return prisma.item.create({
            data
        });
    }

    async update(id: number, data: {
        label?: string;
        order?: number;
        active?: boolean
    }) {
        return prisma.item.update({
            where: { id },
            data
        });
    }

    async delete(id: number) {
        return prisma.item.delete({
            where: { id }
        });
    }

    async createMany(items: Array<{
        categoryId: number;
        value: string;
        label: string;
        order?: number
    }>) {
        return prisma.item.createMany({
            data: items
        });
    }
}
