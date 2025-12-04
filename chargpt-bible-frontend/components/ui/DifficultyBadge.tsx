import type { DifficultyLevel } from '@/types/Prompt';

interface DifficultyBadgeProps {
  level: DifficultyLevel;
}

// WCAG AA compliant colors (4.5:1 contrast ratio minimum)
const difficultyConfig = {
  beginner: {
    label: 'Beginner',
    className: 'bg-green-50 text-green-900 border-green-400', // Improved contrast
  },
  intermediate: {
    label: 'Intermediate',
    className: 'bg-yellow-50 text-yellow-900 border-yellow-500', // Improved contrast
  },
  advanced: {
    label: 'Advanced',
    className: 'bg-red-50 text-red-900 border-red-500', // Improved contrast
  },
};

export default function DifficultyBadge({ level }: DifficultyBadgeProps) {
  const config = difficultyConfig[level];

  return (
    <span
      className={`
        inline-block px-3 py-1 text-xs font-semibold rounded-full border
        ${config.className}
      `}
    >
      {config.label}
    </span>
  );
}
