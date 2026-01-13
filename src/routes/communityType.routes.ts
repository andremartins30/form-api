import { Router } from 'express';
import { CommunityTypeController } from '../controllers/communityType.controller';

const router = Router();
const controller = new CommunityTypeController();

router.get('/', controller.getAllCommunityTypes);
router.get('/:id', controller.getCommunityTypeById);
router.get('/value/:value', controller.getCommunityTypeByValue);

export default router;
