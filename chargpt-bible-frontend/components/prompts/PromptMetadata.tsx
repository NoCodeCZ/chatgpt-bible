import type { Prompt } from '@/types/Prompt';
import DifficultyBadge from '@/components/ui/DifficultyBadge';

interface PromptMetadataProps {
  prompt: Prompt;
}

/**
 * Prompt Metadata Component
 *
 * Displays tags and badges for categories, job roles, and difficulty level.
 * Matches styling from PromptCard component (blue for categories, purple for job roles).
 *
 * Features:
 * - Category tags (blue badges)
 * - Job role tags (purple badges)
 * - Difficulty badge (color-coded by level)
 * - Responsive wrapping layout
 * - Consistent styling with list page
 */
export default function PromptMetadata({ prompt }: PromptMetadataProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {prompt.categories?.map((cat) => (
          <span
            key={cat.categories_id.id}
            className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
          >
            {cat.categories_id.name}
          </span>
        ))}
      </div>

      {/* Job Roles */}
      <div className="flex flex-wrap gap-2">
        {prompt.job_roles?.map((role) => (
          <span
            key={role.job_roles_id.id}
            className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full"
          >
            {role.job_roles_id.name}
          </span>
        ))}
      </div>

      {/* Difficulty Badge */}
      <DifficultyBadge level={prompt.difficulty_level} />
    </div>
  );
}
