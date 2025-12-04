import type { FeaturesBlock as FeaturesBlockType } from '@/types/blocks';

interface FeaturesBlockProps {
  data: FeaturesBlockType;
}

export default function FeaturesBlock({ data }: FeaturesBlockProps) {
  const { heading, description, features, theme = 'light', columns = 3 } = data;

  const themeClasses = {
    light: 'bg-white',
    dark: 'bg-transparent', // Transparent to show animation
  }[theme];

  const textColorClasses = {
    light: 'text-gray-900',
    dark: 'text-white',
  }[theme];

  const cardClasses = {
    light: 'bg-zinc-900/50 backdrop-blur-sm border border-white/10',
    dark: 'bg-zinc-900/50 backdrop-blur-sm border border-white/10',
  }[theme];

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-3';

  return (
    <section className={`sm:px-6 lg:px-8 px-4 py-20 ${themeClasses} relative`}>
      {/* Subtle overlay for better text readability */}
      {theme === 'dark' && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent z-0 pointer-events-none"></div>
      )}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        {(heading || description) && (
          <div className="text-center mb-16">
            {heading && (
              <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${textColorClasses} ${theme === 'dark' ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' : ''}`}>
                {heading}
              </h2>
            )}
            {description && (
              <p className={`text-base font-medium ${theme === 'dark' ? 'text-zinc-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' : 'text-zinc-600'}`}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Features Grid */}
        <div className={`grid ${gridCols} gap-6`}>
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${cardClasses} rounded-2xl p-8 text-center hover:bg-zinc-900/70 transition-all`}
            >
              {/* Icon */}
              {feature.icon && (
                <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl text-purple-400" dangerouslySetInnerHTML={{ __html: feature.icon }} />
                </div>
              )}

              {/* Title */}
              <h3 className={`text-lg font-bold mb-3 ${textColorClasses} ${theme === 'dark' ? 'text-white' : ''}`}>
                {feature.title}
              </h3>

              {/* Description */}
              <p className={`text-sm leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
