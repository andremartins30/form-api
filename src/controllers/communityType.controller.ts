import { Request, Response } from 'express';
import { CommunityTypeService } from '../services/communityType.service';

export class CommunityTypeController {
    private service: CommunityTypeService;

    constructor() {
        this.service = new CommunityTypeService();
    }

    getAllCommunityTypes = async (req: Request, res: Response) => {
        try {
            const communityTypes = await this.service.getAllCommunityTypes();
            res.json(communityTypes);
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro ao buscar tipos de comunidades',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    };

    getCommunityTypeById = async (req: Request, res: Response) => {
        try {
            const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
            const communityType = await this.service.getCommunityTypeById(id);
            
            if (!communityType) {
                return res.status(404).json({ error: 'Tipo de comunidade não encontrado' });
            }
            
            res.json(communityType);
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro ao buscar tipo de comunidade',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    };

    getCommunityTypeByValue = async (req: Request, res: Response) => {
        try {
            const value = Array.isArray(req.params.value) ? req.params.value[0] : req.params.value;
            const communityType = await this.service.getCommunityTypeByValue(value);
            
            if (!communityType) {
                return res.status(404).json({ error: 'Tipo de comunidade não encontrado' });
            }
            
            res.json(communityType);
        } catch (error) {
            res.status(500).json({ 
                error: 'Erro ao buscar tipo de comunidade',
                message: error instanceof Error ? error.message : 'Erro desconhecido'
            });
        }
    };
}