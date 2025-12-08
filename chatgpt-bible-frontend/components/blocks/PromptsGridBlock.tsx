import type { PromptsGridBlock as PromptsGridBlockType } from '@/types/blocks';
import Link from 'next/link';

interface PromptsGridBlockProps {
  data: PromptsGridBlockType;
}

export default function PromptsGridBlock({ data }: PromptsGridBlockProps) {
  const {
    heading,
    description,
    prompts = [],
    columns = 3,
    show_view_all = false,
    view_all_text = 'View All',
    view_all_link = '/prompts',
  } = data;

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-transparent relative">
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent z-0 pointer-events-none"></div>
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        {(heading || description) && (
          <div className="text-center mb-16">
            {heading && (
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-base font-medium text-zinc-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
                {description}
              </p>
            )}
          </div>
        )}

        {/* Prompts Grid */}
        <div className={`grid ${gridCols} gap-6`}>
          {prompts.map((prompt, index) => (
            <Link
              href={prompt.link || '#'}
              key={index}
              className="block bg-zinc-900/40 border border-white/10 hover:border-purple-500/30 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/10 hover:-translate-y-1 backdrop-blur-md group"
            >
              <div className="flex items-start justify-between mb-4">
                {prompt.icon && (
                  <div className="flex items-center justify-center text-purple-400">
                    <span className="text-2xl" dangerouslySetInnerHTML={{ __html: prompt.icon }} />
                  </div>
                )}
                {prompt.badge && (
                  <span
                    className={`text-white text-xs font-medium px-3 py-1 rounded-full ${
                      prompt.badge === 'premium' ? 'bg-zinc-800' : 'bg-purple-600'
                    }`}
                  >
                    {prompt.badge === 'premium' ? 'Premium' : 'ฟรี'}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold mb-3 text-zinc-100 leading-snug line-clamp-2">{prompt.title}</h3>

              {prompt.tags && prompt.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {prompt.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-zinc-800/50 text-zinc-300 text-xs px-2 py-1 rounded-md border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-4 h-4"
                  >
                    <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                  <span>{prompt.views !== undefined ? prompt.views.toLocaleString() : '0'}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-purple-400 transition-colors font-medium group-hover:translate-x-0.5 duration-300">
                  <span>View</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-3 h-3"
                  >
                    <path d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        {show_view_all && (
          <div className="text-center mt-12">
            <Link
              href={view_all_link}
              className="bg-white/10 hover:bg-white/15 text-white font-medium px-8 py-3 rounded-full transition-all flex items-center justify-center gap-2 mx-auto backdrop-blur-sm border border-white/10"
            >
              {view_all_text}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

