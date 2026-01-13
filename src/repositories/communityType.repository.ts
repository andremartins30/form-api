import { prisma } from '../db/prisma';

export class CommunityTypeRepository {
    async findAll() {
        return await prisma.communityType.findMany({
            where: { active: true },
            orderBy: { order: 'asc' }
        });
    }

    async findById(id: number) {
        return await prisma.communityType.findUnique({
            where: { id }
        });
    }

    async findByValue(value: string) {
        return await prisma.communityType.findUnique({
            where: { value }
        });
    }
}
