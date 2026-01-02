'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category } from '@/types/Category';
import type { JobRole } from '@/types/JobRole';
import type { PromptType } from '@/types/Prompt';

interface PromptFiltersProps {
  categories: Category[];
  jobRoles: JobRole[];
  promptTypes?: PromptType[];
}

export default function PromptFilters({ categories, jobRoles, promptTypes }: PromptFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get current filter values from URL
  const currentCategories = searchParams.get('categories')?.split(',') || [];
  const currentJobRoles = searchParams.get('jobRoles')?.split(',') || [];
  const currentDifficulty = searchParams.get('difficulty') || '';
  const currentPromptType = searchParams.get('promptType') || '';

  const [selectedCategories, setSelectedCategories] = useState<string[]>(currentCategories);
  const [selectedJobRoles, setSelectedJobRoles] = useState<string[]>(currentJobRoles);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>(currentDifficulty);
  const [selectedPromptType, setSelectedPromptType] = useState<string>(currentPromptType);

  const updateFilters = (
    newCategories: string[],
    newJobRoles: string[],
    newDifficulty: string,
    newPromptType: string
  ) => {
    const params = new URLSearchParams(searchParams);

    // Update category filter
    if (newCategories.length > 0) {
      params.set('categories', newCategories.join(','));
    } else {
      params.delete('categories');
    }

    // Update job role filter
    if (newJobRoles.length > 0) {
      params.set('jobRoles', newJobRoles.join(','));
    } else {
      params.delete('jobRoles');
    }

    // Update difficulty filter
    if (newDifficulty) {
      params.set('difficulty', newDifficulty);
    } else {
      params.delete('difficulty');
    }

    // Update prompt type filter
    if (newPromptType) {
      params.set('promptType', newPromptType);
    } else {
      params.delete('promptType');
    }

    // Reset to page 1 when filters change
    params.delete('page');

    router.push(`/prompts?${params.toString()}`);
  };

  const handleCategoryToggle = (slug: string) => {
    const newCategories = selectedCategories.includes(slug)
      ? selectedCategories.filter((c) => c !== slug)
      : [...selectedCategories, slug];

    setSelectedCategories(newCategories);
    updateFilters(newCategories, selectedJobRoles, selectedDifficulty, selectedPromptType);
  };

  const handleJobRoleToggle = (slug: string) => {
    const newJobRoles = selectedJobRoles.includes(slug)
      ? selectedJobRoles.filter((r) => r !== slug)
      : [...selectedJobRoles, slug];

    setSelectedJobRoles(newJobRoles);
    updateFilters(selectedCategories, newJobRoles, selectedDifficulty, selectedPromptType);
  };

  const handleDifficultyChange = (difficulty: string) => {
    const newDifficulty = selectedDifficulty === difficulty ? '' : difficulty;
    setSelectedDifficulty(newDifficulty);
    updateFilters(selectedCategories, selectedJobRoles, newDifficulty, selectedPromptType);
  };

  // Prompt type handler
  const handlePromptTypeChange = (promptTypeSlug: string) => {
    const newPromptType = selectedPromptType === promptTypeSlug ? '' : promptTypeSlug;
    setSelectedPromptType(newPromptType);
    updateFilters(selectedCategories, selectedJobRoles, selectedDifficulty, newPromptType);
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedJobRoles([]);
    setSelectedDifficulty('');
    setSelectedPromptType('');
    const params = new URLSearchParams(searchParams);
    params.delete('categories');
    params.delete('jobRoles');
    params.delete('difficulty');
    params.delete('promptType');
    params.delete('page');
    router.push(`/prompts?${params.toString()}`);
  };

  const activeFilterCount = selectedCategories.length + selectedJobRoles.length +
    (selectedDifficulty ? 1 : 0) + (selectedPromptType ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Categories Filter */}
      <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white tracking-wide">Categories</h3>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        <div className="space-y-3 max-h-64 overflow-y-auto hide-scrollbar">
          {categories.length === 0 ? (
            <p className="text-sm text-zinc-500">No categories available</p>
          ) : (
            categories.map((category) => {
              const isSelected = selectedCategories.includes(category.slug);
              return (
                <label
                  key={category.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`relative flex items-center justify-center w-5 h-5 rounded border transition-colors
                    ${isSelected 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'border-zinc-700 bg-zinc-800/50 group-hover:border-purple-500/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCategoryToggle(category.slug)}
                      className="peer appearance-none w-full h-full rounded cursor-pointer outline-none"
                    />
                    <svg 
                      className={`w-3.5 h-3.5 text-white absolute transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`text-sm transition-colors ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    {category.name_en || category.name}
                  </span>
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* Job Roles Filter */}
      <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">Job Roles</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto hide-scrollbar">
          {jobRoles.length === 0 ? (
            <p className="text-sm text-zinc-500">No job roles available</p>
          ) : (
            jobRoles.map((role) => {
              const isSelected = selectedJobRoles.includes(role.slug);
              return (
                <label
                  key={role.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`relative flex items-center justify-center w-5 h-5 rounded border transition-colors
                    ${isSelected 
                      ? 'border-purple-500 bg-purple-500/20' 
                      : 'border-zinc-700 bg-zinc-800/50 group-hover:border-purple-500/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleJobRoleToggle(role.slug)}
                      className="peer appearance-none w-full h-full rounded cursor-pointer outline-none"
                    />
                    <svg 
                      className={`w-3.5 h-3.5 text-white absolute transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className={`text-sm transition-colors ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-200'}`}>
                    {role.name}
                  </span>
                </label>
              );
            })
          )}
        </div>
      </div>

      {/* Difficulty Filter */}
      <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
        <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">Difficulty</h3>
        <div className="space-y-3">
          {(['beginner', 'intermediate', 'advanced'] as const).map((difficulty) => {
            const isSelected = selectedDifficulty === difficulty;
            const difficultyConfig = {
              beginner: { label: 'Beginner', color: 'green' },
              intermediate: { label: 'Intermediate', color: 'yellow' },
              advanced: { label: 'Advanced', color: 'red' },
            }[difficulty];

            return (
              <label
                key={difficulty}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                  ${isSelected 
                    ? `border-${difficultyConfig.color}-500` 
                    : `border-zinc-700 group-hover:border-${difficultyConfig.color}-500/50`
                  }`}
                >
                  <input
                    type="radio"
                    name="difficulty"
                    checked={isSelected}
                    onChange={() => handleDifficultyChange(difficulty)}
                    className="appearance-none w-full h-full cursor-pointer outline-none"
                  />
                  <div className={`w-2 h-2 rounded-full
                    ${difficulty === 'beginner' ? 'bg-green-500' : ''}
                    ${difficulty === 'intermediate' ? 'bg-yellow-500' : ''}
                    ${difficulty === 'advanced' ? 'bg-red-500' : ''}
                  `} />
                </div>
                <span className={`text-sm transition-colors ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                  {difficultyConfig.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Prompt Type Filter */}
      {promptTypes && promptTypes.length > 0 && (
        <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-5 backdrop-blur-sm">
          <h3 className="text-sm font-semibold text-white mb-4 tracking-wide">Prompt Method</h3>
          <div className="space-y-3">
            {promptTypes.map((promptType) => {
              const isSelected = selectedPromptType === promptType.slug;

              // Get icon and label config
              const getPromptTypeConfig = () => {
                switch (promptType.slug) {
                  case 'fill-in-blank':
                    return { icon: '📝', label: promptType.name_en || 'Template', color: 'blue' };
                  case 'open-ended':
                    return { icon: '💡', label: promptType.name_en || 'Brainstorm', color: 'yellow' };
                  case 'question-based':
                    return { icon: '❓', label: promptType.name_en || 'Questions', color: 'purple' };
                  case 'educational':
                    return { icon: '📚', label: promptType.name_en || 'Learn', color: 'green' };
                  default:
                    return { icon: '📄', label: promptType.name_en || 'Prompt', color: 'zinc' };
                }
              };

              const config = getPromptTypeConfig();

              return (
                <label
                  key={promptType.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors
                    ${isSelected
                      ? `border-${config.color}-500`
                      : `border-zinc-700 group-hover:border-${config.color}-500/50`
                    }`}
                  >
                    <input
                      type="radio"
                      name="promptType"
                      checked={isSelected}
                      onChange={() => handlePromptTypeChange(promptType.slug)}
                      className="appearance-none w-full h-full cursor-pointer outline-none"
                    />
                    <div className={`w-2 h-2 rounded-full
                      ${isSelected ? `bg-${config.color}-500` : ''
                    }`} />
                  </div>
                  <span className="text-base leading-none mr-1">{config.icon}</span>
                  <span className={`text-sm transition-colors ${isSelected ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                    {config.label}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

