import { Request, Response } from 'express';
import { CategoryService } from '../services/category.service';

export class CategoryController {
    private service = new CategoryService();

    async getAll(req: Request, res: Response) {
        try {
            const categories = await this.service.getAllCategories();
            res.json(categories);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch categories' });
        }
    }

    async getForForm(req: Request, res: Response) {
        try {
            const formData = await this.service.getCategoriesForForm();
            res.json(formData);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch form data' });
        }
    }

    async getItems(req: Request, res: Response) {
        try {
            const { categoryValue } = req.params;
            const categoryValueStr = Array.isArray(categoryValue) ? categoryValue[0] : categoryValue;
            const items = await this.service.getItemsByCategory(categoryValueStr);
            res.json(items);
        } catch (error) {
            res.status(404).json({ error: 'Category not found' });
        }
    }
}
