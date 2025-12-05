import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import type { Category } from '@/types/Category';

/**
 * Fetch all categories from Directus
 * Used for filter sidebar
 */
export async function getCategories(): Promise<Category[]> {
  try {
    const categories = await directus.request(
      readItems('categories', {
        fields: ['id', 'name', 'slug', 'description', 'sort', 'name_th', 'name_en'],
        sort: ['sort', 'name'],
      })
    );

    return categories as unknown as Category[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

