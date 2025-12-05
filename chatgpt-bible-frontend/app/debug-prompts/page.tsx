/**
 * Debug Page - Prompt Data Structure
 * 
 * Use this page to inspect the actual data structure returned from Directus
 * Access: http://localhost:3000/debug-prompts
 */

import { getPrompts } from '@/lib/services/prompts';

export default async function DebugPromptsPage() {
  try {
    const result = await getPrompts({ page: 1, limit: 3 });
    const firstPrompt = result.data[0];

    return (
      <main className="min-h-screen p-8 max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Prompt Data Structure Debug</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">First Prompt Data:</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(firstPrompt, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Subcategory Structure:</h2>
            <pre className="bg-blue-50 p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(firstPrompt?.subcategory_id, null, 2)}
            </pre>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">Categories Structure:</h2>
            <pre className="bg-green-50 p-4 rounded-lg overflow-auto text-xs">
              {JSON.stringify(firstPrompt?.categories, null, 2)}
            </pre>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
            <h3 className="font-semibold mb-2">Type Check:</h3>
            <ul className="text-sm space-y-1">
              <li>subcategory_id type: {typeof firstPrompt?.subcategory_id}</li>
              <li>Is object: {firstPrompt?.subcategory_id && typeof firstPrompt.subcategory_id === 'object' ? 'Yes' : 'No'}</li>
              <li>Has name_en: {firstPrompt?.subcategory_id && typeof firstPrompt.subcategory_id === 'object' ? (firstPrompt.subcategory_id as any)?.name_en ? 'Yes' : 'No' : 'N/A'}</li>
              <li>Has name_th: {firstPrompt?.subcategory_id && typeof firstPrompt.subcategory_id === 'object' ? (firstPrompt.subcategory_id as any)?.name_th ? 'Yes' : 'No' : 'N/A'}</li>
            </ul>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    return (
      <main className="min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6 text-red-600">Error</h1>
        <pre className="bg-red-50 p-4 rounded-lg">
          {error instanceof Error ? error.message : String(error)}
        </pre>
      </main>
    );
  }
}

