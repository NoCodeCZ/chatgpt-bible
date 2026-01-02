'use client';

import type { PromptType } from '@/types/Prompt';

interface PromptMethodBadgeProps {
  promptType: PromptType | null;
  size?: 'sm' | 'md';
}

/**
 * Renders a visual badge showing the prompt method type
 * Maps prompt types to their corresponding icons and colors
 */
export default function PromptMethodBadge({
  promptType,
  size = 'sm'
}: PromptMethodBadgeProps) {
  if (!promptType) return null;

  const getBadgeConfig = () => {
    const slug = promptType.slug;

    // Fill-in-the-Blank (The Recipe) - Quick templates
    if (slug === 'fill-in-blank') {
      return {
        icon: '📝',
        label: 'Template',
        color: 'blue',
        bgClass: 'bg-blue-500/10 border-blue-500/20 text-blue-300',
      };
    }

    // Open-Ended (Brainstorming Partner)
    if (slug === 'open-ended') {
      return {
        icon: '💡',
        label: 'Brainstorm',
        color: 'yellow',
        bgClass: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300',
      };
    }

    // Question-Based
    if (slug === 'question-based') {
      return {
        icon: '❓',
        label: 'Questions',
        color: 'purple',
        bgClass: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
      };
    }

    // Educational (Strategic Playbook)
    if (slug === 'educational') {
      return {
        icon: '📚',
        label: 'Learn',
        color: 'green',
        bgClass: 'bg-green-500/10 border-green-500/20 text-green-300',
      };
    }

    // Default fallback
    return {
      icon: '📄',
      label: 'Prompt',
      color: 'zinc',
      bgClass: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-300',
    };
  };

  const config = getBadgeConfig();
  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-[10px]'
    : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${sizeClasses} ${config.bgClass}`}
      title={`Method: ${config.label}`}
    >
      <span className="text-base leading-none">{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}
