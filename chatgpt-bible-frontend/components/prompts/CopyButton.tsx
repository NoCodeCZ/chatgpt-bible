'use client';

import { useState } from 'react';
import Toast from './Toast';

interface CopyButtonProps {
  text: string;
  /**
   * Optional size variant for different layouts.
   * - "md" (default): larger CTA-style button
   * - "sm": compact pill-style button for header toolbars
   */
  size?: 'sm' | 'md';
}

/**
 * Copy to Clipboard Button Component
 *
 * Client component that provides copy-to-clipboard functionality using the Web Clipboard API.
 * Shows a toast notification on successful copy.
 *
 * Features:
 * - Uses navigator.clipboard.writeText() for modern browsers
 * - Visual feedback via toast notification (3s duration)
 * - Keyboard accessible (Enter/Space triggers copy)
 * - Full-width on mobile, auto-width on desktop
 * - Touch-friendly button size (min 48px height)
 */
export default function CopyButton({ text, size = 'md' }: CopyButtonProps) {
  const [showToast, setShowToast] = useState(false);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('Failed to copy:', error);
      // Optionally show error toast in future
    }
  };

  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black';

  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/20'
      : 'w-full md:w-auto px-8 py-4 text-lg bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-900/30';

  return (
    <>
      <button
        onClick={handleCopy}
        className={`${baseClasses} ${sizeClasses} text-white`}
        aria-label="Copy prompt text to clipboard"
      >
        {/* Simple copy icon */}
        <span className="mr-1.5 text-xs">⧉</span>
        <span>Copy</span>
      </button>

      {showToast && <Toast message="Copied!" />}
    </>
  );
}
