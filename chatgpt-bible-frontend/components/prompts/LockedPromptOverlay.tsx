'use client';

import Link from 'next/link';

interface LockedPromptOverlayProps {
  isAuthenticated: boolean;
}

/**
 * LockedPromptOverlay - Shows lock overlay and upgrade CTA for locked prompts
 * 
 * Used on prompt cards that are beyond the free limit for free/unauthenticated users
 */
export default function LockedPromptOverlay({ isAuthenticated }: LockedPromptOverlayProps) {
  return (
    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-6 z-10 border border-purple-500/30">
      {/* Lock Icon */}
      <div className="mb-4 p-3 bg-purple-500/20 rounded-full">
        <svg
          className="w-8 h-8 text-purple-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>

      {/* Message */}
      <h4 className="text-lg font-semibold text-white mb-2 text-center">
        {isAuthenticated ? 'Upgrade to Unlock' : 'Sign Up to Unlock'}
      </h4>
      <p className="text-sm text-zinc-400 text-center mb-6 max-w-xs">
        {isAuthenticated
          ? 'Upgrade to paid to access all prompts in the library'
          : 'Create a free account to access your first 3 prompts'}
      </p>

      {/* CTA Button */}
      <Link
        href={isAuthenticated ? '/upgrade' : '/signup'}
        className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
        onClick={(e) => {
          // Prevent card click navigation
          e.stopPropagation();
        }}
      >
        {isAuthenticated ? 'Upgrade to Paid' : 'Sign Up Free'}
      </Link>
    </div>
  );
}

