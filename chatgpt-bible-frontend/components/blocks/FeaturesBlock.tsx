import type { FeaturesBlock as FeaturesBlockType } from '@/types/blocks';

interface FeaturesBlockProps {
  data: FeaturesBlockType;
}

export default function FeaturesBlock({ data }: FeaturesBlockProps) {
  const { heading, description, features, theme = 'light', columns = 3 } = data;

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-3';

  return (
    <section className={`sm:px-6 lg:px-8 px-4 py-20 ${theme === 'dark' ? 'bg-transparent' : 'bg-white'} relative`}>
      {/* Subtle overlay for better text readability */}
      {theme === 'dark' && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent z-0 pointer-events-none"></div>
      )}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        {(heading || description) && (
          <div className="text-center mb-16">
            {heading && (
              <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${theme === 'dark' ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' : 'text-zinc-900'}`}>
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
              className="bg-white rounded-2xl p-6 text-zinc-900 hover:shadow-xl hover:shadow-purple-500/10 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                {/* Icon */}
                {feature.icon && (
                  <div className="flex items-center justify-center text-purple-400">
                    <span className="text-2xl" dangerouslySetInnerHTML={{ __html: feature.icon }} />
                  </div>
                )}
                {/* No badge for features - leave empty space */}
                {!feature.icon && <div></div>}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold mb-3 text-zinc-900 leading-snug">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-sm leading-relaxed text-zinc-600 line-clamp-3">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
