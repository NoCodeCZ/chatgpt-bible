import { directus } from '@/lib/directus';
import { readItems, readItem, aggregate } from '@directus/sdk';
import type { Subcategory } from '@/types/Prompt';

export interface SubcategoryWithCount extends Subcategory {
  prompt_count?: number;
  category?: {
    id: string;
    name: string;
    name_en?: string;
    name_th?: string;
    slug: string;
  };
}

/**
 * Fetch all subcategories with their parent category info
 */
export async function getSubcategories(): Promise<SubcategoryWithCount[]> {
  try {
    const subcategories = await directus.request(
      readItems('subcategories', {
        fields: [
          'id',
          'name_th',
          'name_en',
          'slug',
          'description_th',
          'description_en',
          'sort',
          'category_id.id',
          'category_id.name',
          'category_id.name_en',
          'category_id.name_th',
          'category_id.slug',
        ],
        sort: ['sort', 'name_th'],
      })
    );

    // Get prompt counts for each subcategory
    const subcategoriesWithCounts = await Promise.all(
      (subcategories as any[]).map(async (sub) => {
        try {
          const countResult = await directus.request(
            aggregate('prompts', {
              aggregate: { count: '*' },
              query: {
                filter: {
                  subcategory_id: { _eq: sub.id },
                  status: { _eq: 'published' },
                },
              },
            })
          );
          const count = Number(countResult[0]?.count) || 0;
          return {
            ...sub,
            prompt_count: count,
            category: sub.category_id,
          };
        } catch {
          return {
            ...sub,
            prompt_count: 0,
            category: sub.category_id,
          };
        }
      })
    );

    // Filter out subcategories with no prompts
    return subcategoriesWithCounts.filter((sub) => sub.prompt_count > 0);
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    return [];
  }
}

/**
 * Fetch a single subcategory by ID
 */
export async function getSubcategoryById(id: string): Promise<SubcategoryWithCount | null> {
  try {
    const subcategory = await directus.request(
      readItem('subcategories', id, {
        fields: [
          'id',
          'name_th',
          'name_en',
          'slug',
          'description_th',
          'description_en',
          'sort',
          'category_id.id',
          'category_id.name',
          'category_id.name_en',
          'category_id.name_th',
          'category_id.slug',
        ],
      })
    );

    // Get prompt count
    const countResult = await directus.request(
      aggregate('prompts', {
        aggregate: { count: '*' },
        query: {
          filter: {
            subcategory_id: { _eq: id },
            status: { _eq: 'published' },
          },
        },
      })
    );

    return {
      ...(subcategory as any),
      prompt_count: Number(countResult[0]?.count) || 0,
      category: (subcategory as any).category_id,
    };
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    return null;
  }
}

/**
 * Get subcategories filtered by category
 */
export async function getSubcategoriesByCategory(categorySlug: string): Promise<SubcategoryWithCount[]> {
  try {
    // First get the category ID from slug
    const categories = await directus.request(
      readItems('categories', {
        filter: { slug: { _eq: categorySlug } },
        fields: ['id'],
        limit: 1,
      })
    );

    if (!categories || categories.length === 0) {
      return [];
    }

    const categoryId = (categories[0] as any).id;

    const subcategories = await directus.request(
      readItems('subcategories', {
        filter: { category_id: { _eq: categoryId } },
        fields: [
          'id',
          'name_th',
          'name_en',
          'slug',
          'description_th',
          'description_en',
          'sort',
          'category_id.id',
          'category_id.name',
          'category_id.name_en',
          'category_id.name_th',
          'category_id.slug',
        ],
        sort: ['sort', 'name_th'],
      })
    );

    // Get prompt counts
    const subcategoriesWithCounts = await Promise.all(
      (subcategories as any[]).map(async (sub) => {
        try {
          const countResult = await directus.request(
            aggregate('prompts', {
              aggregate: { count: '*' },
              query: {
                filter: {
                  subcategory_id: { _eq: sub.id },
                  status: { _eq: 'published' },
                },
              },
            })
          );
          return {
            ...sub,
            prompt_count: Number(countResult[0]?.count) || 0,
            category: sub.category_id,
          };
        } catch {
          return {
            ...sub,
            prompt_count: 0,
            category: sub.category_id,
          };
        }
      })
    );

    return subcategoriesWithCounts.filter((sub) => sub.prompt_count > 0);
  } catch (error) {
    console.error('Error fetching subcategories by category:', error);
    return [];
  }
}

