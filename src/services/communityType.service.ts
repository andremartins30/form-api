import { CommunityTypeRepository } from '../repositories/communityType.repository';

export class CommunityTypeService {
    private repository: CommunityTypeRepository;

    constructor() {
        this.repository = new CommunityTypeRepository();
    }

    async getAllCommunityTypes() {
        const communityTypes = await this.repository.findAll();
        
        return communityTypes.map(ct => ({
            value: ct.value,
            label: ct.label,
            order: ct.order
        }));
    }

    async getCommunityTypeById(id: number) {
        return await this.repository.findById(id);
    }

    async getCommunityTypeByValue(value: string) {
        return await this.repository.findByValue(value);
    }
}
