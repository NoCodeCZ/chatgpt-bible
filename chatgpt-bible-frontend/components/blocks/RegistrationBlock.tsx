'use client';

import type { RegistrationBlock as RegistrationBlockType } from '@/types/blocks';
import Image from 'next/image';
import Link from 'next/link';

interface RegistrationBlockProps {
  data: RegistrationBlockType;
}

export default function RegistrationBlock({ data }: RegistrationBlockProps) {
  const {
    heading,
    description,
    steps = [],
    line_id,
    line_qr_code,
    line_url,
    bonuses = [],
    future_pacing_text,
    theme = 'dark',
  } = data;

  const themeClasses = {
    light: 'bg-white text-gray-900',
    dark: 'bg-zinc-950 text-white',
  }[theme];

  return (
    <section className={`relative z-10 py-16 sm:py-24 px-4 sm:px-6 ${themeClasses}`}>
      <div className="max-w-4xl mx-auto">
        <div className="glass-panel p-6 sm:p-8 lg:p-12 rounded-2xl border-emerald-500/30 glow-green">
          {(heading || description) && (
            <div className="text-center mb-8 sm:mb-12">
              {heading && (
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
                  {heading}
                </h2>
              )}
              {description && (
                <p className="text-slate-400">{description}</p>
              )}
            </div>
          )}

          {/* Steps */}
          {steps.length > 0 && (
            <div className="grid sm:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 text-xl font-bold">
                    {step.number}
                  </div>
                  <h4 className="font-semibold mb-2">{step.title}</h4>
                  <p className="text-sm text-slate-400">{step.description}</p>
                </div>
              ))}
            </div>
          )}

          {/* Line CTA */}
          {(line_id || line_url) && (
            <div className="bg-[#06C755]/10 border border-[#06C755]/30 p-6 sm:p-8 rounded-xl text-center">
              <div className="mb-4">
                <span
                  className="iconify w-16 h-16 mx-auto text-[#06C755]"
                  data-icon="simple-icons:line"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">แอดไลน์เพื่อสมัครเลย</h3>
              {line_id && (
                <div className="text-2xl sm:text-3xl font-bold text-[#06C755] mb-4">@{line_id}</div>
              )}
              <p className="text-sm text-slate-400 mb-6">หรือสแกน QR Code ด้านล่าง</p>

              {/* QR Code */}
              {line_qr_code && (
                <div className="w-40 h-40 mx-auto bg-white rounded-xl flex items-center justify-center mb-6 p-4">
                  <Image
                    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${line_qr_code}`}
                    alt="Line QR Code"
                    width={128}
                    height={128}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {line_url && (
                <Link
                  href={line_url}
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-[#06C755] hover:bg-[#05b34d] px-8 py-3 rounded-lg font-semibold transition-all"
                >
                  <span
                    className="iconify w-5 h-5"
                    data-icon="simple-icons:line"
                  />
                  แอดไลน์ตอนนี้
                </Link>
              )}
            </div>
          )}

          {/* Bonuses */}
          {bonuses.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <h3 className="text-lg sm:text-xl font-semibold mb-6 text-center">
                <span
                  className="iconify w-5 h-5 inline-block text-amber-400"
                  data-icon="lucide:gift"
                />
                {' '}
                ของแถมพิเศษสำหรับผู้สมัครวันนี้
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {bonuses.map((bonus, index) => (
                  <div key={index} className="flex items-center gap-3 glass-panel p-4 rounded-lg">
                    {bonus.icon && (
                      <span
                        className={`iconify w-6 h-6 ${
                          index % 4 === 0
                            ? 'text-emerald-400'
                            : index % 4 === 1
                            ? 'text-blue-400'
                            : index % 4 === 2
                            ? 'text-purple-400'
                            : 'text-amber-400'
                        }`}
                        data-icon={bonus.icon}
                      />
                    )}
                    <div>
                      <div className="font-medium text-sm">{bonus.title}</div>
                      <div className="text-xs text-slate-400">{bonus.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Future Pacing */}
          {future_pacing_text && (
            <div className="mt-8 sm:mt-12 text-center">
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">
                {future_pacing_text}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
