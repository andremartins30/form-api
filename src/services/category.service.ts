import { CategoryRepository } from '../repositories/category.repository';
import { ItemRepository } from '../repositories/item.repository';

export class CategoryService {
    private categoryRepo = new CategoryRepository();
    private itemRepo = new ItemRepository();

    async getAllCategories() {
        return this.categoryRepo.findAll();
    }

    async getCategoryByValue(value: string) {
        return this.categoryRepo.findByValue(value);
    }

    async getItemsByCategory(categoryValue: string) {
        const category = await this.categoryRepo.findByValue(categoryValue);
        if (!category) {
            throw new Error('Category not found');
        }
        return category.items;
    }

    // Formata para o frontend (compatível com o formato atual)
    async getCategoriesForForm() {
        const categories = await this.categoryRepo.findAll();

        const categoryOptions = categories.map(cat => ({
            value: cat.value,
            label: cat.label,
            formType: cat.formType
        }));

        const itemsMap: Record<string, Array<{ value: string; label: string }>> = {};

        categories.forEach(cat => {
            itemsMap[cat.value] = cat.items.map(item => ({
                value: item.value,
                label: item.label
            }));
        });

        return {
            categoryOptions,
            itemsMap
        };
    }
}
