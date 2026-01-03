import type { HeroBlock as HeroBlockType } from '@/types/blocks';
import Link from 'next/link';
import Image from 'next/image';

interface HeroBlockProps {
  data: HeroBlockType;
}

export default function HeroBlock({ data }: HeroBlockProps) {
  const {
    heading,
    heading2,
    heading_line2,
    subheading,
    cta_text,
    cta_link,
    cta_text2,
    cta_link2,
    background_image,
    text_align = 'center',
    theme = 'light',
    stats,
  } = data;

  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[text_align];

  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-transparent text-white', // Transparent to show animation
  }[theme];

  return (
    <section className={`relative pt-20 sm:pt-24 md:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden ${themeClasses}`}>
      {/* Subtle overlay for better text readability */}
      {theme === 'dark' && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent z-0 pointer-events-none"></div>
      )}
      {/* Background Effects */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-64 h-64 sm:w-96 sm:h-96 bg-purple-600/30 rounded-full blur-3xl z-0"></div>
      
      {/* Background Image */}
      {background_image && (
        <div className="absolute inset-0 z-0">
          <Image
            src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${background_image}`}
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={85}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      )}

      {/* Content */}
      <div className={`relative z-10 max-w-4xl mx-auto ${textAlignClass}`}>
        <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-3 sm:mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {heading}
          {heading2 && (
            <>
              {' '}
              <span className="text-purple-400 drop-shadow-[0_2px_8px_rgba(139,92,246,0.6)]">{heading2}</span>
            </>
          )}
        </h1>

        {heading_line2 && (
          <h2 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-4 sm:mb-6 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            {heading_line2}
          </h2>
        )}

        {subheading && (
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-6 sm:mb-8 leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {subheading}
          </p>
        )}

        {/* CTAs */}
        {(cta_text || cta_text2) && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10">
            {cta_text && cta_link && (
              <Link
                href={cta_link}
                className="w-full sm:w-auto min-h-[48px] bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-medium px-6 sm:px-8 py-3 sm:py-3 rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-600/25"
              >
                {cta_text}
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
            )}
            {cta_text2 && cta_link2 && (
              <Link
                href={cta_link2}
                className="w-full sm:w-auto min-h-[48px] bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-medium px-6 sm:px-8 py-3 sm:py-3 rounded-full transition-all flex items-center justify-center gap-2 backdrop-blur-sm border border-white/10"
              >
                {cta_text2}
              </Link>
            )}
          </div>
        )}

        {/* Stats */}
        {stats && stats.length > 0 && (
          <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm items-center justify-center">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="flex gap-1.5 sm:gap-2 bg-zinc-900/90 backdrop-blur-md border-white/30 border rounded-full px-3 sm:px-4 py-2 sm:py-2.5 items-center shadow-xl"
              >
                {stat.icon && (
                  <span className="text-purple-400 w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" dangerouslySetInnerHTML={{ __html: stat.icon }} />
                )}
                <span className="text-white font-medium text-xs sm:text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
