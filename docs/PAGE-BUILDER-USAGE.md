# Page Builder - Next.js Implementation Guide

## Overview

The Next.js page builder is now fully implemented! You can create dynamic pages in Directus and they'll automatically render on your Next.js frontend.

## 🎯 What's Included

### Components Created

**Block Components** (`/components/blocks/`)
- ✅ `HeroBlock.tsx` - Hero sections with heading, subheading, CTA, and background
- ✅ `FeaturesBlock.tsx` - Feature grids with icons
- ✅ `CTABlock.tsx` - Call-to-action sections
- ✅ `RichTextBlock.tsx` - Rich HTML content
- ✅ `FormBlock.tsx` - Dynamic forms with validation
- ✅ `TestimonialsBlock.tsx` - Customer testimonials with ratings
- ✅ `BlockRenderer.tsx` - Main renderer that switches between block types
- ✅ `index.ts` - Export barrel for easy imports

**Utilities** (`/lib/`)
- ✅ `directus-pages.ts` - Functions to fetch pages and blocks

**Types** (`/types/`)
- ✅ `blocks.ts` - TypeScript types for all blocks and pages

**Routes** (`/app/`)
- ✅ `(pages)/[...slug]/page.tsx` - Dynamic route for all pages
- ✅ `(pages)/layout.tsx` - Layout wrapper

## 🚀 How It Works

### 1. Create Pages in Directus

**Option A: Via Directus Admin UI**
1. Go to Content → pages → Create Item
2. Fill in page details:
   - Title: "Contact Us"
   - Permalink: "/contact"
   - Page Type: Contact Page
   - Status: Published
3. Save the page

**Option B: Via MCP/API**
```typescript
await directus.items('pages').createOne({
  title: 'Contact Us',
  permalink: '/contact',
  page_type: 'contact',
  status: 'published',
  seo_title: 'Contact Us - ChatGPT Bible',
  seo_description: 'Get in touch with our team',
});
```

### 2. Add Blocks to Pages

**Create blocks first:**
```typescript
// Create a hero block
const heroBlock = await directus.items('block_hero').createOne({
  heading: 'Get in Touch',
  subheading: 'We\'d love to hear from you',
  theme: 'light',
});
```

**Link blocks to pages via page_blocks:**
```typescript
await directus.items('page_blocks').createOne({
  pages_id: 4, // Contact page ID
  collection: 'block_hero',
  item: heroBlock.id,
  sort: 1,
  hide_block: false,
});
```

### 3. Pages Automatically Render

Visit the page in your browser:
- Homepage: `http://localhost:3000/`
- About: `http://localhost:3000/about`
- Contact: `http://localhost:3000/contact`

The Next.js app will:
1. Fetch the page from Directus
2. Fetch all blocks linked to that page
3. Fetch the data for each block
4. Render blocks in order using `BlockRenderer`

## 📊 Current Sample Pages

### Homepage (/)
**Blocks:**
1. Hero - "Transform Your Workflow with ChatGPT Bible"
2. Features - 4 features (Role-Specific, Instant Copy, Organized, Updates)
3. CTA - "Ready to Level Up Your ChatGPT Game?"

**Preview:** http://localhost:3000/

### About Page (/about)
**Blocks:**
1. Rich Text - Mission statement

**Preview:** http://localhost:3000/about

## 🎨 Customizing Blocks

Each block component is fully customizable with Tailwind CSS.

### Example: Customize HeroBlock

Edit `/components/blocks/HeroBlock.tsx`:

```tsx
// Change button style
className={`inline-block px-8 py-4 text-lg font-semibold rounded-lg
  ${theme === 'dark'
    ? 'bg-blue-600 text-white hover:bg-blue-700' // Changed!
    : 'bg-gray-900 text-white hover:bg-gray-800'
  }`}
```

### Example: Add Animation to FeaturesBlock

```tsx
// Add hover animation
<div className="bg-white rounded-lg p-6 shadow-sm
  hover:shadow-md hover:scale-105 transition-all duration-200">
```

## 🔧 Advanced Usage

### Fetch Specific Page in API Route

```typescript
// app/api/pages/[permalink]/route.ts
import { getPageWithBlocks } from '@/lib/directus-pages';

export async function GET(
  request: Request,
  { params }: { params: { permalink: string } }
) {
  const page = await getPageWithBlocks(`/${params.permalink}`);

  if (!page) {
    return Response.json({ error: 'Page not found' }, { status: 404 });
  }

  return Response.json(page);
}
```

### Client-Side Block Fetching (SWR)

```tsx
'use client';

import useSWR from 'swr';

function usePage(permalink: string) {
  return useSWR(`/api/pages${permalink}`, fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000, // 5 minutes
  });
}

export default function ClientPage({ permalink }: { permalink: string }) {
  const { data, error, isLoading } = usePage(permalink);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading page</div>;

  return (
    <div>
      {data.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </div>
  );
}
```

### Adding New Block Types

1. **Create the Directus collection:**
   ```sql
   -- Example: block_pricing
   CREATE TABLE block_pricing (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     heading TEXT NOT NULL,
     price DECIMAL(10, 2) NOT NULL,
     features JSONB,
     date_created TIMESTAMP DEFAULT NOW()
   );
   ```

2. **Add TypeScript type:**
   ```typescript
   // types/blocks.ts
   export interface PricingBlock extends BaseBlockMeta {
     heading: string;
     price: number;
     features: string[];
   }
   ```

3. **Create component:**
   ```tsx
   // components/blocks/PricingBlock.tsx
   export default function PricingBlock({ data }: { data: PricingBlock }) {
     // Your component JSX
   }
   ```

4. **Add to BlockRenderer:**
   ```tsx
   // components/blocks/BlockRenderer.tsx
   case 'block_pricing':
     return <PricingBlock data={block.data as PricingBlock} />;
   ```

## 📱 Responsive Design

All blocks are fully responsive using Tailwind's breakpoints:

- **Mobile First:** Base styles for 360px+
- **sm:** 640px (small tablets)
- **md:** 768px (tablets)
- **lg:** 1024px (desktops)
- **xl:** 1440px (large screens)

Example from HeroBlock:
```tsx
<h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
  {heading}
</h1>
```

## 🎯 SEO Optimization

Every page automatically generates:

- **Title tags** from `seo_title` or `title`
- **Meta descriptions** from `seo_description`
- **Open Graph tags** for social sharing
- **Structured permalinks** for clean URLs

**Generated metadata example:**
```html
<title>Home - ChatGPT Bible</title>
<meta name="description" content="Access 100+ curated ChatGPT prompts...">
<meta property="og:title" content="ChatGPT Bible - Professional Prompt Library">
<meta property="og:image" content="https://directus.../assets/...">
```

## 🔄 Static Generation & ISR

Pages use **Incremental Static Regeneration (ISR)**:

- Pages are generated at build time
- Cached for 60 seconds
- Auto-regenerate on the next request after cache expires

**Configure revalidation:**
```tsx
// app/(pages)/[...slug]/page.tsx
export const revalidate = 60; // Change to 300 for 5 minutes
```

## 🧪 Testing Your Pages

### 1. Start Dev Server
```bash
cd chargpt-bible-frontend
npm run dev
```

### 2. Visit Pages
- http://localhost:3000/ (Homepage)
- http://localhost:3000/about (About)

### 3. Check Block Rendering
Open browser dev tools and verify:
- ✓ Blocks render in correct order (sorted)
- ✓ Hidden blocks don't appear
- ✓ Images load from Directus
- ✓ Links work correctly

## 🐛 Troubleshooting

### "Page not found" error
**Cause:** Page doesn't exist or isn't published
**Fix:** Check Directus → pages → Ensure status is "published"

### Blocks not rendering
**Cause:** No blocks linked to page
**Fix:** Check Directus → page_blocks → Create links between pages and blocks

### TypeScript errors
**Cause:** Type mismatches
**Fix:** Run `npm run type-check` and fix errors

### Styles not applying
**Cause:** Tailwind not configured
**Fix:** Ensure Tailwind is installed and `tailwind.config.ts` includes content paths:
```ts
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
],
```

## 📦 Build & Deploy

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
vercel --prod
```

Pages will be statically generated at build time for optimal performance!

## 🎉 Next Steps

1. **Add more pages:**
   - Pricing page with pricing blocks
   - Blog listing page
   - Contact page with form block

2. **Enhance components:**
   - Add animations with Framer Motion
   - Add lazy loading for images
   - Add loading states

3. **Optimize performance:**
   - Implement image optimization
   - Add caching headers
   - Use Next.js Image component everywhere

4. **Add navigation:**
   - Create header/footer components
   - Fetch menu items from Directus
   - Add breadcrumbs

## 🔗 Resources

- [Next.js App Router](https://nextjs.org/docs/app)
- [Directus SDK](https://docs.directus.io/guides/sdk/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs/)

---

**The page builder is ready to use! Start creating pages in Directus and watch them appear on your Next.js frontend.** 🚀
