import Link from 'next/link';
import type { Metadata } from 'next';

/**
 * Upgrade CTA Placeholder Page
 *
 * Story 3.8: Create Upgrade CTA Placeholder Page
 *
 * Features:
 * - Headline "Unlock Full Library"
 * - Benefits list (100+ prompts, weekly updates)
 * - Pricing display ($15-25/month)
 * - CTA button (placeholder/disabled with "Coming Soon")
 * - Link back to browse prompts
 * - Mobile-responsive design
 */
export default function UpgradePage() {
  return (
    <div className="relative min-h-screen">
      {/* Ambient Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[10%] left-[20%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[120px] opacity-40" />
        <div className="absolute -bottom-[10%] right-[10%] h-[600px] w-[600px] rounded-full bg-blue-900/10 blur-[120px] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-purple-800/5 blur-[150px] opacity-50" />
      </div>

      <main className="mx-auto max-w-4xl px-4 pt-24 pb-20 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 overflow-x-auto whitespace-nowrap pb-2 text-xs text-zinc-500">
          <Link
            href="/"
            className="flex items-center gap-1 text-zinc-500 transition-colors hover:text-zinc-300"
          >
            <span>Home</span>
          </Link>
          <span className="text-zinc-700">{'>'}</span>
          <Link
            href="/prompts"
            className="transition-colors hover:text-zinc-300"
          >
            Prompts
          </Link>
          <span className="text-zinc-700">{'>'}</span>
          <span className="text-zinc-300">Upgrade</span>
        </nav>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Unlock Full Library
          </h1>
          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto">
            Get access to all premium prompts and unlock the full potential of AI for your work
          </p>
        </div>

        {/* Pricing & Benefits Card */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-2xl p-6 sm:p-8 lg:p-10 mb-8">
          {/* Pricing */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-baseline gap-2 mb-2">
              <span className="text-5xl sm:text-6xl font-bold text-white">$15</span>
              <span className="text-2xl text-zinc-400">-</span>
              <span className="text-5xl sm:text-6xl font-bold text-white">$25</span>
              <span className="text-xl text-zinc-400">/month</span>
            </div>
            <p className="text-sm text-zinc-500 mt-2">Flexible pricing based on your needs</p>
          </div>

          {/* Benefits List */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-white mb-6 text-center">
              What You Get
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {/* Benefit 1: 100+ Prompts */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-zinc-800/30">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-400"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">100+ Premium Prompts</h3>
                  <p className="text-sm text-zinc-400">
                    Access our entire library of professional-grade prompts
                  </p>
                </div>
              </div>

              {/* Benefit 2: Weekly Updates */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-zinc-800/30">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-blue-400"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Weekly Updates</h3>
                  <p className="text-sm text-zinc-400">
                    New prompts added every week to keep you ahead
                  </p>
                </div>
              </div>

              {/* Benefit 3: Full Access */}
              <div className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-zinc-800/30 sm:col-span-2">
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-400"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-white mb-1">Unlimited Access</h3>
                  <p className="text-sm text-zinc-400">
                    No limits on how many prompts you can use. Copy, customize, and use them all
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button - Disabled/Placeholder */}
          <div className="text-center">
            <button
              disabled
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-zinc-700/50 text-zinc-400 font-semibold text-lg cursor-not-allowed border border-zinc-700/50 shadow-lg"
              aria-label="Coming Soon - Upgrade feature will be available soon"
            >
              Coming Soon
            </button>
            <p className="text-sm text-zinc-500 mt-4">
              We're working hard to bring you the best upgrade experience
            </p>
          </div>
        </div>

        {/* Back to Prompts Link */}
        <div className="text-center">
          <Link
            href="/prompts"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900/60 border border-white/10 hover:border-purple-500/50 text-white font-medium transition-all hover:bg-zinc-800/60 group"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform group-hover:-translate-x-1"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span>กลับไปดู Prompts</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

/**
 * Page Metadata
 */
export const metadata: Metadata = {
  title: 'Upgrade to Premium | GPT Bible',
  description: 'Unlock the full library of premium prompts and get access to 100+ professional-grade prompts with weekly updates.',
};

