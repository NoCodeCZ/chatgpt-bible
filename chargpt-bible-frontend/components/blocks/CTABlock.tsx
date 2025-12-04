import type { CTABlock as CTABlockType } from '@/types/blocks';
import Link from 'next/link';

interface CTABlockProps {
  data: CTABlockType;
}

export default function CTABlock({ data }: CTABlockProps) {
  const {
    heading,
    description,
    button_text,
    button_link,
    button_text2,
    button_link2,
    button_style = 'primary',
    background_color,
    background_gradient,
  } = data;

  const buttonStyles = {
    primary: 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25',
    secondary: 'bg-gray-700 text-white hover:bg-gray-800',
    outline: 'bg-white/10 hover:bg-white/15 text-white backdrop-blur-sm border border-white/10',
  }[button_style];

  const containerStyle = background_gradient
    ? { background: background_gradient }
    : background_color
    ? { backgroundColor: background_color }
    : undefined;

  const containerClasses = background_gradient
    ? 'py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-purple-900/20 to-transparent bg-transparent'
    : 'py-20 px-4 sm:px-6 lg:px-8 bg-transparent';

  return (
    <section
      className={`${containerClasses} relative`}
      style={containerStyle}
    >
      {/* Subtle overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-transparent z-0 pointer-events-none"></div>
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
          {heading}
        </h2>

        {/* Description */}
        {description && (
          <p className="text-base font-medium text-zinc-200 mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
            {description}
          </p>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href={button_link}
            className={`inline-block px-8 py-3 font-medium rounded-full transition-all flex items-center justify-center gap-2 ${buttonStyles}`}
          >
            {button_text}
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
          {button_text2 && button_link2 && (
            <Link
              href={button_link2}
              className="w-full sm:w-auto bg-white/10 hover:bg-white/15 text-white font-medium px-8 py-3 rounded-full transition-all flex items-center justify-center gap-2 backdrop-blur-sm border border-white/10"
            >
              {button_text2}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
