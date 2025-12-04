'use client';

import useSWR from 'swr';
import { getPrompts } from '@/lib/services/prompts';
import { getPromptsCacheKey, swrConfig } from '@/lib/utils/cache';
import type { GetPromptsFilters, GetPromptsResult } from '@/lib/services/prompts';

/**
 * SWR Hook for Prompts
 * 
 * Provides client-side caching and revalidation for prompts
 * Uses SSR data for initial render, then SWR for client-side updates
 */
export function usePrompts(filters: GetPromptsFilters = {}, fallbackData?: GetPromptsResult) {
  const cacheKey = getPromptsCacheKey(filters);

  const { data, error, isLoading, mutate } = useSWR<GetPromptsResult>(
    cacheKey,
    () => getPrompts(filters),
    {
      ...swrConfig,
      fallbackData, // Use SSR data as initial value
    }
  );

  return {
    prompts: data?.data || [],
    total: data?.total || 0,
    totalPages: data?.totalPages || 0,
    isLoading,
    isError: !!error,
    error,
    refresh: mutate,
  };
}

