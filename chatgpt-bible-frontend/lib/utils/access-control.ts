/**
 * Access control utilities for freemium model
 * 
 * Determines which prompts free users can access (first 3)
 * and handles access control logic.
 */

import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';

const FREE_PROMPT_LIMIT = parseInt(
  process.env.NEXT_PUBLIC_FREE_PROMPT_LIMIT || '3',
  10
);

/**
 * Get the index of a prompt in the ordered list
 * Prompts are ordered by ID (newest first based on current implementation)
 * 
 * @param promptId - The prompt ID to find
 * @returns The 0-based index of the prompt, or -1 if not found
 */
export async function getPromptIndex(promptId: string | number): Promise<number> {
  try {
    // Get all published prompts ordered by ID (descending, newest first)
    // This matches the ordering used in the prompt list
    const prompts = await directus.request(
      readItems('prompts', {
        filter: { status: { _eq: 'published' } },
        fields: ['id'],
        sort: ['-id'], // Descending order (newest first)
        limit: -1, // Get all prompts
      })
    );

    // Find the index of the current prompt
    const index = prompts.findIndex(
      (p: any) => String(p.id) === String(promptId)
    );

    if (index === -1) {
      console.warn(`Prompt ${promptId} not found in published prompts list`);
    }

    return index;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error getting prompt index:', {
      promptId,
      error: errorMessage,
    });
    // On error, assume prompt is not in free tier (conservative approach)
    return -1;
  }
}

/**
 * Check if a prompt is within the free tier limit
 * 
 * @param promptId - The prompt ID to check
 * @returns true if prompt is within free limit (first 3), false otherwise
 */
export async function isPromptInFreeTier(
  promptId: string | number
): Promise<boolean> {
  const index = await getPromptIndex(promptId);
  
  // If prompt not found, it's not in free tier
  if (index === -1) {
    return false;
  }

  // Check if index is within free limit (0, 1, 2 = first 3)
  return index < FREE_PROMPT_LIMIT;
}

/**
 * Check if user can access a specific prompt
 * 
 * @param user - User object (null for unauthenticated)
 * @param promptId - The prompt ID to check
 * @returns true if user can access the prompt
 */
export async function canAccessPrompt(
  user: { subscription_status: 'free' | 'paid' } | null,
  promptId: string | number
): Promise<boolean> {
  // Paid users can access everything
  if (user && user.subscription_status === 'paid') {
    return true;
  }

  // Free users and unauthenticated: only first 3 prompts
  return await isPromptInFreeTier(promptId);
}

