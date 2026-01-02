import PromptListItem from './PromptListItem';
import { canAccessPrompt } from '@/lib/auth';
import type { PromptCard as PromptCardType } from '@/types/Prompt';
import type { User } from '@/types/User';

interface PromptListExpandedProps {
  prompts: PromptCardType[];
  user?: User | null;
}

/**
 * PromptListExpanded Component
 *
 * Displays prompts in a fully expanded list format with one-click copy buttons.
 * Used on the subcategory page for maximum visibility and quick access.
 */
export default function PromptListExpanded({
  prompts,
  user = null,
}: PromptListExpandedProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-800">
          <svg
            className="h-8 w-8 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <h2 className="mb-3 text-2xl font-semibold text-white">
          No prompts found
        </h2>
        <p className="max-w-md text-zinc-500">
          Check back soon for new prompts in this subcategory!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      {prompts.map((prompt, index) => {
        const isLocked = !canAccessPrompt(user, index);
        return (
          <PromptListItem
            key={prompt.id}
            prompt={prompt as any} // Type cast to include prompt_text
            isLocked={isLocked}
          />
        );
      })}
    </div>
  );
}
