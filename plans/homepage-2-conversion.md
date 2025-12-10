# Implementation Plan: Homepage 2 Conversion

## Overview

Convert `generated-page (10).html` to a Next.js page integrated with Directus page builder. The HTML contains a Thai language landing page for "Ultimate AIGC Affiliate System" with multiple sections that need to be converted to reusable block components.

**Route**: `/homepage-2`

## Research Summary

- HTML uses Tailwind CSS via CDN
- Contains 11 main sections: Navigation, Hero, Pain Points, Promise, Timeline, Results, Packages, Registration, FAQ, Warning, Footer
- Most sections can use existing blocks (Hero, Pricing, Testimonials, FAQ, Footer)
- Need 3 new block types: PainPointsBlock, TimelineBlock, RegistrationBlock
- Uses Iconify for icons
- Dark theme with glass morphism effects

## Tasks

### Task 1: Add New Block Type Interfaces

**File**: `chatgpt-bible-frontend/types/blocks.ts`
**Lines**: After line 163 (after FAQBlock interface)

**BEFORE**:
```typescript
export interface FAQBlock extends BaseBlockMeta {
  heading?: string;
  description?: string;
  faqs: FAQItem[];
  theme?: 'light' | 'dark';
}

// Footer Block
```

**AFTER**:
```typescript
export interface FAQBlock extends BaseBlockMeta {
  heading?: string;
  description?: string;
  faqs: FAQItem[];
  theme?: 'light' | 'dark';
}

// Pain Points Block
export interface PainPoint {
  icon?: string;
  title: string;
  description: string;
}

export interface PainPointsBlock extends BaseBlockMeta {
  heading?: string;
  description?: string;
  pain_points: PainPoint[];
  transition_text?: string;
  theme?: 'light' | 'dark';
}

// Timeline Block
export interface TimelineItem {
  year: string;
  title: string;
  description: string;
  color?: 'red' | 'amber' | 'emerald';
}

export interface TimelineBlock extends BaseBlockMeta {
  heading?: string;
  description?: string;
  timeline_items: TimelineItem[];
  price_anchor_text?: string;
  price_anchor_time?: string;
  price_anchor_cost?: string;
  theme?: 'light' | 'dark';
}

// Registration Block (Line-specific)
export interface BonusItem {
  icon?: string;
  title: string;
  value: string;
}

export interface RegistrationBlock extends BaseBlockMeta {
  heading?: string;
  description?: string;
  steps?: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  line_id?: string;
  line_qr_code?: string; // UUID of QR code image
  line_url?: string;
  bonuses?: BonusItem[];
  future_pacing_text?: string;
  theme?: 'light' | 'dark';
}

// Footer Block
```

**Notes**: All new blocks extend BaseBlockMeta, use optional fields where appropriate, match Directus field naming (snake_case).

---

### Task 2: Update Block Union Type

**File**: `chatgpt-bible-frontend/types/blocks.ts`
**Lines**: Line 186-196 (Block union type)

**BEFORE**:
```typescript
export type Block =
  | HeroBlock
  | CTABlock
  | FeaturesBlock
  | RichTextBlock
  | FormBlock
  | TestimonialsBlock
  | PromptsGridBlock
  | PricingBlock
  | FAQBlock
  | FooterBlock;
```

**AFTER**:
```typescript
export type Block =
  | HeroBlock
  | CTABlock
  | FeaturesBlock
  | RichTextBlock
  | FormBlock
  | TestimonialsBlock
  | PromptsGridBlock
  | PricingBlock
  | FAQBlock
  | PainPointsBlock
  | TimelineBlock
  | RegistrationBlock
  | FooterBlock;
```

**Notes**: Maintain alphabetical order for maintainability.

---

### Task 3: Update PageBlock Collection Union

**File**: `chatgpt-bible-frontend/types/blocks.ts`
**Lines**: Line 202 (PageBlock interface)

**BEFORE**:
```typescript
export interface PageBlock {
  id: number;
  pages_id: number;
  collection: 'block_hero' | 'block_cta' | 'block_features' | 'block_richtext' | 'block_form' | 'block_testimonials' | 'block_prompts_grid' | 'block_pricing' | 'block_faq' | 'block_footer';
  item: string; // UUID of the block
  sort: number;
  hide_block: boolean;
}
```

**AFTER**:
```typescript
export interface PageBlock {
  id: number;
  pages_id: number;
  collection: 'block_hero' | 'block_cta' | 'block_features' | 'block_richtext' | 'block_form' | 'block_testimonials' | 'block_prompts_grid' | 'block_pricing' | 'block_faq' | 'block_pain_points' | 'block_timeline' | 'block_registration' | 'block_footer';
  item: string; // UUID of the block
  sort: number;
  hide_block: boolean;
}
```

**Notes**: Add new collection names to union type.

---

### Task 4: Create PainPointsBlock Component

**File**: `chatgpt-bible-frontend/components/blocks/PainPointsBlock.tsx`
**Lines**: New file

**AFTER**:
```typescript
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
```

**Notes**: Uses glass-panel class (defined in globals.css), handles empty states, responsive grid.

---

### Task 5: Create TimelineBlock Component

**File**: `chatgpt-bible-frontend/components/blocks/TimelineBlock.tsx`
**Lines**: New file

**AFTER**:
```typescript
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

  const colorClasses = {
    red: 'bg-red-500 border-red-500/30 text-red-400',
    amber: 'bg-amber-500 border-amber-500/30 text-amber-400',
    emerald: 'bg-emerald-500 border-emerald-500/30 text-emerald-400',
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
              const colorClass = colorClasses[item.color || 'red'];

              return (
                <div
                  key={index}
                  className="relative flex flex-col md:flex-row items-start gap-4 md:gap-8"
                >
                  {isEven ? (
                    <>
                      <div className="md:w-1/2 md:text-right md:pr-12 pl-12 md:pl-0">
                        <div className={`glass-panel p-4 sm:p-6 rounded-xl border ${colorClass.split(' ')[2]}/30`}>
                          <div className={`text-sm font-semibold mb-2 ${colorClass.split(' ')[2]}`}>
                            {item.year}
                          </div>
                          <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                          <p className="text-sm text-slate-400">{item.description}</p>
                        </div>
                      </div>
                      <div className={`absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 ${colorClass.split(' ')[0]} rounded-full border-4 border-zinc-950`}></div>
                      <div className="md:w-1/2"></div>
                    </>
                  ) : (
                    <>
                      <div className="md:w-1/2"></div>
                      <div className={`absolute left-4 md:left-1/2 w-4 h-4 -translate-x-1/2 ${colorClass.split(' ')[0]} rounded-full border-4 border-zinc-950`}></div>
                      <div className="md:w-1/2 md:pl-12 pl-12">
                        <div className={`glass-panel p-4 sm:p-6 rounded-xl border ${colorClass.split(' ')[2]}/30`}>
                          <div className={`text-sm font-semibold mb-2 ${colorClass.split(' ')[2]}`}>
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
```

**Notes**: Handles alternating timeline layout, color coding, responsive design.

---

### Task 6: Create RegistrationBlock Component

**File**: `chatgpt-bible-frontend/components/blocks/RegistrationBlock.tsx`
**Lines**: New file

**AFTER**:
```typescript
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
```

**Notes**: Client component for interactivity, handles Line integration, QR code display.

---

### Task 7: Register New Blocks in BlockRenderer

**File**: `chatgpt-bible-frontend/components/blocks/BlockRenderer.tsx`
**Lines**: After line 11 (imports), and after line 57 (before default case)

**BEFORE** (imports):
```typescript
import HeroBlock from './HeroBlock';
import FeaturesBlock from './FeaturesBlock';
import CTABlock from './CTABlock';
import RichTextBlock from './RichTextBlock';
import FormBlock from './FormBlock';
import TestimonialsBlock from './TestimonialsBlock';
import PromptsGridBlock from './PromptsGridBlock';
import PricingBlock from './PricingBlock';
import FAQBlock from './FAQBlock';
import FooterBlock from './FooterBlock';
```

**AFTER** (imports):
```typescript
import HeroBlock from './HeroBlock';
import FeaturesBlock from './FeaturesBlock';
import CTABlock from './CTABlock';
import RichTextBlock from './RichTextBlock';
import FormBlock from './FormBlock';
import TestimonialsBlock from './TestimonialsBlock';
import PromptsGridBlock from './PromptsGridBlock';
import PricingBlock from './PricingBlock';
import FAQBlock from './FAQBlock';
import PainPointsBlock from './PainPointsBlock';
import TimelineBlock from './TimelineBlock';
import RegistrationBlock from './RegistrationBlock';
import FooterBlock from './FooterBlock';
```

**BEFORE** (switch cases):
```typescript
    case 'block_faq':
      return <FAQBlock data={block.data as any} />;

    case 'block_footer':
      return <FooterBlock data={block.data as any} />;

    default:
```

**AFTER** (switch cases):
```typescript
    case 'block_faq':
      return <FAQBlock data={block.data as any} />;

    case 'block_pain_points':
      return <PainPointsBlock data={block.data as any} />;

    case 'block_timeline':
      return <TimelineBlock data={block.data as any} />;

    case 'block_registration':
      return <RegistrationBlock data={block.data as any} />;

    case 'block_footer':
      return <FooterBlock data={block.data as any} />;

    default:
```

**Notes**: Add cases in alphabetical order, use `as any` for type assertion.

---

### Task 8: Export New Blocks from Index

**File**: `chatgpt-bible-frontend/components/blocks/index.ts`
**Lines**: After existing exports

**BEFORE**:
```typescript
export { default as BlockRenderer } from './BlockRenderer';
// Add other exports as needed
```

**AFTER**:
```typescript
export { default as BlockRenderer } from './BlockRenderer';
export { default as HeroBlock } from './HeroBlock';
export { default as FeaturesBlock } from './FeaturesBlock';
export { default as CTABlock } from './CTABlock';
export { default as RichTextBlock } from './RichTextBlock';
export { default as FormBlock } from './FormBlock';
export { default as TestimonialsBlock } from './TestimonialsBlock';
export { default as PromptsGridBlock } from './PromptsGridBlock';
export { default as PricingBlock } from './PricingBlock';
export { default as FAQBlock } from './FAQBlock';
export { default as PainPointsBlock } from './PainPointsBlock';
export { default as TimelineBlock } from './TimelineBlock';
export { default as RegistrationBlock } from './RegistrationBlock';
export { default as FooterBlock } from './FooterBlock';
```

**Notes**: Export all blocks for potential direct imports.

---

### Task 9: Add Glass Panel CSS Utility

**File**: `chatgpt-bible-frontend/app/globals.css`
**Lines**: After existing Tailwind directives

**AFTER** (add to existing CSS):
```css
/* Glass morphism utility */
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.glow-green {
  box-shadow: 0 0 40px rgba(16, 185, 129, 0.3);
}

.glow-blue {
  box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
}
```

**Notes**: These utilities are used in the HTML and needed for the new blocks.

---

### Task 10: Add Iconify Script to Layout

**File**: `chatgpt-bible-frontend/app/layout.tsx`
**Lines**: In the `<head>` section

**BEFORE**:
```typescript
<head>
  {/* existing head content */}
</head>
```

**AFTER**:
```typescript
<head>
  {/* existing head content */}
  <script src="https://code.iconify.design/3/3.1.0/iconify.min.js" async></script>
</head>
```

**Notes**: Iconify is used for icons in the blocks. Load asynchronously.

---

## Complete Chain Checklist

- [x] TypeScript Interfaces (types/blocks.ts) - Tasks 1-3
- [x] Block Components (components/blocks/) - Tasks 4-6
- [x] BlockRenderer Registration - Task 7
- [x] Index Exports - Task 8
- [x] CSS Utilities - Task 9
- [x] Iconify Script - Task 10
- [ ] Directus Collections (manual setup) - See checklist below
- [ ] Validation (npm run build)

## Directus Setup Checklist

### Collection: `block_pain_points`
- [ ] Create collection with UUID primary key
- [ ] Add fields:
  - `heading` (string, optional)
  - `description` (text, optional)
  - `pain_points` (JSON, required) - Array of { icon, title, description }
  - `transition_text` (text, optional)
  - `theme` (string, enum: 'light'|'dark', default: 'dark')
  - `status` (string, enum: 'draft'|'published', default: 'draft')
- [ ] Set permissions (Public: read, Admin: full)
- [ ] Add to `page_blocks` M2A junction

### Collection: `block_timeline`
- [ ] Create collection with UUID primary key
- [ ] Add fields:
  - `heading` (string, optional)
  - `description` (text, optional)
  - `timeline_items` (JSON, required) - Array of { year, title, description, color }
  - `price_anchor_text` (text, optional)
  - `price_anchor_time` (string, optional)
  - `price_anchor_cost` (string, optional)
  - `theme` (string, enum: 'light'|'dark', default: 'dark')
  - `status` (string, enum: 'draft'|'published', default: 'draft')
- [ ] Set permissions (Public: read, Admin: full)
- [ ] Add to `page_blocks` M2A junction

### Collection: `block_registration`
- [ ] Create collection with UUID primary key
- [ ] Add fields:
  - `heading` (string, optional)
  - `description` (text, optional)
  - `steps` (JSON, optional) - Array of { number, title, description }
  - `line_id` (string, optional)
  - `line_qr_code` (uuid, file-image, optional)
  - `line_url` (string, optional)
  - `bonuses` (JSON, optional) - Array of { icon, title, value }
  - `future_pacing_text` (text, optional)
  - `theme` (string, enum: 'light'|'dark', default: 'dark')
  - `status` (string, enum: 'draft'|'published', default: 'draft')
- [ ] Set permissions (Public: read, Admin: full)
- [ ] Add to `page_blocks` M2A junction

### Page Setup
- [ ] Create page in Directus:
  - `title`: "Homepage 2"
  - `permalink`: "/homepage-2"
  - `status`: "published"
  - `page_type`: "marketing"
- [ ] Add blocks in order:
  1. Hero Block (enhanced with stats)
  2. Pain Points Block
  3. Promise Section (use RichTextBlock or CTABlock)
  4. Timeline Block
  5. Results Section (TestimonialsBlock + stats)
  6. Pricing Block
  7. Registration Block
  8. FAQ Block
  9. Final Warning (CTABlock)
  10. Footer Block

## Validation Steps

1. `npm run lint` - Check for linting errors
2. `npx tsc --noEmit` - Verify TypeScript compiles
3. `npm run build` - Ensure build succeeds
4. Test page renders at `/homepage-2`
5. Verify all blocks display correctly
6. Check responsive design on mobile/tablet/desktop

## Notes

- Iconify icons use `data-icon` attribute - ensure script loads before blocks render
- Glass panel effects require backdrop-filter support
- Timeline alternates left/right on desktop, stacks on mobile
- Registration block is client component for potential form interactions
- All blocks support dark/light theme switching
- JSON fields in Directus store arrays of objects
