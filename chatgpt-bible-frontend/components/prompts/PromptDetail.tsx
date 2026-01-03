import type { Prompt } from '@/types/Prompt';
import PromptMetadata from './PromptMetadata';
import CopyButton from './CopyButton';
import UpgradeCTA from './UpgradeCTA';
import { getPromptText } from '@/lib/utils/prompt-utils';

interface PromptDetailProps {
  prompt: Prompt;
  hasAccess: boolean;
  isPaidUser: boolean;
}

/**
 * Prompt Detail Component
 *
 * Implements the new GPT Bible prompt page structure for the left column:
 * - Hero card with categories, difficulty, title, and quick stats
 * - Description and additional context
 * - Highlighted prompt code block with copy button (or locked state)
 * - "How to use" step-by-step section
 * - Upgrade CTA for locked prompts
 */
export default function PromptDetail({
  prompt,
  hasAccess,
  isPaidUser,
}: PromptDetailProps) {
  // Get the prompt text as-is (preserves all placeholders and context)
  const promptText = getPromptText(prompt.prompt_text || '');

  // Use title_en if available, fallback to title_th, then to deprecated title field
  const displayTitle =
    prompt.title_en || prompt.title_th || prompt.title || 'Untitled Prompt';

  const difficultyLabel =
    prompt.difficulty_level === 'beginner'
      ? 'Beginner'
      : prompt.difficulty_level === 'intermediate'
        ? 'Intermediate'
        : 'Advanced';

  return (
    <article className="space-y-6">
      {/* Title & Header Block */}
      <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-xl shadow-black/40 backdrop-blur-2xl sm:p-8">
        {/* Metadata tags */}
        <div className="mb-4 flex flex-wrap gap-2">
          {prompt.categories?.[0] && (
            <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400">
              {prompt.categories[0].categories_id.name_th ||
                prompt.categories[0].categories_id.name}
            </span>
          )}
          <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
            {difficultyLabel}
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <h1 className="text-2xl font-medium leading-tight tracking-tight text-white sm:text-3xl">
            {displayTitle}
          </h1>

          {/* Simple stats row (placeholders for now) */}
          <div className="flex shrink-0 items-center gap-3 rounded-full border border-white/5 bg-zinc-900/70 px-3 py-1.5 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
              <span>👁</span> 0
            </span>
            <span className="flex items-center gap-1.5">
              <span>💬</span> 0
            </span>
            <span className="flex items-center gap-1.5">
              <span>♥</span> 0
            </span>
          </div>
        </div>

        <div className="h-px w-full bg-white/5" />

        {/* Rich metadata row */}
        <div className="flex flex-col gap-4 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <PromptMetadata prompt={prompt} />
        </div>
      </section>

      {/* Description + Prompt Block */}
      <section className="space-y-6 rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-xl shadow-black/40 backdrop-blur-2xl sm:p-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
            <span className="text-sm">✎</span>
          </div>
          <h2 className="text-lg font-medium tracking-tight text-white">
            เนื้อหา Prompt เพิ่มเติม
          </h2>
        </div>

        <p className="pl-11 text-sm font-light leading-relaxed text-zinc-400">
          {promptText?.slice(0, 200) || 'No additional content'}
          {promptText && promptText.length > 200 ? '...' : ''}
        </p>

        {/* Prompt code block */}
        <div className="pt-4">
          <div className="mb-4 flex items-center gap-3">
            <div
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                hasAccess
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-amber-500/20 text-amber-400'
              }`}
            >
              <span className="text-[11px]">
                {hasAccess ? '✓' : '🔒'}
              </span>
            </div>
            <span className="text-sm font-medium text-white">
              Prompt Template
            </span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] ${
                hasAccess
                  ? 'border-green-500/20 bg-green-500/10 text-green-400'
                  : 'border-amber-500/20 bg-amber-500/10 text-amber-400'
              }`}
            >
              {hasAccess ? '1 prompt' : 'Locked'}
            </span>
          </div>

          <p className="mb-6 pl-9 text-xs text-zinc-500">
            {hasAccess
              ? 'คัดลอกและปรับแต่ง prompt ด้านล่างให้เหมาะกับบริบทของคุณ'
              : 'Upgrade to paid subscription to unlock this prompt'}
          </p>

          {hasAccess ? (
            /* Full access - show prompt text */
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40">
              <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 text-indigo-400">
                    <span className="text-sm">✧</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white">
                      Prompt Block #1
                    </h3>
                    <span className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-500">
                      <span>⇲</span> Template พร้อมใช้
                    </span>
                  </div>
                </div>

                <CopyButton text={promptText} size="sm" />
              </div>

              <div className="bg-black/40 p-5 font-mono text-sm leading-relaxed text-zinc-300">
                <pre className="whitespace-pre-wrap">{promptText}</pre>
              </div>
            </div>
          ) : (
            /* Locked - show blurred/locked prompt */
            <div className="group relative overflow-hidden rounded-2xl border border-amber-500/20 bg-black/40">
              <div className="flex items-center justify-between border-b border-amber-500/10 bg-amber-500/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-amber-400">
                      Prompt Locked
                    </h3>
                    <span className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-500">
                      <span>🔒</span> Upgrade required
                    </span>
                  </div>
                </div>
              </div>

              {/* Blurred prompt text */}
              <div className="relative bg-black/40 p-5">
                <div className="blur-md">
                  <div className="font-mono text-sm leading-relaxed text-zinc-300">
                    <pre className="whitespace-pre-wrap">
                      {promptText}
                    </pre>
                  </div>
                </div>
                {/* Lock overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="mb-2 flex justify-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
                        <svg
                          className="h-6 w-6 text-amber-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-amber-400">
                      Prompt locked
                    </p>
                    <p className="mt-1 text-[10px] text-zinc-500">
                      Upgrade to unlock
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upgrade CTA for locked prompts */}
          {!hasAccess && <UpgradeCTA />}
        </div>
      </section>

      {/* How to use section */}
      <section className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 shadow-xl shadow-black/40 backdrop-blur-2xl sm:p-8">
        <h2 className="mb-2 text-lg font-medium tracking-tight text-white">
          วิธีใช้ Prompt นี้
        </h2>
        <p className="mb-8 text-sm font-light text-zinc-500">
          ทำตามขั้นตอนง่ายๆ เหล่านี้เพื่อใช้ prompt ให้ได้ผลลัพธ์ที่ดีที่สุด
        </p>

        <div className="relative space-y-8">
          {/* Step 1 */}
          <div className="group flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-xs font-medium text-zinc-400 transition-colors duration-300 group-hover:bg-purple-600 group-hover:text-white">
              1
            </div>
            <div className="pt-1">
              <h3 className="mb-1 text-sm font-medium text-white">
                คัดลอก Prompt
              </h3>
              <p className="text-xs font-light leading-relaxed text-zinc-500">
                คลิกปุ่ม &quot;Copy&quot; เพื่อคัดลอก template ไปใช้งาน
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="group flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-xs font-medium text-zinc-400 transition-colors duration-300 group-hover:bg-purple-600 group-hover:text-white">
              2
            </div>
            <div className="pt-1">
              <h3 className="mb-1 text-sm font-medium text-white">
                แทนที่ตัวแปร
              </h3>
              <p className="text-xs font-light leading-relaxed text-zinc-500">
                แทนที่ข้อความใน [วงเล็บ] ด้วยข้อมูลจริงของคุณ
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="group flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-xs font-medium text-zinc-400 transition-colors duration-300 group-hover:bg-purple-600 group-hover:text-white">
              3
            </div>
            <div className="pt-1">
              <h3 className="mb-1 text-sm font-medium text-white">
                ปรับแต่งให้เหมาะ
              </h3>
              <p className="text-xs font-light leading-relaxed text-zinc-500">
                ปรับรายละเอียดเพิ่มเติมให้เหมาะกับบริบทและกลุ่มเป้าหมายของคุณ
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="group flex gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-800 text-xs font-medium text-zinc-400 transition-colors duration-300 group-hover:bg-purple-600 group-hover:text-white">
              4
            </div>
            <div className="pt-1">
              <h3 className="mb-1 text-sm font-medium text-white">
                ทดสอบและปรับปรุง
              </h3>
              <p className="text-xs font-light leading-relaxed text-zinc-500">
                ตรวจสอบผลลัพธ์และปรับแก้จนกว่าจะได้เนื้อหาที่โดนใจและมีประสิทธิภาพ
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/5 pt-8 text-center">
          <p className="mb-4 text-xs text-zinc-500">
            พร้อมสร้างเนื้อหาที่น่าสนใจแล้วหรือยัง?
          </p>
          <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-purple-900/40 transition-all hover:scale-105 hover:from-purple-500 hover:to-indigo-500 active:scale-95">
            <span>เริ่มใช้ Prompt เลย</span>
          </button>
        </div>
      </section>
    </article>
  );
}
