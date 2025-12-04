import type { SWRConfiguration } from 'swr';
import type { GetPromptsFilters } from '@/lib/services/prompts';

/**
 * SWR Cache Configuration
 * 
 * Per Epic 2 requirements:
 * - 5-minute TTL (refreshInterval: 300000ms)
 * - Stale-while-revalidate pattern
 * - Deduplication for concurrent requests
 */
export const swrConfig: SWRConfiguration = {
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  dedupingInterval: 5000, // 5 seconds
  focusThrottleInterval: 60000, // 1 minute
  refreshInterval: 300000, // 5 minutes (per PRD)
  errorRetryCount: 3,
  errorRetryInterval: 5000,
  shouldRetryOnError: true,
};

/**
 * Generate cache key for prompts query
 * 
 * Creates unique cache key based on filter combination
 * Each filter combination has separate cache entry
 */
export function getPromptsCacheKey(filters: GetPromptsFilters): string {
  const keyParts = [
    'prompts',
    filters.page || 1,
    filters.limit || 20,
    filters.search || '',
    filters.difficulty || '',
    filters.categories?.sort().join(',') || '',
    filters.jobRoles?.sort().join(',') || '',
  ];
  
  return keyParts.join('-');
}

