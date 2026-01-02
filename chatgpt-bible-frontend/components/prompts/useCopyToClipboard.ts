'use client';

import { useState, useCallback } from 'react';

interface UseCopyToClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  isCopied: boolean;
  reset: () => void;
}

/**
 * Custom hook for copy-to-clipboard functionality with feedback
 *
 * @returns Object with copy function, copied state, and reset function
 *
 * Usage:
 * const { copy, isCopied, reset } = useCopyToClipboard();
 * await copy('Text to copy');
 * // isCopied will be true for 2 seconds, then auto-reset
 */
export function useCopyToClipboard(): UseCopyToClipboardReturn {
  const [isCopied, setIsCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!text) return false;

    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);

      // Auto-reset after 2 seconds
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);

      return true;
    } catch (error) {
      console.error('Failed to copy text:', error);
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setIsCopied(false);
  }, []);

  return { copy, isCopied, reset };
}
