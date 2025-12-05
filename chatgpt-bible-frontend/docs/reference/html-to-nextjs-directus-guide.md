# HTML to Next.js + Directus Conversion Reference

**Purpose:** Convert static HTML files to Next.js components and integrate dynamic content with Directus CMS. Extract content from HTML into Directus collections for easy management.

## Overall Pattern

```
Analyze HTML → Extract Content → Create Directus Collection → Define Types → Create Component → Integrate with Page Builder
```

## Step 1: Analyze HTML Structure

```html
<!-- example.html -->
<!DOCTYPE html>
<html>
<head>
  <title>About Us</title>
  <style>
    .hero { background: #1a1a1a; color: white; padding: 80px 20px; }
    .container { max-width: 1200px; margin: 0 auto; }
  </style>
</head>
<body>
  <section class="hero">
    <div class="container">
      <h1>Welcome to Our Company</h1>
      <p>We create amazing products</p>
      <a href="/contact" class="btn">Get Started</a>
    </div>
  </section>
  
  <section class="features">
    <div class="container">
      <h2>Our Features</h2>
      <div class="feature-grid">
        <div class="feature-item">
          <h3>Feature 1</h3>
          <p>Description of feature 1</p>
        </div>
        <div class="feature-item">
          <h3>Feature 2</h3>
          <p>Description of feature 2</p>
        </div>
      </div>
    </div>
  </section>
</body>
</html>
```

**Analysis Checklist:**
- [ ] Identify reusable sections (hero, features, testimonials, etc.)
- [ ] Identify static vs dynamic content (hardcoded text → Directus fields)
- [ ] Note CSS classes and inline styles (convert to Tailwind)
- [ ] Identify images (move to Directus file fields)
- [ ] Identify links (make configurable)
- [ ] Note responsive breakpoints

**Rules:** Break HTML into logical sections that map to Directus blocks, separate content from presentation, identify what should be editable in CMS.

## Step 2: Extract Content and Create Directus Collection

**For each section, create a block collection:**

```typescript
// Example: Converting hero section to Directus collection

// Directus Admin: Create Collection "block_hero"
Fields:
- id (UUID, primary key)
- heading (string, required) → "Welcome to Our Company"
- subheading (string, optional) → "We create amazing products"
- cta_text (string, optional) → "Get Started"
- cta_link (string, optional) → "/contact"
- background_image (uuid, file-image, optional)
- text_align (string, select: left/center/right) → "left"
- theme (string, select: light/dark) → "dark"
- status (string, select: draft/published)
```

**Rules:** Use `block_*` prefix for page blocks, snake_case field names, extract all text content as fields, use file fields for images, add theme/alignment options.

## Step 3: Define TypeScript Types

```typescript
// types/blocks.ts
export interface HeroBlock extends BaseBlockMeta {
  heading: string;
  subheading?: string;
  cta_text?: string;
  cta_link?: string;
  background_image?: string; // UUID from Directus
  text_align?: 'left' | 'center' | 'right';
  theme?: 'light' | 'dark';
}

// Update Block union type
export type Block = HeroBlock | CTABlock | FeaturesBlock | HeroBlock;
```

**Rules:** Match Directus field names exactly, use optional `?` for non-required fields, extend `BaseBlockMeta` for blocks, add to Block union type.

## Step 4: Convert HTML to React Component

**Before (HTML):**
```html
<section class="hero">
  <div class="container">
    <h1>Welcome to Our Company</h1>
    <p>We create amazing products</p>
    <a href="/contact" class="btn">Get Started</a>
  </div>
</section>
```

**After (React + Tailwind):**
```typescript
// components/blocks/HeroBlock.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { HeroBlock as HeroBlockType } from '@/types/blocks';

interface HeroBlockProps {
  data: HeroBlockType;
}

export default function HeroBlock({ data }: HeroBlockProps) {
  const {
    heading,
    subheading,
    cta_text,
    cta_link,
    background_image,
    text_align = 'left',
    theme = 'dark',
  } = data;

  const textAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[text_align];

  const themeClasses = {
    dark: 'bg-gray-900 text-white',
    light: 'bg-white text-gray-900',
  }[theme];

  return (
    <section className={`py-20 px-4 ${themeClasses}`}>
      <div className="max-w-7xl mx-auto">
        {background_image && (
          <div className="absolute inset-0 -z-10">
            <Image
              src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${background_image}`}
              alt={heading}
              fill
              className="object-cover opacity-20"
            />
          </div>
        )}
        <div className={textAlignClass}>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{heading}</h1>
          {subheading && (
            <p className="text-lg md:text-xl mb-8 opacity-90">{subheading}</p>
          )}
          {cta_text && cta_link && (
            <Link
              href={cta_link}
              className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {cta_text}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
```

**CSS Conversion Rules:**
- `.hero` → `section` with Tailwind padding/spacing classes
- `.container` → `max-w-7xl mx-auto` (or `container mx-auto`)
- Inline styles → Tailwind utilities
- Media queries → Tailwind responsive prefixes (`md:`, `lg:`)
- Colors → Tailwind color palette
- Remove `<style>` tags entirely

## Step 5: Handle Complex Sections (Features Grid)

**HTML:**
```html
<section class="features">
  <h2>Our Features</h2>
  <div class="feature-grid">
    <div class="feature-item">
      <h3>Feature 1</h3>
      <p>Description</p>
    </div>
  </div>
</section>
```

**Directus Collection:**
```typescript
// Collection: block_features
Fields:
- id (UUID)
- heading (string) → "Our Features"
- description (text, optional)
- items (JSON) → Array of { title, description, icon }
- columns (integer) → 3
- status (string)
```

**Component:**
```typescript
// components/blocks/FeaturesBlock.tsx
import type { FeaturesBlock as FeaturesBlockType } from '@/types/blocks';

interface FeaturesBlockProps {
  data: FeaturesBlockType;
}

export default function FeaturesBlock({ data }: FeaturesBlockProps) {
  const { heading, description, items = [], columns = 3 } = data;

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-3';

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {heading && (
          <h2 className="text-3xl font-bold text-center mb-4">{heading}</h2>
        )}
        {description && (
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {description}
          </p>
        )}
        <div className={`grid ${gridCols} gap-6`}>
          {items.map((item, index) => (
            <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
              {item.icon && (
                <div className="w-12 h-12 mb-4 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{item.icon}</span>
                </div>
              )}
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

**Rules:** Use JSON field for arrays of objects, provide default values, handle empty states, use responsive grid classes, map over arrays with stable keys.

## Step 6: Convert Images and Assets

**Before:**
```html
<img src="/images/hero-bg.jpg" alt="Background" />
```

**After:**
```typescript
// In Directus: background_image field (uuid, file-image)

// In Component:
import Image from 'next/image';

{background_image && (
  <Image
    src={`${process.env.NEXT_PUBLIC_DIRECTUS_URL}/assets/${background_image}`}
    alt={heading}
    width={1200}
    height={600}
    className="object-cover"
  />
)}
```

**Rules:** Upload images to Directus Files, store UUID in collection field, use Next.js `Image` component, prefix with Directus URL, provide alt text, use `fill` for background images.

## Step 7: Handle Forms

**HTML Form:**
```html
<form action="/api/contact" method="POST">
  <input type="text" name="name" placeholder="Name" required />
  <input type="email" name="email" placeholder="Email" required />
  <textarea name="message" placeholder="Message"></textarea>
  <button type="submit">Submit</button>
</form>
```

**Component (Client Component):**
```typescript
// components/blocks/FormBlock.tsx
'use client';

import { useState } from 'react';
import type { FormBlock as FormBlockType } from '@/types/blocks';

export default function FormBlock({ data }: { data: FormBlockType }) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setMessage('Thank you! We'll be in touch soon.');
        e.currentTarget.reset();
      } else {
        setMessage('Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Error submitting form.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {data.heading && (
          <h2 className="text-3xl font-bold mb-4 text-center">{data.heading}</h2>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {data.fields.map((field) => (
            <div key={field.name}>
              <label className="block mb-2 font-medium">{field.label}</label>
              {field.type === 'textarea' ? (
                <textarea
                  name={field.name}
                  required={field.required}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  required={field.required}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder={field.placeholder}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : data.submit_text || 'Submit'}
          </button>
          {message && (
            <p className={`text-center ${message.includes('Thank') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
```

**Rules:** Add `'use client'` for forms with state, handle form submission with fetch, show loading/submitted states, validate inputs, use Next.js API routes for submission.

## Step 8: Register Block in BlockRenderer

```typescript
// components/blocks/BlockRenderer.tsx
import HeroBlock from './HeroBlock';
import FeaturesBlock from './FeaturesBlock';
import FormBlock from './FormBlock';

export default function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.collection) {
    case 'block_hero':
      return <HeroBlock data={block.data as any} />;
    case 'block_features':
      return <FeaturesBlock data={block.data as any} />;
    case 'block_form':
      return <FormBlock data={block.data as any} />;
    default:
      console.warn(`Unknown block type: ${block.collection}`);
      return null;
  }
}
```

**Rules:** Import new block component, add case matching collection name, use `as any` for type assertion, handle unknown types gracefully.

## Step 9: Create Page in Directus

**Create page via Directus Admin:**
1. Go to Content → pages → Create Item
2. Set permalink: `/about-us` (matches original HTML filename)
3. Set status: `published`
4. Add blocks in order (hero, features, form)
5. Save page

**Or via code:**
```typescript
// scripts/create-page-from-html.js
const page = await directus.request(
  createItem('pages', {
    title: 'About Us',
    permalink: '/about-us',
    status: 'published',
  })
);

// Create blocks
const heroBlock = await directus.request(
  createItem('block_hero', {
    heading: 'Welcome to Our Company',
    subheading: 'We create amazing products',
    cta_text: 'Get Started',
    cta_link: '/contact',
    theme: 'dark',
  })
);

// Link blocks to page
await directus.request(
  createItem('page_blocks', {
    pages_id: page.id,
    collection: 'block_hero',
    item: heroBlock.id,
    sort: 1,
  })
);
```

## Quick Checklist

- [ ] Analyzed HTML structure and identified sections
- [ ] Extracted all text content to separate list
- [ ] Created Directus collection for each block type (`block_*`)
- [ ] Added fields matching extracted content (snake_case)
- [ ] Uploaded images to Directus Files
- [ ] Created TypeScript interfaces in `types/blocks.ts`
- [ ] Converted HTML to JSX syntax
- [ ] Converted CSS classes to Tailwind utilities
- [ ] Removed inline styles and `<style>` tags
- [ ] Replaced `<img>` with Next.js `Image` component
- [ ] Replaced `<a>` with Next.js `Link` component
- [ ] Made forms client components with `'use client'`
- [ ] Added proper TypeScript types for props
- [ ] Handled optional/nullable fields conditionally
- [ ] Added responsive classes (md:, lg:)
- [ ] Registered block in `BlockRenderer.tsx`
- [ ] Created page in Directus with blocks
- [ ] Tested page renders correctly
- [ ] Verified content is editable in Directus
- [ ] Tested responsive design
- [ ] Validated TypeScript compiles without errors
