/**
 * INTEGRATION TEST PAGE - DO NOT DELETE
 *
 * This page serves as a permanent integration test for Directus API connectivity.
 * It validates that:
 * - Directus SDK is properly configured
 * - Environment variables are set correctly
 * - TypeScript types match actual API responses
 * - Error handling works for network failures
 *
 * Keep this page for regression testing when:
 * - Directus schema changes
 * - SDK version updates
 * - Environment configuration changes
 *
 * Access: http://localhost:3000/test-directus
 */

import { directus } from '@/lib/directus';
import { readItems } from '@directus/sdk';
import type { Prompt } from '@/types/Prompt';

async function fetchPrompts() {
  try {
    const prompts = await directus.request<Prompt[]>(
      readItems('prompts', {
        filter: {
          status: { _eq: 'published' },
        },
        limit: 10,
        fields: ['id', 'title_th', 'title_en', 'description', 'difficulty_level'],
      })
    );
    return { prompts, error: null };
  } catch (error) {
    return {
      prompts: null,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export default async function TestDirectusPage() {
  const { prompts, error } = await fetchPrompts();

  if (error) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Connection Failed</h1>
        <p className="text-gray-700">Error: {error}</p>
        <p className="text-sm text-gray-500 mt-4">Check NEXT_PUBLIC_DIRECTUS_URL and Directus instance status.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Directus Connection Test</h1>

      {!prompts || prompts.length === 0 ? (
        <p className="text-gray-600">No published prompts found in Directus.</p>
      ) : (
        <div className="space-y-4">
          <p className="text-green-600 font-semibold">
            ✅ Successfully connected! Found {prompts.length} prompts:
          </p>
          <ul className="space-y-3">
            {prompts.map((prompt) => (
              <li key={prompt.id} className="border p-4 rounded">
                <h2 className="font-bold text-lg">
                  {prompt.title_en || prompt.title_th || 'Untitled'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">{prompt.description}</p>
                <span className="text-xs text-gray-500 mt-2 inline-block">
                  Difficulty: {prompt.difficulty_level}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
