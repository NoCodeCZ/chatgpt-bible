'use client';

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { XMarkIcon, FunnelIcon } from '@heroicons/react/24/outline';
import PromptFilters from './PromptFilters';
import type { Category } from '@/types/Category';
import type { JobRole } from '@/types/JobRole';

interface PromptFiltersMobileProps {
  categories: Category[];
  jobRoles: JobRole[];
}

export default function PromptFiltersMobile({ categories, jobRoles }: PromptFiltersMobileProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Close drawer when URL changes (filter applied)
  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        <FunnelIcon className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">Filters</span>
      </button>

      {/* Mobile Filter Drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Drawer */}
          <div className="fixed inset-y-0 left-0 w-80 bg-white z-50 lg:hidden overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  aria-label="Close filters"
                >
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>
              <PromptFilters categories={categories} jobRoles={jobRoles} />
            </div>
          </div>
        </>
      )}
    </>
  );
}

