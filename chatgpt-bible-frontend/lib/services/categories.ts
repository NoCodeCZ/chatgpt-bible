import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import type { Category } from '@/types/Category';
import { unstable_cache } from 'next/cache';

/**
 * Fetch all categories from Directus with server-side caching
 * Used for filter sidebar
 * 
 * Cache TTL: 1 hour (categories rarely change)
 * Tags: ['categories'] for on-demand revalidation
 */
export async function getCategories(): Promise<Category[]> {
  return unstable_cache(
    async () => {
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
    },
    ['categories'],
    {
      revalidate: 3600, // 1 hour
      tags: ['categories'],
    }
  )();
}

