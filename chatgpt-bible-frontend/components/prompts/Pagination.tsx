import Link from 'next/link';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string | undefined>;
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams }: PaginationProps) {
  const getPageUrl = (page: number): string => {
    const params = new URLSearchParams();
    
    // Preserve all filter parameters
    if (searchParams) {
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value && key !== 'page') {
          params.set(key, value);
        }
      });
    }
    
    // Add page parameter (only if not page 1)
    if (page > 1) {
      params.set('page', page.toString());
    }
    
    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  const renderPageNumbers = (): React.ReactElement[] => {
    const pages: React.ReactElement[] = [];
    const showPages = 5; // Show max 5 page numbers
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + showPages - 1);

    // Adjust start if we're near the end
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }

    // Add ellipsis logic
    if (startPage > 1) {
      pages.push(
        <Link
          key={1}
          href={getPageUrl(1)}
          className="w-10 h-10 bg-zinc-900 border border-white/10 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center"
        >
          1
        </Link>
      );
      if (startPage > 2) {
        pages.push(
          <span key="ellipsis-start" className="text-zinc-600 px-2">...</span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Link
          key={i}
          href={getPageUrl(i)}
          className={`w-10 h-10 rounded-lg text-sm font-medium flex items-center justify-center transition-all
            ${i === currentPage
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
              : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
            }
          `}
          aria-current={i === currentPage ? 'page' : undefined}
        >
          {i}
        </Link>
      );
    }

    // Add trailing ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="ellipsis-end" className="text-zinc-600 px-2">...</span>
        );
      }
      pages.push(
        <Link
          key={totalPages}
          href={getPageUrl(totalPages)}
          className="w-10 h-10 bg-zinc-900 border border-white/10 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center"
        >
          {totalPages}
        </Link>
      );
    }

    return pages;
  };

  return (
    <nav className="mt-12 flex justify-center items-center gap-2" aria-label="Pagination">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-all flex items-center"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
      ) : (
        <span className="px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-lg text-sm text-zinc-600 cursor-not-allowed flex items-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </span>
      )}

      {/* Page Numbers */}
      {renderPageNumbers()}

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-4 py-2 bg-zinc-900 border border-white/10 rounded-lg text-sm text-zinc-400 hover:text-white hover:border-white/20 transition-all flex items-center"
          aria-label="Next page"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span className="px-4 py-2 bg-zinc-900/50 border border-white/5 rounded-lg text-sm text-zinc-600 cursor-not-allowed flex items-center">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  );
}
