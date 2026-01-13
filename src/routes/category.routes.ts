import { Router } from 'express';
import { CategoryController } from '../controllers/category.controller';

const router = Router();
const controller = new CategoryController();

router.get('/categories', (req, res) => controller.getAll(req, res));
router.get('/categories/form-data', (req, res) => controller.getForForm(req, res));
router.get('/categories/:categoryValue/items', (req, res) => controller.getItems(req, res));

export default router;
