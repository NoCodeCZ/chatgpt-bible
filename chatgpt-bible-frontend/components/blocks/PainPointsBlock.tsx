import type { PainPointsBlock as PainPointsBlockType } from '@/types/blocks';

interface PainPointsBlockProps {
  data: PainPointsBlockType;
}

export default function PainPointsBlock({ data }: PainPointsBlockProps) {
  const {
    heading,
    description,
    pain_points = [],
    transition_text,
    theme = 'dark',
  } = data;

  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-zinc-950 text-white',
  }[theme];

  return (
    <section className={`relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent via-red-950/10 to-transparent ${themeClasses}`}>
      <div className="max-w-7xl mx-auto">
        {(heading || description) && (
          <div className="text-center mb-12 sm:mb-16">
            {heading && (
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                {heading}
              </h2>
            )}
            {description && (
              <p className="text-slate-400 max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {pain_points.map((point, index) => (
            <div
              key={index}
              className="group glass-panel p-6 rounded-xl hover:border-red-500/30 transition-all duration-300"
            >
              {point.icon && (
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <span
                    className="iconify w-6 h-6 text-red-400"
                    data-icon={point.icon}
                  />
                </div>
              )}
              <h3 className="font-semibold text-lg mb-2">{point.title}</h3>
              <p className="text-sm text-slate-400">{point.description}</p>
            </div>
          ))}

          {transition_text && (
            <div className="group bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 p-6 rounded-xl sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-4">
                <span
                  className="iconify w-6 h-6 text-emerald-400"
                  data-icon="lucide:lightbulb"
                />
              </div>
              <h3 className="font-semibold text-lg mb-2 text-emerald-400">แต่ถ้าบอกว่า...</h3>
              <p className="text-sm text-slate-300">{transition_text}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
