import type { PricingBlock as PricingBlockType } from '@/types/blocks';
import Link from 'next/link';

interface PricingBlockProps {
  data: PricingBlockType;
}

export default function PricingBlock({ data }: PricingBlockProps) {
  const { heading, description, plans = [], theme = 'dark' } = data;

  const themeClasses = {
    light: 'bg-white',
    dark: 'bg-zinc-950',
  }[theme];

  const textColorClasses = {
    light: 'text-gray-900',
    dark: 'text-white',
  }[theme];

  return (
    <section className={`sm:px-6 lg:px-8 bg-zinc-950 pt-20 pr-4 pb-20 pl-4 ${themeClasses} relative z-20`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        {(heading || description) && (
          <div className="text-center mb-16">
            {heading && (
              <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${textColorClasses}`}>
                {heading}
              </h2>
            )}
            {description && (
              <p className={`text-base font-medium ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>
                {description}
              </p>
            )}
          </div>
        )}

        {/* Pricing Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative flex flex-col ${
                plan.featured
                  ? 'bg-zinc-900 border-2 border-purple-500 rounded-2xl p-8 shadow-xl shadow-purple-500/20 md:-mt-2 md:mb-2'
                  : 'bg-zinc-900/80 border border-white/10 rounded-2xl p-8 hover:border-white/20 hover:bg-zinc-900/90 transition-all'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <span className="bg-purple-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan Header */}
              <div className="text-center mb-8">
                <h3
                  className={`text-lg font-bold mb-2 ${
                    plan.featured ? 'text-purple-400' : 'text-zinc-400'
                  }`}
                >
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-4xl sm:text-5xl font-bold text-white">{plan.price}</span>
                </div>
                {plan.price_period && (
                  <p className="text-sm text-zinc-500 mt-2">{plan.price_period}</p>
                )}
                {plan.description && (
                  <>
                    <p className="text-sm text-zinc-500">{plan.description}</p>
                    {plan.name === 'Basic' && (
                      <p className="text-sm text-zinc-500">เข้าถึง Prompts พื้นฐาน</p>
                    )}
                    {(plan.name === 'Standard' || plan.name === 'Pro') && (
                      <p className="text-sm text-zinc-500">เข้าถึง Prompts ทุกรายการ</p>
                    )}
                  </>
                )}
              </div>

              {/* Features */}
              {plan.features && plan.features.length > 0 && (
                <div className="space-y-4 mb-8">
                  <p className="text-sm font-bold text-white mb-4">สิ่งที่รวมอยู่:</p>
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-3 text-sm text-zinc-400"
                      >
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
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            feature.included ? 'text-purple-400' : 'text-zinc-600'
                          }`}
                        >
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                        <span className={feature.included ? 'text-zinc-400' : 'text-zinc-600'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Bonuses */}
              {plan.bonuses && plan.bonuses.length > 0 && (
                <div className="space-y-4">
                  <p className="text-sm font-bold text-white mb-4">ฟรีโบนัส</p>
                  <ul className="space-y-3">
                    {plan.bonuses.map((bonus, bonusIndex) => (
                      <li
                        key={bonusIndex}
                        className="flex items-start gap-3 text-sm text-zinc-400"
                      >
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
                          className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            bonus.included ? 'text-purple-400' : 'text-zinc-600'
                          }`}
                        >
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                        <span className={bonus.included ? 'text-zinc-400' : 'text-zinc-600'}>
                          {bonus.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Button - Push to bottom */}
              <div className="mt-auto pt-8">
                <Link
                  href={plan.button_link}
                  className={`w-full font-medium py-3 rounded-xl transition-all text-center block ${
                    plan.featured
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40'
                      : 'bg-white/10 hover:bg-white/15 text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {plan.button_text}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

