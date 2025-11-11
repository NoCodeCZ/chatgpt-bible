# Next.js Page Builder Integration Guide

## Overview

This guide shows how to integrate the Directus page management system with your Next.js frontend, following Agency OS patterns adapted for your ChatGPT Bible project.

---

## Architecture

```
User Request
    ↓
Next.js App Router (app/[...permalink]/page.tsx)
    ↓
Directus API Fetch (Server Component)
    ↓
Page Builder Component (renders blocks)
    ↓
Block Components (Hero, CTA, Features, etc.)
    ↓
Rendered HTML
```

---

## 1. Directus Client Setup

### `lib/directus.ts`

```typescript
import { createDirectus, rest, authentication } from '@directus/sdk';

// Define your schema types
interface Schema {
  pages: Page[];
  page_blocks: PageBlock[];
  block_hero: BlockHero[];
  block_cta: BlockCta[];
  block_features: BlockFeatures[];
  block_richtext: BlockRichtext[];
  block_form: BlockForm[];
  block_testimonials: BlockTestimonials[];
  prompts: Prompt[];
  categories: Category[];
  // ... other collections
}

// Initialize Directus client
const directus = createDirectus<Schema>(process.env.DIRECTUS_URL!)
  .with(rest())
  .with(authentication('json'));

export default directus;

// Type definitions
export interface Page {
  id: string;
  status: 'draft' | 'published' | 'archived';
  title: string;
  permalink: string;
  seo_title?: string;
  seo_description?: string;
  seo_image?: string;
  seo_canonical_url?: string;
  blocks?: PageBlock[];
  date_created: string;
  date_updated: string;
}

export interface PageBlock {
  id: number;
  pages_id: string;
  collection: string;
  item: any; // Polymorphic - contains the actual block data
  sort: number;
  hide_block: boolean;
}

export interface BlockHero {
  id: string;
  heading: string;
  subheading?: string;
  cta_text?: string;
  cta_link?: string;
  background_image?: string;
  text_align?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark';
}

export interface BlockCta {
  id: string;
  heading: string;
  description?: string;
  button_text: string;
  button_link: string;
  button_style?: 'primary' | 'secondary' | 'outline';
  background_color?: string;
}

export interface BlockFeatures {
  id: string;
  heading?: string;
  description?: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface BlockRichtext {
  id: string;
  content: string;
}

export interface BlockForm {
  id: string;
  heading: string;
  description?: string;
  form_fields: Array<{
    type: string;
    name: string;
    label: string;
    required: boolean;
    placeholder?: string;
  }>;
  submit_text: string;
  success_message: string;
  webhook_url?: string;
}

export interface BlockTestimonials {
  id: string;
  heading?: string;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    avatar_url?: string;
  }>;
}
```

---

## 2. Dynamic Page Route

### `app/[...permalink]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { readItems } from '@directus/sdk';
import directus, { Page } from '@/lib/directus';
import PageBuilder from '@/components/PageBuilder';
import { Metadata } from 'next';

interface PageProps {
  params: {
    permalink: string[];
  };
}

// Generate static paths for all published pages
export async function generateStaticParams() {
  const pages = await directus.request(
    readItems('pages', {
      filter: {
        status: { _eq: 'published' }
      },
      fields: ['permalink'],
    })
  );

  return pages.map((page) => ({
    permalink: page.permalink.split('/'),
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const permalink = params.permalink.join('/');

  const pages = await directus.request(
    readItems('pages', {
      filter: {
        permalink: { _eq: permalink },
        status: { _eq: 'published' }
      },
      limit: 1,
      fields: ['title', 'seo_title', 'seo_description', 'seo_image', 'seo_canonical_url'],
    })
  );

  const page = pages[0];
  if (!page) return {};

  return {
    title: page.seo_title || page.title,
    description: page.seo_description,
    openGraph: {
      title: page.seo_title || page.title,
      description: page.seo_description,
      images: page.seo_image ? [`${process.env.DIRECTUS_URL}/assets/${page.seo_image}`] : [],
    },
    alternates: {
      canonical: page.seo_canonical_url,
    },
  };
}

// Main page component (Server Component)
export default async function DynamicPage({ params }: PageProps) {
  const permalink = params.permalink.join('/');

  // Fetch page with all blocks
  const pages = await directus.request(
    readItems('pages', {
      filter: {
        permalink: { _eq: permalink },
        status: { _eq: 'published' }
      },
      limit: 1,
      fields: [
        '*',
        {
          blocks: [
            'id',
            'collection',
            'item:*', // Fetch all fields from related block items
            'sort',
            'hide_block'
          ]
        }
      ],
    })
  );

  const page = pages[0];

  if (!page) {
    notFound();
  }

  return (
    <main className="min-h-screen">
      <PageBuilder blocks={page.blocks || []} />
    </main>
  );
}
```

---

## 3. Page Builder Component

### `components/PageBuilder.tsx`

```typescript
import { PageBlock } from '@/lib/directus';
import HeroBlock from './blocks/HeroBlock';
import CtaBlock from './blocks/CtaBlock';
import FeaturesBlock from './blocks/FeaturesBlock';
import RichtextBlock from './blocks/RichtextBlock';
import FormBlock from './blocks/FormBlock';
import TestimonialsBlock from './blocks/TestimonialsBlock';

interface PageBuilderProps {
  blocks: PageBlock[];
}

// Map block collection names to components
const blockComponents: Record<string, React.ComponentType<any>> = {
  block_hero: HeroBlock,
  block_cta: CtaBlock,
  block_features: FeaturesBlock,
  block_richtext: RichtextBlock,
  block_form: FormBlock,
  block_testimonials: TestimonialsBlock,
};

export default function PageBuilder({ blocks }: PageBuilderProps) {
  // Filter hidden blocks and sort by order
  const visibleBlocks = blocks
    .filter((block) => !block.hide_block)
    .sort((a, b) => (a.sort || 0) - (b.sort || 0));

  return (
    <>
      {visibleBlocks.map((block) => {
        const Component = blockComponents[block.collection];

        if (!Component) {
          console.warn(`Unknown block type: ${block.collection}`);
          return null;
        }

        return (
          <Component
            key={block.id}
            {...block.item}
          />
        );
      })}
    </>
  );
}
```

---

## 4. Block Components

### `components/blocks/HeroBlock.tsx`

```typescript
import Image from 'next/image';
import Link from 'next/link';
import { BlockHero } from '@/lib/directus';

export default function HeroBlock({
  heading,
  subheading,
  cta_text,
  cta_link,
  background_image,
  text_align = 'center',
  theme = 'light',
}: BlockHero) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[text_align];

  const themeClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900';

  return (
    <section className={`relative py-20 ${themeClass}`}>
      {background_image && (
        <Image
          src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${background_image}`}
          alt=""
          fill
          className="object-cover opacity-20"
          priority
        />
      )}

      <div className={`container mx-auto px-4 relative z-10 ${alignClass}`}>
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {heading}
        </h1>

        {subheading && (
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            {subheading}
          </p>
        )}

        {cta_text && cta_link && (
          <Link
            href={cta_link}
            className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
          >
            {cta_text}
          </Link>
        )}
      </div>
    </section>
  );
}
```

### `components/blocks/CtaBlock.tsx`

```typescript
import Link from 'next/link';
import { BlockCta } from '@/lib/directus';

export default function CtaBlock({
  heading,
  description,
  button_text,
  button_link,
  button_style = 'primary',
  background_color,
}: BlockCta) {
  const buttonStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
  }[button_style];

  return (
    <section
      className="py-16"
      style={background_color ? { backgroundColor: background_color } : undefined}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          {heading}
        </h2>

        {description && (
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            {description}
          </p>
        )}

        <Link
          href={button_link}
          className={`inline-block px-8 py-4 rounded-lg text-lg font-semibold transition ${buttonStyles}`}
        >
          {button_text}
        </Link>
      </div>
    </section>
  );
}
```

### `components/blocks/FeaturesBlock.tsx`

```typescript
import { BlockFeatures } from '@/lib/directus';

export default function FeaturesBlock({
  heading,
  description,
  features,
}: BlockFeatures) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {heading && (
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            {heading}
          </h2>
        )}

        {description && (
          <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-4xl mb-4">
                <span className="material-icons">{feature.icon}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### `components/blocks/RichtextBlock.tsx`

```typescript
import { BlockRichtext } from '@/lib/directus';

export default function RichtextBlock({ content }: BlockRichtext) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </section>
  );
}
```

---

## 5. Usage Examples

### Creating a Landing Page

1. **In Directus Admin:**
   - Create new page: `pages` collection
   - Set permalink: `"home"` or `""` (for root)
   - Set status: `published`
   - Add blocks in order:
     - Hero block (headline, CTA)
     - Features block (key benefits)
     - CTA block (subscribe prompt)
     - Testimonials block

2. **Accessing the Page:**
   - URL: `https://yoursite.com/home`
   - Or set as homepage in Next.js config

### Creating an About Page

```typescript
// In Directus:
{
  "title": "About ChatGPT Bible",
  "permalink": "about",
  "blocks": [
    {
      "collection": "block_hero",
      "item": {
        "heading": "About Us",
        "subheading": "Your prompt library for professional success"
      }
    },
    {
      "collection": "block_richtext",
      "item": {
        "content": "<p>Founded in 2024...</p>"
      }
    }
  ]
}
```

---

## 6. Integration with Prompts

You can also create dynamic pages for prompts:

### `app/prompts/[slug]/page.tsx`

```typescript
import { readItems } from '@directus/sdk';
import directus from '@/lib/directus';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const prompts = await directus.request(
    readItems('prompts', {
      filter: { status: { _eq: 'published' } },
      fields: ['id'],
    })
  );

  return prompts.map((prompt) => ({
    slug: prompt.id.toString(),
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const prompts = await directus.request(
    readItems('prompts', {
      filter: { id: { _eq: parseInt(params.slug) } },
      limit: 1,
      fields: ['title_en', 'title_th', 'meta_description_en', 'meta_description_th', 'og_image'],
    })
  );

  const prompt = prompts[0];
  if (!prompt) return {};

  return {
    title: prompt.meta_title_en || prompt.title_en,
    description: prompt.meta_description_en,
    openGraph: {
      images: prompt.og_image ? [`${process.env.DIRECTUS_URL}/assets/${prompt.og_image}`] : [],
    },
  };
}

export default async function PromptPage({ params }: { params: { slug: string } }) {
  const prompts = await directus.request(
    readItems('prompts', {
      filter: { id: { _eq: parseInt(params.slug) } },
      limit: 1,
      fields: ['*'],
    })
  );

  const prompt = prompts[0];
  if (!prompt) notFound();

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{prompt.title_en}</h1>
      <p className="text-lg mb-8">{prompt.description}</p>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Prompt:</h2>
        <pre className="whitespace-pre-wrap">{prompt.prompt_text}</pre>
      </div>
    </main>
  );
}
```

---

## 7. Best Practices

### 1. **Caching Strategy**

```typescript
// Use Next.js caching for static pages
export const revalidate = 3600; // Revalidate every hour

// Or use on-demand revalidation via webhook
```

### 2. **Error Boundaries**

```typescript
// app/[...permalink]/error.tsx
'use client';

export default function Error({ error }: { error: Error }) {
  return (
    <div className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold mb-4">Oops! Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}
```

### 3. **Loading States**

```typescript
// app/[...permalink]/loading.tsx
export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="animate-pulse">
        <div className="h-12 bg-gray-200 rounded mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}
```

### 4. **Type Safety**

Always use TypeScript interfaces matching your Directus schema. Use the Directus SDK's type generation:

```bash
npx directus-sdk-ts generate
```

---

## Summary

This integration gives you:

✅ **Dynamic Page Management** - Create pages without code
✅ **Reusable Blocks** - Mix and match content components
✅ **SEO Optimized** - Full meta tag control
✅ **Type Safe** - Full TypeScript support
✅ **Performance** - Static generation + ISR
✅ **Flexible** - Easy to add new block types

Next steps: Create the collections in Directus and start building pages!
