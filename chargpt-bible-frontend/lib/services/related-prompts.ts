import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import type { PromptCard } from '@/types/Prompt';

/**
 * Fetch related prompts for a given prompt.
 *
 * New behavior:
 * - Related prompts are prompts in the **same subcategory**
 * - Current prompt is always excluded
 * - We also fetch `prompt_type_id` so the UI can group related prompts
 *
 * @param currentPromptId - ID of the current prompt to exclude
 * @param subcategoryId - Subcategory ID the prompt belongs to
 */
export async function getRelatedPrompts(
  currentPromptId: number,
  subcategoryId: number | null
): Promise<PromptCard[]> {
  try {
    // If we don't know the subcategory, we can't compute meaningful related prompts
    if (!subcategoryId) {
      return [];
    }

    const filter: any = {
      status: { _eq: 'published' },
      id: { _neq: currentPromptId },
      subcategory_id: { _eq: subcategoryId },
    };

    // Simple query with basic fields + subcategory data for card display
    const relatedPrompts = await directus.request(
      readItems('prompts', {
        filter,
        limit: 3,
        fields: [
          'id',
          'title_th',
          'title_en',
          'description',
          'difficulty_level',
          'subcategory_id.id',
          'subcategory_id.name_th',
          'subcategory_id.name_en',
          'subcategory_id.category_id.id',
          'subcategory_id.category_id.name',
          'subcategory_id.category_id.name_en',
          'subcategory_id.category_id.name_th',
        ],
        sort: ['-id'],
      })
    );

    return relatedPrompts as unknown as PromptCard[];
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('Error fetching related prompts:', errorMsg);
    return [];
  }
}

