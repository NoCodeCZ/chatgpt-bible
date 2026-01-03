'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { NavItem } from '@/types/Navigation';

interface NavbarProps {
  items: NavItem[];
  logo?: {
    text: string;
    href: string;
  };
}

/**
 * Main navigation bar component with auth state integration
 *
 * Features:
 * - Responsive design with mobile hamburger menu
 * - Supports internal (Next.js Link) and external links
 * - Sticky positioning on desktop
 * - Mobile-friendly touch targets (48px minimum)
 * - Accessible keyboard navigation
 * - Breadcrumb support for sub-pages
 * - Auth-aware UI: Login/Sign Up for unauthenticated, user menu for authenticated
 * - Pro badge for paid users
 *
 * @param items - Navigation items from Directus
 * @param logo - Optional logo configuration (defaults to "GPT Bible")
 */
export default function Navbar({ items, logo }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout, isPaidUser } = useAuth();

  const logoConfig = logo || {
    text: 'GPT Bible',
    href: '/',
  };

  // Determine current section for breadcrumb
  const getBreadcrumb = () => {
    if (pathname.startsWith('/prompts')) return 'Library';
    if (pathname.startsWith('/categories')) return 'Categories';
    if (pathname.startsWith('/login')) return 'Login';
    return null;
  };

  const breadcrumb = getBreadcrumb();

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 supports-[backdrop-filter]:bg-black/20">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Breadcrumb */}
          <div className="flex items-center gap-3">
            <Link href={logoConfig.href} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-lg shadow-lg shadow-purple-500/20 flex items-center justify-center border border-white/10">
                <span className="text-white font-semibold text-sm">
                  {logoConfig.text.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="font-medium text-base text-zinc-100 tracking-tight">
                {logoConfig.text}
              </span>
            </Link>
            {breadcrumb && (
              <>
                <span className="text-zinc-600 text-sm hidden sm:block">/</span>
                <span className="text-zinc-400 text-sm hidden sm:block">{breadcrumb}</span>
              </>
            )}
          </div>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Browse Prompts Link */}
            <Link
              href="/prompts"
              className={`text-sm font-medium transition-colors pb-1 border-b-2 border-transparent ${
                pathname.startsWith('/prompts')
                  ? 'text-purple-400 border-purple-500'
                  : 'text-zinc-300 hover:text-white hover:border-purple-500'
              }`}
            >
              Browse Prompts
            </Link>
            {items.map((item) => {
              const isActive = pathname === item.url || pathname.startsWith(item.url + '/');
              const linkClasses = `text-sm font-medium transition-colors pb-1 border-b-2 border-transparent ${
                isActive
                  ? 'text-purple-400 border-purple-500'
                  : 'text-zinc-300 hover:text-white hover:border-purple-500'
              }`;

              if (item.isExternal) {
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target={item.target}
                    rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className={linkClasses}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className={linkClasses}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {!isLoading && (
              <>
                {!isAuthenticated ? (
                  <>
                    {/* Desktop login/signup links */}
                    <Link
                      href="/login"
                      className="hidden md:inline-block text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="hidden md:inline-flex items-center justify-center px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-sm font-semibold text-white shadow-lg shadow-purple-500/40 transition-all"
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    {/* User Menu */}
                    <div className="relative" ref={userMenuRef}>
                      <button
                        type="button"
                        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
                        aria-expanded={isUserMenuOpen}
                        aria-label="User menu"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-purple-600 border border-white/10 flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {user?.email?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                        <span className="max-w-[120px] truncate">{user?.email}</span>
                        {isPaidUser && (
                          <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-xs font-semibold text-white">
                            Pro
                          </span>
                        )}
                        <svg
                          className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* User Dropdown Menu */}
                      {isUserMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-black/95 backdrop-blur-xl border border-white/10 shadow-xl z-50">
                          <div className="py-2">
                            <div className="px-4 py-3 border-b border-white/5">
                              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                              {isPaidUser && (
                                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-xs font-semibold text-white">
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                  Pro Member
                                </span>
                              )}
                            </div>
                            <Link
                              href="/dashboard"
                              className="block px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Dashboard
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full text-left px-4 py-2 text-sm text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="lg:hidden inline-flex items-center justify-center p-3 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 active:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 transition-all min-h-[44px] min-w-[44px]"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/5 bg-black/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 pt-4 pb-6 space-y-2 max-h-[calc(100vh-3.5rem)] overflow-y-auto" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))' }}>
            {/* Browse Prompts Link */}
            <Link
              href="/prompts"
              className={`block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                pathname.startsWith('/prompts')
                  ? 'text-white bg-purple-600/10 border border-purple-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
              onClick={closeMobileMenu}
            >
              Browse Prompts
            </Link>
            
            {items.map((item) => {
              const isActive = pathname === item.url || pathname.startsWith(item.url + '/');
              const linkClasses = `block px-4 py-3 rounded-xl text-base font-medium transition-all ${
                isActive
                  ? 'text-white bg-purple-600/10 border border-purple-500/40'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`;

              if (item.isExternal) {
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    target={item.target}
                    rel={item.target === '_blank' ? 'noopener noreferrer' : undefined}
                    className={linkClasses}
                    onClick={closeMobileMenu}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.id}
                  href={item.url}
                  className={linkClasses}
                  onClick={closeMobileMenu}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Mobile Auth Section */}
            {!isLoading && (
              <div className="pt-4 border-t border-white/5 space-y-2">
                {!isAuthenticated ? (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                      onClick={closeMobileMenu}
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-zinc-800 to-zinc-700 border border-white/10 flex items-center justify-center">
                        <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      Login
                    </Link>
                    <Link
                      href="/signup"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-base font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-lg shadow-purple-500/40 transition-all"
                      onClick={closeMobileMenu}
                    >
                      Sign Up
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                      {isPaidUser && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-xs font-semibold text-white">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          Pro Member
                        </span>
                      )}
                    </div>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-3 rounded-xl text-base font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                      onClick={closeMobileMenu}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={async () => {
                        closeMobileMenu();
                        await handleLogout();
                      }}
                      className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
