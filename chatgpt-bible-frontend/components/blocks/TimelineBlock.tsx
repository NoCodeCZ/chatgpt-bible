import type { TimelineBlock as TimelineBlockType } from '@/types/blocks';

interface TimelineBlockProps {
  data: TimelineBlockType;
}

export default function TimelineBlock({ data }: TimelineBlockProps) {
  const {
    heading,
    description,
    timeline_items = [],
    price_anchor_text,
    price_anchor_time,
    price_anchor_cost,
    theme = 'dark',
  } = data;

  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-zinc-950 text-white',
  }[theme];

  const colorConfig = {
    red: {
      bg: 'bg-red-500',
      border: 'border-red-500/30',
      text: 'text-red-400',
    },
    amber: {
      bg: 'bg-amber-500',
      border: 'border-amber-500/30',
      text: 'text-amber-400',
    },
    emerald: {
      bg: 'bg-emerald-500',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
    },
  };

  return (
    <section className={`relative z-10 py-16 sm:py-24 px-4 sm:px-6 bg-gradient-to-b from-transparent via-zinc-900/50 to-transparent ${themeClasses}`}>
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

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-red-500 via-amber-500 to-emerald-500"></div>

          {/* Timeline Items */}
          <div className="space-y-8 sm:space-y-12">
            {timeline_items.map((item, index) => {
              const isEven = index % 2 === 0;
              const color = item.color || 'red';
              const colors = colorConfig[color];

              return (
                <div
                  key={index}
                  className="relative flex flex-col md:flex-row items-start gap-4 md:gap-8"
                >
                  {isEven ? (
                    <>
                      <div className="md:w-1/2 md:text-right md:pr-12 pl-12 md:pl-0">
                        <div className={`glass-panel p-4 sm:p-6 rounded-xl border ${colors.border}`}>
                          <div className={`text-sm font-semibold mb-2 ${colors.text}`}>
                            {item.year}
                          </div>
                          <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                      </div>
                      <div className={`absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 ${colors.bg} rounded-full border-4 border-zinc-950`}></div>
                      <div className="md:w-1/2"></div>
                    </>
                  ) : (
                    <>
                      <div className="md:w-1/2"></div>
                      <div className={`absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 ${colors.bg} rounded-full border-4 border-zinc-950`}></div>
                      <div className="md:w-1/2 md:pl-12 pl-12">
                        <div className={`glass-panel p-4 sm:p-6 rounded-xl border ${colors.border}`}>
                          <div className={`text-sm font-semibold mb-2 ${colors.text}`}>
                            {item.year}
                          </div>
                          <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Anchor */}
        {(price_anchor_text || price_anchor_time || price_anchor_cost) && (
          <div className="mt-12 sm:mt-16 glass-panel p-6 sm:p-8 rounded-2xl border-amber-500/30 text-center">
            {price_anchor_text && (
              <p className="text-slate-400 mb-4">{price_anchor_text}</p>
            )}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
              {price_anchor_time && (
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-red-400">{price_anchor_time}</div>
                  <div className="text-sm text-slate-500">เวลาที่เสียไป</div>
                </div>
              )}
              <div className="text-2xl sm:text-3xl text-slate-600">+</div>
              {price_anchor_cost && (
                <div>
                  <div className="text-3xl sm:text-4xl font-bold text-red-400">{price_anchor_cost}</div>
                  <div className="text-sm text-slate-500">เงินลงทุนทดลอง</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
