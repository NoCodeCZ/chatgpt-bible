# ChatGPT Bible - Project State Summary

**Last Updated:** 2025-01-XX  
**Branch:** `main` (1 commit ahead of origin)  
**Status:** Production-ready MVP, actively maintained

---

## Project Overview

**ChatGPT Bible** is a repeatable Next.js + Directus headless CMS framework for AI prompt catalog websites. The application provides a freemium model where users can browse free prompts publicly, with premium prompts requiring authentication and subscription.

### Tech Stack

- **Frontend**: Next.js 16.0.1 (App Router) + React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3.4.18
- **CMS**: Directus via @directus/sdk 20.1.1
- **Package Manager**: npm

---

## Architecture

### Directory Structure

```
chatgpt-bible-frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes (login, signup)
│   ├── (pages)/           # Dynamic page builder routes
│   ├── api/               # API routes (auth, revalidate)
│   ├── prompts/           # Prompt catalog pages
│   └── dashboard/         # User dashboard
├── components/
│   ├── blocks/            # Page builder blocks (10 registered)
│   ├── prompts/           # Prompt UI components
│   ├── layout/            # Site-wide layout (Navbar)
│   └── ui/                # Reusable UI primitives
├── lib/
│   ├── directus.ts        # Directus client (with env validation)
│   ├── directus-pages.ts  # Page builder services
│   ├── services/          # Data fetching services
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utilities (access-control, cache, env)
├── types/                 # TypeScript type definitions
└── scripts/              # Migration and data utilities
```

### Key Patterns

- **Server Components by default** - Only use `"use client"` for interactivity
- **ISR with revalidate** - `export const revalidate = 60` for data-fetching pages
- **Service pattern** - Data fetching in `lib/services/`, components receive props
- **Error handling** - Services return `null` on error, log with `console.error`
- **Type safety** - TypeScript interfaces mirror Directus collections exactly

---

## Current Features

### ✅ Implemented

1. **Public Prompt Browsing**
   - Free prompts accessible without authentication
   - Premium prompts show locked state for unauthenticated users
   - Authentication required only for accessing premium content

2. **Authentication System**
   - JWT-based auth via Directus
   - Session management with httpOnly cookies
   - Server-side user validation
   - Protected routes (`/dashboard`, `/account`)

3. **Access Control**
   - Freemium model: First 3 prompts free, rest require subscription
   - Access control logic in `lib/utils/access-control.ts`
   - Safe null handling for unauthenticated users

4. **Page Builder**
   - 10 registered block types (Hero, CTA, Features, RichText, Form, Testimonials, PromptsGrid, Pricing, FAQ, Footer)
   - Dynamic page rendering via `BlockRenderer`
   - M2A (Many-to-Any) relationship pattern

5. **Performance Optimizations**
   - ISR (Incremental Static Regeneration) on prompt pages (5-minute revalidation)
   - Server-side caching with `unstable_cache`
   - Cache-Control headers for static assets
   - On-demand revalidation API route

6. **Error Handling**
   - Dark theme error pages
   - Loading states with dark theme skeletons
   - Not-found pages
   - Error boundaries for client components

7. **Environment Validation**
   - Early validation in `lib/directus.ts`
   - Clear error messages for missing/invalid config
   - Reusable validation utilities

8. **Security**
   - Security headers in `next.config.ts`
   - X-Frame-Options, CSP, Referrer-Policy
   - Server-side access control

---

## Type System

### Core Types (`types/`)

- **`Prompt.ts`** - Prompt data structure (with deprecated `title` field, use `title_th`/`title_en`)
- **`Category.ts`** - Category structure
- **`JobRole.ts`** - Job role structure
- **`Navigation.ts`** - Navigation menu structure
- **`User.ts`** - User/auth types
- **`blocks.ts`** - Page builder block types (10 block types + Page/PageBlock types)

### Type Patterns

- Types mirror Directus collections exactly
- Use `as unknown as Type` for Directus SDK responses
- Nullable fields use `| null` union types
- Deprecated fields marked with comments

---

## Data Layer

### Directus Client (`lib/directus.ts`)

- **Environment validation** at module load time
- **Dual URL support**: Internal URL for server-side, public URL for client-side
- **Optional static token** authentication
- **Error handling**: Throws clear errors for missing/invalid config

### Service Functions (`lib/services/`)

- **`prompts.ts`** - `getPrompts()`, `getPromptById()`, `getPromptsBySubcategory()`
- **`categories.ts`** - Category fetching
- **`subcategories.ts`** - Subcategory fetching
- **`job-roles.ts`** - Job role fetching
- **`navigation.ts` - Navigation menu fetching
- **`related-prompts.ts`** - Related prompts fetching

### Service Patterns

- Return `null` on 404/not found
- Throw errors for other failures
- Log errors with context
- Use `unstable_cache` for caching (5-minute TTL)
- Support pagination, filtering, search

---

## Component Inventory

### Page Builder Blocks (`components/blocks/`)

1. **HeroBlock** - Hero/banner sections
2. **CTABlock** - Call-to-action blocks
3. **FeaturesBlock** - Feature list blocks
4. **RichTextBlock** - Rich text content
5. **FormBlock** - Contact/newsletter forms
6. **TestimonialsBlock** - Customer testimonials
7. **PromptsGridBlock** - Prompt grid display
8. **PricingBlock** - Pricing tables
9. **FAQBlock** - FAQ sections
10. **FooterBlock** - Site footer

**Registration**: `components/blocks/BlockRenderer.tsx` uses switch statement

### Prompt Components (`components/prompts/`)

- `PromptCard.tsx` - Prompt card display
- `PromptDetail.tsx` - Prompt detail view
- `PromptList.tsx` - Prompt list/grid
- `PromptFilters.tsx` - Filtering UI
- `PromptSkeleton.tsx` - Loading skeleton
- Plus 12 more prompt-related components

### Layout Components

- `Navbar.tsx` - Site navigation (in `components/layout/`)

---

## Pages & Routes

### Public Routes

- `/` - Landing page (marketing)
- `/prompts` - Prompt listing page
- `/prompts/[id]` - Prompt detail page (with ISR)
- `/prompts/subcategory/[id]` - Subcategory listing
- `/[...slug]` - Dynamic page builder routes

### Auth Routes

- `/login` - User login
- `/signup` - User registration
- `/dashboard` - User dashboard (protected)
- `/upgrade` - Upgrade/subscription page

### API Routes

- `/api/auth/login` - Login endpoint
- `/api/auth/logout` - Logout endpoint
- `/api/auth/register` - Registration endpoint
- `/api/auth/me` - Current user info
- `/api/auth/refresh` - Token refresh
- `/api/revalidate` - On-demand cache revalidation

### Debug Routes (Development)

- `/debug-prompts` - Debug prompt display
- `/test-directus` - Directus connection test

---

## Current Implementation Status

### ✅ Completed

- [x] Public browsing of free prompts
- [x] Authentication system (JWT, sessions)
- [x] Access control (freemium model)
- [x] Page builder with 10 block types
- [x] ISR and caching for performance
- [x] Error handling and dark theme UI
- [x] Environment validation
- [x] Security headers
- [x] TypeScript type safety

### 📋 In Progress / Planned

- [ ] Stripe integration (excluded from MVP)
- [ ] Rate limiting on API routes
- [ ] Full Lighthouse audit
- [ ] Screen reader testing
- [ ] Additional block types (if needed)

---

## Documentation

### Core Documentation

- **`CLAUDE.md`** - Main development rules and reference
- **`.claude/rules/sections/`** - Modular rule sections (12 files)
- **`chatgpt-bible-frontend/docs/reference/`** - Task-specific guides (11 guides)

### Implementation Plans

- **`plans/mvp-production-readiness.md`** - MVP production readiness tasks
- **`plans/web-speed-optimization.md`** - Performance optimization tasks

### Research & Analysis

- **`docs/research/mvp-production-readiness.md`** - Research findings
- **`docs/research/website-speed-optimizations.md`** - Performance research
- **`docs/rca/deployment-fix-summary.md`** - Deployment issue resolution

### Development Guides

- **`chatgpt-bible-frontend/docs/development/`** - Development guides
- **`chatgpt-bible-frontend/docs/directus/`** - Directus setup and schema docs
- **`chatgpt-bible-frontend/docs/deployment/`** - Deployment guides

---

## Scripts & Utilities

### Active Scripts (`chatgpt-bible-frontend/scripts/`)

- **`create-admin-user.js`** - Create Directus admin user
- **`upload-prompts-automated.js`** ⭐ - Recommended upload script (resume, error handling)
- **`parse-and-upload-prompts.js`** - Parse markdown to JSON
- **`upload-prompts-batch.js`** - Prepare prompt batches
- **`migrate-prompts.js`** - Migration utilities
- **`validate-migration.js`** - Validate migration data

### Data Files (`chatgpt-bible-frontend/data/`)

- **Batch JSON files** (`batch-*-ready.json`) - Migration data (18 batches)
- **`parsed-prompts.json`** - Parsed prompt data
- **`prompt-batches.json`** - Batch configuration
- **`upload-progress.json`** - Upload tracking
- **`upload-ready.json`** - Ready-to-upload data

**Note**: These are migration artifacts. Can be archived after migration is complete.

---

## Git Status

- **Branch**: `main`
- **Status**: 1 commit ahead of origin (needs push)
- **Working tree**: Clean (no uncommitted changes)

---

## Environment Variables

### Required

- `NEXT_PUBLIC_DIRECTUS_URL` - Public Directus URL (validated at module load)

### Optional

- `DIRECTUS_INTERNAL_URL` - Internal Directus URL (for server-side requests)
- `DIRECTUS_TOKEN` - Static token for authenticated requests

### Validation

- Environment variables validated in `lib/directus.ts` at module load
- Clear error messages for missing/invalid values
- URL format validation

---

## Deployment

### Current Setup

- **Dockerfile**: `chatgpt-bible-frontend/Dockerfile` (moved from `docs/deployment/`)
- **Deployment Platform**: Coolify
- **Build Context**: `chatgpt-bible-frontend/`

### Known Issues

- ⚠️ **Coolify Configuration**: Directory name typo (`chargpt-bible-frontend` → `chatgpt-bible-frontend`) - requires manual update in Coolify UI

### Deployment Status

- ✅ Code fix complete (Dockerfile location)
- ⚠️ Awaiting Coolify configuration update
- ⚠️ Deployment testing pending

---

## Next Steps

1. **Push to origin** - Push the 1 commit ahead
2. **Update Coolify config** - Fix directory name typo
3. **Test deployment** - Verify production build
4. **Monitor performance** - Check ISR and caching behavior
5. **Complete MVP tasks** - Finish remaining items from `plans/mvp-production-readiness.md`

---

## Quick Reference

### Development Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run migrate      # Run migration script
```

### Key Files

- **Directus client**: `lib/directus.ts`
- **Prompt services**: `lib/services/prompts.ts`
- **Access control**: `lib/utils/access-control.ts`
- **Block renderer**: `components/blocks/BlockRenderer.tsx`
- **Prompt detail page**: `app/prompts/[id]/page.tsx`

### Common Patterns

- **Service function**: Returns `null` on 404, throws on other errors
- **ISR**: `export const revalidate = 300` (5 minutes)
- **Caching**: `unstable_cache` with tags for on-demand revalidation
- **Type casting**: `as unknown as Type` for Directus responses

---

**Ready for**: Development, deployment, and feature additions

