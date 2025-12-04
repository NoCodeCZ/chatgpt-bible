import Link from 'next/link';

/**
 * UpgradeCTA Component
 * 
 * Displays an upgrade call-to-action for locked prompts.
 * Shown when free users try to access prompts beyond the free tier limit.
 */
export default function UpgradeCTA() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-900/40 to-indigo-900/40 p-8 backdrop-blur-sm">
      {/* Decorative elements */}
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-500/10 blur-2xl" />
      <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl" />

      <div className="relative z-10 text-center">
        {/* Lock Icon */}
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-purple-500/30 bg-purple-500/10">
            <svg
              className="h-8 w-8 text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h3 className="mb-2 text-xl font-semibold text-white">
          Unlock Full Access
        </h3>

        {/* Description */}
        <p className="mb-6 text-sm text-zinc-400">
          Upgrade to paid subscription to access all prompts and unlock the full
          library of 100+ prompts.
        </p>

        {/* CTA Button */}
        <Link
          href="/upgrade"
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-purple-900/40 transition-all hover:scale-105 hover:from-purple-500 hover:to-indigo-500 active:scale-95"
        >
          <span>Upgrade to Paid</span>
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

