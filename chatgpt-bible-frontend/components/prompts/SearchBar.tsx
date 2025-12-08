'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounce search input (500ms as per Story 2.4 requirements)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);

      if (query.trim()) {
        params.set('search', query.trim());
      } else {
        params.delete('search');
      }

      // Reset to page 1 on new search
      params.delete('page');

      router.push(`/prompts?${params.toString()}`);
    }, 500); // 500ms debounce

    debounceTimerRef.current = timer;
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, router, searchParams]);

  // Handle Enter key press for immediate search
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = null;
      }

      // Immediately update URL
      const params = new URLSearchParams(searchParams);
      if (query.trim()) {
        params.set('search', query.trim());
      } else {
        params.delete('search');
      }
      params.delete('page');
      router.push(`/prompts?${params.toString()}`);
    }
  };

  const clearSearch = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams);
    params.delete('search');
    params.delete('page');
    router.push(`/prompts?${params.toString()}`);
  };

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <svg 
          className="h-5 w-5 text-zinc-500 group-focus-within:text-purple-400 transition-colors" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search prompts by title, description, or category..."
        className="block w-full pl-12 pr-12 py-4 bg-zinc-900/50 border border-white/10 rounded-2xl text-base text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all shadow-lg backdrop-blur-md"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-2">
        {query && (
          <button
            onClick={clearSearch}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4 text-zinc-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <kbd className="hidden sm:inline-flex items-center border border-white/10 rounded px-2 text-xs font-sans font-medium text-zinc-500">
          ⌘K
        </kbd>
      </div>
    </div>
  );
}

