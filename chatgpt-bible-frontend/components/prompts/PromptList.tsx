import type { PromptCard as PromptCardType } from '@/types/Prompt';
import type { User } from '@/types/User';
import PromptCard from './PromptCard';
import { canAccessPrompt } from '@/lib/auth';

interface PromptListProps {
  prompts: PromptCardType[];
  hasActiveFilters?: boolean;
  user?: User | null;
}

export default function PromptList({
  prompts,
  hasActiveFilters = false,
  user = null,
}: PromptListProps) {
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
        <p className="max-w-md text-zinc-400">
          {hasActiveFilters
            ? 'Try adjusting your filters or search terms to see more results.'
            : 'Check back soon for new prompts!'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {prompts.map((prompt, index) => {
        const isLocked = !canAccessPrompt(user, index);
        return (
          <PromptCard
            key={prompt.id}
            prompt={prompt}
            isLocked={isLocked}
            isAuthenticated={!!user}
            promptIndex={index}
          />
        );
      })}
    </div>
  );
}
