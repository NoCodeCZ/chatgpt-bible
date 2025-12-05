import type { FAQBlock as FAQBlockType } from '@/types/blocks';

interface FAQBlockProps {
  data: FAQBlockType;
}

export default function FAQBlock({ data }: FAQBlockProps) {
  const { heading, description, faqs = [], theme = 'dark' } = data;

  const themeClasses = {
    light: 'bg-white',
    dark: 'bg-transparent', // Transparent to show animation
  }[theme];

  const textColorClasses = {
    light: 'text-gray-900',
    dark: 'text-white',
  }[theme];

  return (
    <section className={`py-20 px-4 sm:px-6 lg:px-8 ${themeClasses} relative`}>
      {/* Subtle overlay for better text readability */}
      {theme === 'dark' && (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent z-0 pointer-events-none"></div>
      )}
      <div className="max-w-3xl mx-auto relative z-10">
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

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
            >
              <h3 className={`text-base font-bold mb-3 ${textColorClasses} ${theme === 'dark' ? 'text-white' : ''}`}>
                {faq.question}
              </h3>
              <p className={`text-sm leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

