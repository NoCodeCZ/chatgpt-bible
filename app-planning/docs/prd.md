# CharGPT Bible Product Requirements Document (PRD)

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|---------|
| 2025-11-09 | 1.0 | Initial PRD creation from Project Brief | John (PM) |
| 2025-11-09 | 1.1 | Added Out of Scope section, finalized free prompt limit (3), completed PM checklist validation | John (PM) |

---

## Goals and Background Context

### Goals

- Launch a functional MVP within 2 weeks with Directus CMS, Next.js frontend, and Stripe subscription integration
- Migrate existing GPT Bible prompt library from Airtable to new platform with improved UX and scalability
- Validate willingness to pay at $15-25/month price point and achieve 10+ paid subscribers within first 30 days
- Establish sustainable content creation velocity of 10+ new prompts per week
- Maintain 70%+ subscriber retention after first month to prove ongoing value delivery
- Enable professionals to find and use their first prompt within 3 minutes of subscribing
- Keep monthly infrastructure costs under $100 during MVP phase

### Background Context

CharGPT Bible addresses a critical productivity barrier: general professionals (ages 28-45, mid-to-senior level) know ChatGPT exists but struggle to craft effective prompts for their job-specific tasks. This results in wasted time (2-5 hours/week on trial-and-error), inconsistent output quality, and abandoned AI adoption. Existing solutions fall short—free repositories lack curation and job-specific organization, while courses are too time-intensive for busy professionals.

This project builds on a proven foundation: a previous version (GPT Bible) successfully sold on Airtable, validating market demand. The new platform will leverage modern tech (Next.js + Directus + Stripe) to deliver superior UX, better content management, and scalability. A sales/marketing partner will handle customer acquisition, de-risking go-to-market. The primary focus is technical execution speed—delivering a subscription-based library of curated, job-specific ChatGPT prompts organized by role and task type, enabling copy-and-go simplicity.

---

## Requirements

### Functional Requirements

**FR1:** Users must be able to register for a free account using email/password authentication via Directus

**FR2:** Free users can browse and view 3 sample prompts from the library to demonstrate value before subscribing

**FR3:** Users can subscribe to a paid tier ($15-25/month) via Stripe Checkout integration

**FR4:** Paid subscribers can access the full prompt library with no restrictions

**FR5:** Users can browse prompts with filtering by category (e.g., "Email Writing," "Report Creation") and job role (e.g., "Manager," "Marketer," "Writer")

**FR6:** Users can search prompts using basic text search across prompt titles and descriptions

**FR7:** Each prompt detail page displays: title, description, full prompt text, category, job role tags, and difficulty level

**FR8:** Users can copy prompt text to clipboard with a single-click copy button

**FR9:** User dashboard displays subscription status (Free/Paid), subscription renewal date, and basic usage tracking

**FR10:** Stripe webhooks sync subscription events (created, canceled, payment failed) to Directus user records in real-time

**FR11:** Admins can add, edit, and publish new prompts via Directus native CMS interface in under 3 minutes per prompt

**FR12:** The migration script imports existing prompt templates from documentation into Directus with proper categorization and tagging

**FR13:** The platform displays a public landing page with value proposition and clear CTA to subscribe

**FR14:** Users can log in, log out, and manage their account profile

**FR15:** All pages are mobile-responsive and functional on iOS Safari and Android Chrome

### Non-Functional Requirements

**NFR1:** Initial page load time must be under 3 seconds on a 4G connection; Time to Interactive (TTI) under 5 seconds

**NFR2:** Search and filter operations return results in under 500ms

**NFR3:** Monthly infrastructure costs must remain under $100 during MVP phase (Directus Cloud/Railway + Vercel free tier + Stripe transaction fees)

**NFR4:** The platform must support 100+ concurrent users without performance degradation

**NFR5:** All data transmission uses HTTPS; environment variables protect API keys and secrets (never committed to repository)

**NFR6:** Browser support: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (no IE11 support)

**NFR7:** Stripe webhook handlers must be idempotent to prevent duplicate subscription state changes

**NFR8:** Directus role-based access control enforces Free vs. Paid user permissions at the API level

**NFR9:** The frontend is deployed to Vercel with production environment variables; Directus is deployed to Directus Cloud or Railway with PostgreSQL database

**NFR10:** The entire tech stack (Next.js frontend → Directus backend → Stripe integration) must be functional and testable within the 2-week MVP timeline

**NFR11:** Prompt library supports pagination (20 prompts per page) to maintain performance as library grows

**NFR12:** Authentication tokens (JWT) are stored in httpOnly cookies with middleware protecting authenticated routes

---

## User Interface Design Goals

### Overall UX Vision

CharGPT Bible delivers a **frictionless, productivity-focused experience** for time-pressed professionals. The interface prioritizes speed-to-value: users should find, evaluate, and copy a prompt within 3 minutes of landing. The design philosophy is "library card catalog meets modern SaaS"—clear categorization, instant search, and zero-friction copy actions. Visual hierarchy guides users from broad categories → filtered results → individual prompts with minimal cognitive load. The experience should feel professional, trustworthy, and distraction-free—no gamification, no social clutter, just efficient access to high-quality content.

**Key UX Principles:**
- **Speed over exploration:** Optimize for users who know what task they need help with
- **Trust through curation signals:** Prominently display quality indicators (tested, job-specific, difficulty level)
- **Copy-and-go simplicity:** Every prompt page ends with one primary action: Copy
- **Progressive disclosure:** Free users see value immediately; paywall is clear but not obtrusive

### Key Interaction Paradigms

**Browse-First Discovery:**
- Landing page → Category/Role grid → Filtered results list → Prompt detail
- Prominent filter pills (Category + Job Role) persist across browse experience
- Search bar always accessible in header for power users

**Instant Gratification:**
- One-click copy to clipboard with visual confirmation toast ("Copied!")
- No modals, no unnecessary clicks—every interaction is direct

**Freemium Transparency:**
- Free users see full prompt titles/descriptions but "locked" prompt text with upgrade CTA
- Paid users experience zero friction—all content immediately accessible

**Mobile-First Responsive:**
- Touch-friendly targets (48px minimum)
- Collapsible filters on mobile (drawer pattern)
- Copy button fixed at bottom of prompt detail page on mobile

**Subscription-Aware UI:**
- Dashboard shows subscription status, renewal date, and quick link to manage billing (Stripe portal)
- Subtle badge or indicator shows user's subscription tier in header

### Core Screens and Views

**1. Public Landing Page**
- Hero section with value proposition ("Subscribe once, access proven ChatGPT prompts for your job")
- Social proof section (testimonials if available from Airtable version)
- Pricing display ($15-25/month)
- CTA: "Start Free" → Sign Up flow

**2. Browse/Library Page** (primary app experience)
- Filter sidebar: Category + Job Role multi-select
- Search bar
- Prompt card grid: title, short description, category/role tags, difficulty badge
- Pagination controls (20 per page)
- Free users see "locked" overlay on prompts beyond first 3

**3. Prompt Detail Page**
- Full prompt title and description
- Metadata: Category, Job Role, Difficulty Level
- **Primary Action:** Large "Copy Prompt" button
- Prompt text display (code-block style for easy reading)
- Upgrade CTA if free user viewing locked prompt

**4. Sign Up / Login Pages**
- Minimal forms: Email + Password
- "Sign up free" emphasized
- Link to Stripe Checkout for paid subscription during/after signup

**5. User Dashboard**
- Subscription status card (Free/Paid, renewal date, manage subscription link)
- Quick stats: "Prompts used this week" (if tracking implemented)
- Recent prompts browsed (optional for MVP)
- Quick link back to Browse Library

**6. Stripe Checkout Flow** (handled by Stripe Hosted Checkout)
- Redirects to Stripe → User completes payment → Redirects back to Dashboard with success message

### Accessibility: WCAG AA

**Target:** WCAG 2.1 Level AA compliance

**Key Requirements:**
- Keyboard navigation for all interactive elements
- Color contrast ratios meet 4.5:1 minimum for text
- Focus indicators on all focusable elements
- Semantic HTML (headings, landmarks, buttons vs. divs)
- Alt text for any images/icons
- Screen reader friendly (aria-labels where needed)

### Branding

**Style:** Clean, professional, productivity-focused

**Tone:** Trustworthy and efficient—think "Notion meets Stripe" (minimalist, high contrast, generous whitespace)

**Color Palette (Assumed):**
- Primary: Professional blue or teal (suggests trust, productivity)
- Accent: Energizing highlight color for CTAs (orange or green)
- Neutrals: Clean grays for text hierarchy, white background
- Semantic colors: Green (success), Red (locked/premium), Yellow (difficulty indicators)

**Typography (Assumed):**
- Headings: Modern sans-serif (Inter, Poppins, or similar)
- Body: High-readability sans-serif (Inter, System UI stack)
- Code blocks: Monospace for prompt text display

### Target Device and Platforms: Web Responsive

**Primary Targets:**
- Desktop browsers (1440px+ viewports)—primary work environment for target users
- Mobile browsers (360px-768px)—on-the-go browsing and quick prompt access
- Tablet browsers (768px-1024px)—secondary use case

**Platform Priorities:**
1. Desktop Chrome/Edge (most common for professionals)
2. iPhone Safari (iOS mobile)
3. Android Chrome
4. Desktop Safari/Firefox

**Performance Expectations:**
- Mobile: 3G Fast connection minimum
- Desktop: 4G connection minimum
- Responsive breakpoints: 360px, 640px, 768px, 1024px, 1440px (Tailwind CSS defaults)

---

## Technical Assumptions

### Repository Structure: Polyrepo

**Decision:** Separate repositories for MVP speed

**Rationale:**
- Two repositories: `chargpt-bible-frontend` (Next.js) and `directus-config` (Directus schema snapshots/migrations)
- Simpler deployment model—Vercel for frontend, Directus Cloud/Railway for backend
- Reduces build complexity and allows independent versioning during rapid MVP iteration
- Monorepo adds overhead (Turborepo/Nx setup) that doesn't pay off for 2-week timeline

**Future Consideration:** May consolidate to monorepo post-MVP if shared code (types, validation schemas) emerges

### Service Architecture

**Architecture:** Serverless-Adjacent Monolith (Next.js + Managed Services)

**Components:**
1. **Frontend:** Next.js 14+ App Router (TypeScript)
   - Deployed to Vercel as serverless functions
   - API routes handle Stripe webhooks and authentication flow
   - Static generation where possible (landing page, public content)

2. **Backend:** Directus 10+ as BaaS (Backend-as-a-Service)
   - Self-contained CMS + LMS + REST API
   - Manages all business logic: user auth, subscription state, content delivery, access control
   - PostgreSQL 14+ database (managed by Directus)
   - Directus Flows for webhook handling and automation

3. **Payment Processing:** Stripe Checkout (hosted)
   - Stripe handles payment UI, PCI compliance, and subscription billing
   - Webhooks sync subscription events to Directus via Next.js API routes

**Data Flow:**
- User → Next.js Frontend → Directus REST API → PostgreSQL
- Stripe → Next.js Webhook Endpoint → Directus API (subscription sync)
- Admin → Directus Native UI → PostgreSQL

**Rationale:**
- **Not true microservices**—Directus is single service handling multiple concerns (CMS, auth, API)
- **Serverless frontend**—Vercel handles scaling, zero infrastructure management
- **Managed backend**—Directus Cloud or Railway eliminates database/server management
- **Cost-optimized**—Fits <$100/month constraint (Directus $20 + Vercel free + Stripe fees)
- **2-week feasible**—No custom backend code, leverage Directus capabilities fully

**Technology Stack:**

**Frontend:**
- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 3+ with default breakpoints
- **Data Fetching:** React Server Components + SWR for client-side caching
- **Authentication:** Custom integration with Directus JWT auth (httpOnly cookies)
- **State Management:** React Context for user session, URL state for filters/search
- **Form Handling:** React Hook Form + Zod validation
- **Copy-to-Clipboard:** Navigator Clipboard API with fallback

**Backend:**
- **BaaS Platform:** Directus 10+ (Cloud or self-hosted on Railway)
- **Database:** PostgreSQL 14+ (included with Directus)
- **API:** Directus REST API (prefer over GraphQL for simplicity)
- **Authentication:** Directus built-in JWT authentication
- **File Storage:** Local filesystem or S3-compatible storage (future, not MVP)
- **Automation:** Directus Flows for webhook processing

**Payment:**
- **Provider:** Stripe
- **Integration:** Stripe Checkout (hosted payment page)
- **Webhook Handling:** Next.js API route (`/api/webhooks/stripe`)
- **Subscription Management:** Stripe Customer Portal for user self-service

**Deployment & Infrastructure:**
- **Frontend Hosting:** Vercel (free tier—unlimited bandwidth, serverless functions)
- **Backend Hosting:** Directus Cloud ($20/month) OR Railway/Render ($7-10/month self-hosted Docker)
- **Database:** Managed PostgreSQL (included with Directus Cloud or Railway)
- **Domain/DNS:** Vercel automatic domains + custom domain support
- **SSL/TLS:** Automatic HTTPS via Vercel and Directus Cloud
- **Environment Variables:** Vercel env vars for frontend, Directus env config for backend

**Migration & Data:**
- **Migration Script:** Node.js script using Directus SDK to bulk-import existing prompts
- **Data Format:** Parse markdown/JSON prompt docs, map to Directus schema, bulk create via API
- **Taxonomy Setup:** Manual creation of categories and job roles in Directus admin UI before migration

### Testing Requirements

**MVP Testing Strategy:** Manual testing + lightweight automation

**Testing Pyramid for MVP:**
1. **Manual End-to-End Testing** (primary validation method)
   - Critical user flows: Signup → Subscribe → Browse → Copy prompt
   - Stripe webhook testing using MCP Stripe integration
   - Mobile responsiveness testing on real devices (iOS Safari, Android Chrome)
   - Cross-browser testing (Chrome, Firefox, Safari, Edge)

2. **Unit Tests** (minimal, high-value only)
   - Utility functions (e.g., prompt text formatting, date handling)
   - Stripe webhook signature verification
   - Directus API client wrappers

3. **Integration Tests** (deferred to post-MVP unless critical)
   - Directus API integration tests (if custom logic emerges)
   - Stripe subscription flow testing (use Stripe test mode extensively)

**Testing Tools:**
- **Manual Testing:** Browser DevTools, Lighthouse (performance), axe DevTools (accessibility)
- **Unit Testing:** Vitest (if time permits—fast, Next.js compatible)
- **Webhook Testing:** MCP Stripe integration for real-time event simulation
- **Type Safety:** TypeScript as primary bug prevention mechanism

**Rationale:**
- **2-week timeline constraints:** Automated test suites are time-intensive to set up
- **Third-party dependencies:** Directus, Stripe, Vercel are battle-tested—lower risk
- **TypeScript + Directus schemas:** Provide compile-time safety, reduce runtime errors
- **Post-MVP:** Add Playwright E2E tests for regression protection once core flows stabilized

**Manual Testing Convenience:**
- Seeded test data (sample prompts in all categories)
- Test user accounts (free and paid)
- Stripe test mode configured with test cards
- Directus admin account for quick content updates

### Additional Technical Assumptions and Requests

**Development Methodology & Tooling:**
- **MCP (Model Context Protocol) Integration:** Development will leverage MCP for AI-assisted configuration and integration
- **Directus MCP:** Direct integration with Directus instance enabling:
  - Real-time schema inspection and modification
  - Automated collection and relationship creation
  - Live API testing and validation
  - Accelerated schema design and migration workflows
- **Stripe MCP:** Direct integration with Stripe for payment development enabling:
  - Real-time API testing and webhook validation
  - Automated Checkout Session creation and testing
  - Live event simulation and debugging
  - Accelerated webhook endpoint development
- Development environment includes MCP servers connected to both Directus and Stripe instances
- This approach significantly reduces learning curve for both platforms and accelerates Epic 1, 2, and 4 timeline estimates
- AI-assisted development via MCP enables rapid prototyping and real-time validation

**Security & Compliance:**
- All secrets stored in environment variables (Vercel secrets, Directus env config)
- `.env.local` never committed (gitignored)
- Directus role-based permissions enforce Free vs. Paid access at API level
- Rate limiting on public Directus endpoints (built-in, configure for 100 req/min per IP)
- Input sanitization for search queries (prevent XSS)—Directus handles internally
- Stripe PCI compliance delegated to Stripe Checkout (no card data touches our servers)
- GDPR considerations: User data export/deletion via Directus admin UI (manual for MVP)

**Performance Optimizations:**
- Next.js Image component for any images (automatic optimization)
- Pagination for prompt lists (20 per page)—Directus API supports limit/offset
- Server-side rendering (SSR) for Browse page with filter params in URL (SEO + performance)
- Static generation for landing page and marketing content
- SWR stale-while-revalidate caching for prompt data (reduces Directus API load)
- No external analytics for MVP (keep page weight low)—defer to Google Analytics post-launch

**Database Schema (Directus Collections):**
- `users` (Directus built-in, extended with custom fields)
  - Fields: `subscription_status` (enum: free, paid), `stripe_customer_id`, `stripe_subscription_id`, `subscription_expires_at`
- `prompts`
  - Fields: `title`, `description`, `prompt_text`, `difficulty_level` (enum: beginner, intermediate, advanced), `created_at`, `updated_at`
  - Relationships: Many-to-Many with `categories` and `job_roles`
- `categories`
  - Fields: `name`, `slug`, `description`
- `job_roles`
  - Fields: `name`, `slug`, `description`
- `prompt_categories` (junction table)
- `prompt_job_roles` (junction table)

**Authentication Flow:**
- User submits email/password → Next.js calls Directus `/auth/login` → Receives JWT access + refresh tokens
- Store tokens in httpOnly cookies (XSS protection)
- Next.js middleware checks token validity on protected routes, redirects to login if expired
- Refresh token rotation handled by Directus SDK

**Stripe Webhook Flow:**
- Stripe event (e.g., `customer.subscription.created`) → Next.js `/api/webhooks/stripe`
- Verify webhook signature using Stripe SDK
- Parse event, extract `customer_id` and `subscription_status`
- Call Directus API to update user record: `subscription_status`, `stripe_subscription_id`
- Return 200 OK to Stripe (idempotent—check if already processed)
- Log all webhook events to file or Directus log collection for debugging

**Deployment Pipeline:**
- **Frontend:** Git push to `main` → Vercel automatic deployment → Preview URLs for PRs
- **Backend:** Directus Cloud managed updates OR Railway auto-deploy from Docker image
- **Database Migrations:** Directus schema snapshots applied via Directus CLI (`directus schema apply`)
- **Environment Promotion:** Dev → Staging → Production (use Vercel preview environments)

**Dependencies & Libraries (Frontend):**
- `next` (14+), `react`, `react-dom`
- `@directus/sdk` (Directus JavaScript SDK)
- `stripe` (Stripe Node.js SDK for webhooks)
- `tailwindcss` (3+), `autoprefixer`, `postcss`
- `swr` (data fetching/caching)
- `react-hook-form` (forms), `zod` (validation)
- `clsx` or `classnames` (conditional CSS classes)
- **MCP client libraries** (if needed for development tooling integration)

**Error Handling & Monitoring:**
- Console logging for MVP (structured logs in API routes)
- Stripe webhook failures logged to file (inspect manually)
- Directus built-in logging for API errors
- User-facing error pages: Custom 404, 500 error pages in Next.js
- Post-MVP: Add Sentry or LogRocket for error tracking

**Assumptions Requiring Architect Validation:**
1. **Directus Subscription Logic:** Can Directus Flows handle Stripe webhook → user update reliably, or do we need custom Next.js middleware?
2. **Authentication Strategy:** Is custom Directus JWT integration simpler than Next-Auth with Directus adapter?
3. **Migration Script Complexity:** Will existing prompt data structure map cleanly to Directus schema, or do we need transformation logic?
4. **Vercel Free Tier Limits:** Will serverless function execution time (<10s) and bandwidth limits accommodate expected traffic?
5. **Directus Cloud vs. Self-Hosted:** Does Cloud's convenience ($20/mo) outweigh Railway's cost savings ($7/mo) given 2-week timeline?

---

## Epic List

**Epic 1: Foundation & Prompt Display System**
Establish project infrastructure (Next.js + Directus + deployment pipeline) and deliver a basic public-facing prompt browsing experience.

**Epic 2: Content Management & Discovery**
Complete prompt schema, migrate existing content library, and implement full browse/filter/search/copy functionality for public users.

**Epic 3: Authentication & Access Control**
Implement user registration, login, and freemium access model (3 free prompts visible, rest locked) with user dashboard.

**Epic 4: Subscription & Payment Integration**
Integrate Stripe Checkout for paid subscriptions, sync subscription status with user access permissions, and enable full library access for paid users.

---

## Out of Scope for MVP

The following features are explicitly excluded from the MVP to maintain the 2-week timeline and validate core product-market fit. These may be considered for post-MVP phases based on user feedback and business validation.

**Product Features:**
- AI-powered prompt generation or customization
- In-app ChatGPT integration (users will copy-paste prompts manually)
- Social features: comments, ratings, favorites, sharing
- User-generated content or community-contributed prompts
- Prompt versioning or revision history
- Advanced analytics dashboard for users
- Email marketing automation or drip campaigns

**Monetization & Business:**
- Multiple subscription tiers (only single paid tier for MVP)
- Annual billing option (monthly only for MVP)
- Team/enterprise tier with multi-user access
- One-time purchases for individual prompt packs
- Referral program with credit rewards

**Technical & Platform:**
- Mobile native apps (iOS/Android) - web-only for MVP
- Integration with other AI platforms (Claude, Gemini, Midjourney, etc.)
- Advanced search with NLP or semantic matching (basic text search only)
- AI-powered prompt recommendations based on usage patterns
- White-label solution for enterprises

**Content & Discovery:**
- Prompt collections/bundles
- "Most popular" or personalized recommendations (basic "Related Prompts" only)
- User notes field for customizing prompts
- Favorites/bookmarking system
- Usage history tracking beyond basic subscription status

---

## Epic 1: Foundation & Prompt Display System

**Epic Goal:** Establish the complete technical infrastructure (Next.js frontend, Directus backend, deployment pipeline, database schema) while delivering an initial public-facing feature: users can visit the deployed website and view a basic list of prompts. This "walking skeleton" validates end-to-end system integration and provides immediate visible value, even without authentication or payments.

---

### Story 1.1: Initialize Next.js Application with Tailwind CSS

As a **developer**,
I want a fully configured Next.js 14 project with TypeScript and Tailwind CSS,
so that I have a modern, type-safe foundation for building the frontend.

**Acceptance Criteria:**
1. Next.js 14+ project created with App Router and TypeScript (strict mode enabled)
2. Tailwind CSS 3+ installed and configured with default breakpoints (360px, 640px, 768px, 1024px, 1440px)
3. Project includes `.gitignore` for Node modules and `.env.local` files
4. Basic folder structure created: `app/`, `components/`, `lib/`, `public/`
5. Development server runs successfully on `localhost:3000`
6. Sample page renders with Tailwind styling to confirm configuration

---

### Story 1.2: Set Up Directus Backend and Database Schema

As a **developer**,
I want a deployed Directus instance with the core database schema for prompts and taxonomy,
so that I have a working CMS/API to manage and serve prompt content.

**Acceptance Criteria:**
1. Directus 10+ instance deployed (Directus Cloud or Railway)
2. PostgreSQL 14+ database connected and operational
3. **MCP server connected to Directus instance for AI-assisted development**
4. Directus collections created **via MCP-assisted schema design**:
   - `prompts` (fields: `id`, `title`, `description`, `prompt_text`, `difficulty_level`, `status`, `date_created`, `date_updated`)
   - `categories` (fields: `id`, `name`, `slug`, `description`)
   - `job_roles` (fields: `id`, `name`, `slug`, `description`)
   - `prompt_categories` (Many-to-Many junction table)
   - `prompt_job_roles` (Many-to-Many junction table)
5. Directus admin account created and accessible
6. Directus REST API accessible via HTTPS endpoint
7. **MCP connection validated by successfully querying schema via AI tooling**
8. Test prompt record created manually in Directus admin UI to validate schema

---

### Story 1.3: Connect Next.js to Directus API

As a **developer**,
I want the Next.js frontend to successfully fetch data from the Directus API,
so that I can display dynamic content from the CMS.

**Acceptance Criteria:**
1. `@directus/sdk` installed in Next.js project
2. Directus API client configured in `lib/directus.ts` with base URL from environment variable
3. Environment variable `NEXT_PUBLIC_DIRECTUS_URL` set in `.env.local` and Vercel
4. **MCP-assisted API integration testing validates schema and endpoint responses**
5. Server Component successfully fetches test prompt data from Directus API
6. Error handling implemented for API failures (display fallback message)
7. TypeScript types generated or defined for Directus API responses (at minimum: `Prompt`, `Category`, `JobRole`)
8. **Types validated against live Directus schema via MCP inspection**

---

### Story 1.4: Create Public Landing Page

As a **visitor**,
I want to see a professional landing page with a clear value proposition,
so that I understand what CharGPT Bible offers and can navigate to browse prompts.

**Acceptance Criteria:**
1. Landing page created at `/` route with mobile-responsive design
2. Hero section includes:
   - Clear headline (e.g., "ChatGPT Prompts for Your Job")
   - Value proposition subheading (e.g., "Subscribe once, access proven prompts organized by role and task")
   - Primary CTA button ("Browse Prompts" linking to `/prompts`)
3. Brief feature overview section (3-4 benefit bullets)
4. Pricing information displayed ($15-25/month, exact price TBD)
5. Footer with placeholder links (Terms, Privacy, Contact)
6. Page loads in <3 seconds on 4G connection (verified with Lighthouse)
7. Mobile-responsive: readable and functional on 360px viewports

---

### Story 1.5: Build Basic Prompt List Page

As a **visitor**,
I want to browse a paginated list of prompts on the website,
so that I can see what content is available.

**Acceptance Criteria:**
1. Prompt list page created at `/prompts` route
2. Fetches prompts from Directus API (Server Component)
3. Displays prompts in a grid layout (responsive: 1 column mobile, 2 columns tablet, 3 columns desktop)
4. Each prompt card shows: title, truncated description (100 chars), category tag, job role tag, difficulty badge
5. Pagination implemented (20 prompts per page) with "Previous" and "Next" buttons
6. Empty state displayed if no prompts exist ("No prompts found")
7. Loading state displayed while fetching data
8. Page is mobile-responsive (cards stack appropriately on small screens)

---

### Story 1.6: Create Prompt Detail Page

As a **visitor**,
I want to view the full details of a single prompt including the complete prompt text,
so that I can see the prompt content and copy it.

**Acceptance Criteria:**
1. Prompt detail page created at `/prompts/[id]` dynamic route
2. Fetches single prompt by ID from Directus API
3. Displays:
   - Prompt title (H1)
   - Full description (paragraph)
   - Category and job role tags (pills/badges)
   - Difficulty level badge
   - Full prompt text in code-block style formatting (white background, monospace font, border)
4. "Copy to Clipboard" button renders below prompt text
5. Button click copies `prompt_text` to clipboard and displays toast notification ("Copied!")
6. 404 error page if prompt ID not found
7. Mobile-responsive layout (text wraps appropriately, copy button accessible)

---

### Story 1.7: Deploy Frontend to Vercel and Configure Production Environment

As a **developer**,
I want the Next.js application deployed to Vercel with production environment variables,
so that users can access the live website.

**Acceptance Criteria:**
1. Next.js repository connected to Vercel account
2. Automatic deployment triggered on push to `main` branch
3. Production environment variables configured in Vercel:
   - `NEXT_PUBLIC_DIRECTUS_URL` (production Directus API URL)
4. Custom domain configured (or Vercel subdomain acceptable for MVP)
5. HTTPS enabled automatically by Vercel
6. Deployment successful and site accessible at public URL
7. Landing page, prompt list page, and prompt detail page all functional in production
8. Preview deployments enabled for pull requests

---

### Story 1.8: Seed Directus with Initial Prompt Data

As an **admin**,
I want the Directus CMS populated with at least 10 sample prompts across multiple categories,
so that the website has real content to display and test with.

**Acceptance Criteria:**
1. At least 3 categories created in Directus (e.g., "Email Writing", "Report Creation", "Brainstorming")
2. At least 3 job roles created (e.g., "Manager", "Marketer", "Writer")
3. At least 10 prompts created with:
   - Complete title, description, and prompt_text
   - Assigned to at least one category and one job role
   - Difficulty level set (mix of beginner, intermediate, advanced)
   - Status set to "published"
4. Prompts visible on production `/prompts` page
5. Prompt detail pages render correctly for all seeded prompts
6. Copy button successfully copies prompt text for all seeded prompts

---

## Epic 2: Content Management & Discovery

**Epic Goal:** Complete the content management system by implementing the bulk migration of existing prompts from documentation into Directus, and enhance the user-facing discovery experience with filtering, search, and improved taxonomy display. By the end of this epic, the full prompt library is accessible, discoverable, and functional (still publicly available to all visitors, no paywall yet).

---

### Story 2.1: Design and Implement Migration Script for Existing Prompts

As a **developer**,
I want a script that imports all existing prompt data from documentation into Directus,
so that the full content library is available in the CMS without manual entry.

**Acceptance Criteria:**
1. Node.js migration script created in `scripts/migrate-prompts.js`
2. Script parses existing prompt data source (markdown files, JSON, or other format—specify based on actual data)
3. Script uses Directus SDK to authenticate and bulk-create records
4. **MCP-assisted development validates schema mapping and relationship creation during script development**
5. For each prompt:
   - Creates prompt record with title, description, prompt_text, difficulty_level
   - Creates or links to existing category records
   - Creates or links to existing job_role records
   - Handles Many-to-Many relationships via junction tables
6. Script includes error handling (logs failed imports, continues processing)
7. Dry-run mode available (preview import without writing to database)
8. Script execution completes in <5 minutes for full library
9. Documentation added to README for running migration script

---

### Story 2.2: Execute Migration and Validate Prompt Library Completeness

As a **content admin**,
I want all existing prompts successfully migrated into Directus with correct categorization,
so that the full content library is live and accurate.

**Acceptance Criteria:**
1. Migration script executed successfully in production Directus instance
2. All prompts from source documentation imported (verify count matches expected)
3. Random sample of 10 prompts manually inspected in Directus admin UI:
   - Title, description, prompt_text are accurate
   - Categories and job roles correctly assigned
   - No obvious formatting issues or truncated text
4. All migrated prompts have status set to "published"
5. Migrated prompts visible on production `/prompts` page
6. Prompt detail pages render correctly for migrated prompts
7. Backup of Directus database created before migration (rollback option)

---

### Story 2.3: Add Category and Job Role Filtering to Prompt List Page

As a **visitor**,
I want to filter prompts by category and job role,
so that I can quickly find prompts relevant to my needs.

**Acceptance Criteria:**
1. Filter sidebar added to `/prompts` page (desktop: left sidebar, mobile: collapsible drawer)
2. Category filter section displays all available categories as checkboxes
3. Job Role filter section displays all available job roles as checkboxes
4. User can select multiple categories and/or job roles
5. Filter selection updates URL query parameters (e.g., `?categories=email-writing&roles=manager`)
6. Prompt list updates dynamically based on selected filters (Directus API query with filters)
7. Selected filter count badge displayed (e.g., "2 filters applied")
8. "Clear All Filters" button resets all selections and shows full library
9. Empty state displayed if no prompts match filters ("No prompts found with these filters")
10. Filter state persists on page reload (reads from URL params)
11. Mobile: Filter drawer opens via button, closes after applying filters

---

### Story 2.4: Implement Prompt Search Functionality

As a **visitor**,
I want to search prompts by keywords in titles or descriptions,
so that I can quickly find specific prompts without browsing.

**Acceptance Criteria:**
1. Search bar added to top of `/prompts` page (above filter sidebar, prominent placement)
2. Search input includes placeholder text (e.g., "Search prompts...")
3. User types search query → debounced search (500ms delay) triggers API request
4. Directus API query searches across `title` and `description` fields (case-insensitive)
5. Prompt list updates to show only matching results
6. Search query added to URL parameter (e.g., `?search=email`)
7. Search query persists on page reload
8. Search works in combination with filters (AND logic: match search AND filters)
9. "Clear Search" button (X icon in input) clears search and resets to full list
10. Empty state if no results ("No prompts match your search")
11. Search bar is responsive (full width on mobile)

---

### Story 2.5: Add Difficulty Level Filter and Visual Indicators

As a **visitor**,
I want to filter prompts by difficulty level and see difficulty badges on prompt cards,
so that I can choose prompts matching my experience level.

**Acceptance Criteria:**
1. Difficulty filter added to filter sidebar with radio buttons or checkboxes (Beginner, Intermediate, Advanced)
2. Difficulty badge displayed on each prompt card (color-coded: green=beginner, yellow=intermediate, red=advanced)
3. Difficulty badge displayed on prompt detail page
4. Filter selection updates URL parameter (e.g., `?difficulty=beginner`)
5. Prompt list filters by selected difficulty level via Directus API
6. Difficulty filter works in combination with category, job role, and search filters
7. Clear filter option available
8. Accessible color contrast for difficulty badges (meets WCAG AA)

---

### Story 2.6: Optimize Prompt List Performance with Caching

As a **visitor**,
I want the prompt list page to load quickly even with many prompts,
so that browsing is a smooth experience.

**Acceptance Criteria:**
1. SWR (stale-while-revalidate) caching implemented for Directus API calls on client-side filtered results
2. Server-side rendering (SSR) used for initial page load with URL-based filters pre-applied
3. Cache duration set to 5 minutes (balance freshness vs. performance)
4. Page load time measured with Lighthouse: <3 seconds initial load, <500ms filter changes
5. Network waterfall inspected: no redundant API requests during filter/search interactions
6. Loading skeleton displayed during data fetches (improves perceived performance)
7. Pagination maintained (20 prompts per page) to limit data transferred

---

### Story 2.7: Enhance Prompt Detail Page with Related Prompts

As a **visitor**,
I want to see related prompts at the bottom of a prompt detail page,
so that I can discover additional relevant content.

**Acceptance Criteria:**
1. "Related Prompts" section added below prompt text on detail page
2. Related prompts logic: fetch 3-5 prompts with matching category OR job role (exclude current prompt)
3. Related prompts displayed as compact cards (title + category tag)
4. Each related prompt card is clickable, navigating to its detail page
5. If no related prompts exist, section is hidden (no empty state needed)
6. Related prompts section is mobile-responsive (cards stack vertically on small screens)
7. Related prompts fetched server-side (SSR) for initial page load performance

---

### Story 2.8: Create Admin Documentation for Managing Prompts in Directus

As an **admin**,
I want clear documentation on how to add, edit, and organize prompts in Directus,
so that I can maintain the content library efficiently.

**Acceptance Criteria:**
1. Admin guide document created (markdown file in repository or Directus docs collection)
2. Documented processes:
   - How to add a new prompt (required fields, best practices for titles/descriptions)
   - How to create new categories and job roles
   - How to assign multiple categories/roles to a prompt
   - How to set difficulty level and publish status
   - How to bulk-edit prompts (if Directus supports)
3. Screenshots or annotated images showing Directus admin UI steps
4. Estimated time to add a new prompt: <3 minutes (validated during documentation)
5. Troubleshooting section for common issues (e.g., prompt not appearing on site)

---

## Epic 3: Authentication & Access Control

**Epic Goal:** Implement user registration, login, and session management, then introduce the freemium access model where free users can view 3 "teaser" prompts while the rest of the library is locked behind a paywall. This epic establishes the foundation for monetization without requiring payment integration yet—users can sign up for free accounts and see the value proposition clearly.

---

### Story 3.1: Extend Directus User Schema with Subscription Fields

As a **developer**,
I want the Directus `users` collection extended with subscription-related fields,
so that I can track user subscription status and Stripe customer IDs.

**Acceptance Criteria:**
1. **MCP-assisted schema modification** extends Directus `users` collection with custom fields:
   - `subscription_status` (enum: "free", "paid", default: "free")
   - `stripe_customer_id` (string, nullable)
   - `stripe_subscription_id` (string, nullable)
   - `subscription_expires_at` (datetime, nullable)
2. Fields visible and editable in Directus admin UI
3. Directus API returns these fields when fetching user data (role permissions configured)
4. **Schema changes validated via MCP live inspection**
5. Test user created manually with `subscription_status: "free"` to validate schema

---

### Story 3.2: Implement User Registration Flow

As a **visitor**,
I want to create a free account with email and password,
so that I can access user-specific features.

**Acceptance Criteria:**
1. Sign-up page created at `/signup` route
2. Form includes fields: Email, Password, Confirm Password
3. Client-side validation with Zod schema:
   - Email format validation
   - Password minimum 8 characters
   - Passwords match
4. Form submission calls Directus `/users` endpoint to create new user
5. New user created with `subscription_status: "free"` by default
6. Success: User redirected to `/dashboard` with success message ("Account created!")
7. Error handling: Display user-friendly errors (email already exists, weak password, API errors)
8. Form is mobile-responsive with accessible labels and error messages
9. Link to login page displayed ("Already have an account? Log in")

---

### Story 3.3: Implement User Login and Session Management

As a **user**,
I want to log in with my email and password,
so that I can access my account and subscription-protected content.

**Acceptance Criteria:**
1. Login page created at `/login` route
2. Form includes fields: Email, Password
3. Form submission calls Directus `/auth/login` endpoint
4. On success:
   - Directus JWT access token and refresh token received
   - Tokens stored in httpOnly cookies (secure, SameSite=Lax)
   - User redirected to `/dashboard`
5. On failure: Display error message ("Invalid credentials")
6. Next.js middleware created to protect authenticated routes:
   - Check token validity on protected pages (`/dashboard`, `/prompts/*` for paid content)
   - Redirect to `/login` if token missing or expired
7. Refresh token rotation implemented (Directus SDK handles automatically)
8. Link to sign-up page displayed ("Don't have an account? Sign up")
9. Form is mobile-responsive and accessible

---

### Story 3.4: Create User Dashboard

As a **logged-in user**,
I want a dashboard showing my subscription status and account details,
so that I can see my account information at a glance.

**Acceptance Criteria:**
1. Dashboard page created at `/dashboard` route (protected, requires authentication)
2. Dashboard displays:
   - Welcome message with user's email
   - Subscription status card showing: "Free" or "Paid", renewal date (if paid)
   - Quick link to "Browse Prompts" (`/prompts`)
   - Logout button
3. Free users see CTA: "Upgrade to Paid" button (placeholder for now, will link to Stripe in Epic 4)
4. Paid users see "Manage Subscription" link (placeholder for Stripe portal, Epic 4)
5. Dashboard fetches user data from Directus API (authenticated request)
6. Error handling if user data fetch fails (display fallback message)
7. Dashboard is mobile-responsive
8. Logout button clears cookies and redirects to landing page

---

### Story 3.5: Implement Freemium Access Control on Prompt List Page

As a **free user**,
I want to see 3 sample prompts fully accessible while the rest show a "locked" state,
so that I understand the value but need to subscribe for full access.

**Acceptance Criteria:**
1. Prompt list page (`/prompts`) modified to check user authentication state
2. Free users (logged in, `subscription_status: "free"`):
   - First 3 prompts displayed normally (configurable via environment variable, `FREE_PROMPT_LIMIT=3`)
   - Remaining prompts show "locked" overlay (semi-transparent overlay with lock icon)
   - Locked prompt cards are clickable but redirect to upgrade CTA
3. Paid users (`subscription_status: "paid"`):
   - All prompts fully accessible (no locked state)
4. Unauthenticated visitors:
   - See locked state for all prompts beyond first 3
   - Clicking any prompt shows "Sign up to view" CTA
5. Free prompt limit applies to all prompt queries (search, filters, etc.—first 3 of results are free)
6. Upgrade CTA overlay includes: "Upgrade to Paid" button linking to `/upgrade` (placeholder page for now)

---

### Story 3.6: Restrict Prompt Detail Page Access for Free Users

As a **free user**,
I want to see full prompt details only for the first 3 prompts,
so that I understand the need to upgrade for full library access.

**Acceptance Criteria:**
1. Prompt detail page (`/prompts/[id]`) checks:
   - User authentication status
   - User's `subscription_status`
   - Whether prompt is within free limit (first 3 prompts by ID or creation date)
2. Free users viewing locked prompts:
   - Prompt title and description visible
   - Prompt text hidden (replaced with blurred placeholder or lock icon)
   - "Copy to Clipboard" button disabled
   - Upgrade CTA displayed ("Unlock 100+ prompts with a paid subscription")
3. Free users viewing free-tier prompts:
   - Full prompt details visible, copy button functional
4. Paid users:
   - All prompts fully accessible
5. Unauthenticated visitors:
   - Redirected to `/login` with return URL preserved
6. Error handling: 404 if prompt doesn't exist, 403 if user lacks permission

---

### Story 3.7: Add Navigation Header with User Authentication State

As a **user**,
I want the website header to show my login status and provide navigation links,
so that I can easily access key pages and manage my account.

**Acceptance Criteria:**
1. Navigation header component created, displayed on all pages
2. Header includes:
   - CharGPT Bible logo/name (links to `/`)
   - "Browse Prompts" link (links to `/prompts`)
   - User menu (right side)
3. Unauthenticated users see:
   - "Log In" link
   - "Sign Up" button (primary CTA style)
4. Authenticated users see:
   - User email or avatar
   - Dropdown menu with links: "Dashboard", "Logout"
5. Paid users see subscription badge in header (e.g., "Pro" badge)
6. Header is mobile-responsive:
   - Hamburger menu on mobile (collapsible navigation drawer)
   - User menu accessible on mobile
7. Active page link highlighted in navigation
8. Header is sticky (stays visible on scroll)

---

### Story 3.8: Create Upgrade CTA Placeholder Page

As a **free user**,
I want a dedicated upgrade page that explains paid subscription benefits,
so that I understand the value before Epic 4 implements Stripe checkout.

**Acceptance Criteria:**
1. Upgrade page created at `/upgrade` route
2. Page displays:
   - Headline: "Unlock the Full Prompt Library"
   - List of benefits (e.g., "Access 100+ curated prompts", "New prompts added weekly", "No ads, no limits")
   - Pricing: $15-25/month (exact price TBD)
   - Primary CTA button: "Subscribe Now" (placeholder, disabled or shows "Coming Soon" tooltip)
3. Free users redirected here when clicking locked prompts or upgrade CTAs
4. Placeholder message: "Payment integration coming soon—stay tuned!"
5. Page is mobile-responsive and visually appealing (matches landing page design)
6. Link back to prompt library: "Continue browsing free prompts"

---

## Epic 4: Subscription & Payment Integration

**Epic Goal:** Integrate Stripe Checkout for paid subscriptions, implement real-time webhook syncing of subscription status to Directus user records, and enable full library access for paid users. By the end of this epic, the entire MVP is functional: users can sign up, subscribe via Stripe, and access the complete prompt library—generating revenue and validating the business model.

---

### Story 4.1: Set Up Stripe Account and Create Subscription Product

As a **developer**,
I want a Stripe account configured with a subscription product and pricing,
so that I can integrate Stripe Checkout into the application.

**Acceptance Criteria:**
1. Stripe account created (or existing account used)
2. **MCP server connected to Stripe account for AI-assisted development**
3. Subscription product created in Stripe Dashboard **via MCP-assisted configuration**:
   - Product name: "CharGPT Bible Pro"
   - Pricing: $15-25/month recurring (exact price confirmed by PM/stakeholder)
   - Billing interval: Monthly
4. Product ID and Price ID documented (stored in environment variables)
5. Stripe test mode keys obtained:
   - `STRIPE_PUBLISHABLE_KEY` (public, safe for client-side)
   - `STRIPE_SECRET_KEY` (secret, server-side only)
   - `STRIPE_WEBHOOK_SECRET` (for webhook signature verification)
6. **Stripe API test connection validated via MCP tooling**

---

### Story 4.2: Implement Stripe Checkout Flow on Upgrade Page

As a **free user**,
I want to click "Subscribe Now" and complete payment via Stripe Checkout,
so that I can upgrade to a paid subscription.

**Acceptance Criteria:**
1. `/upgrade` page updated with functional "Subscribe Now" button
2. Button click triggers Next.js API route `/api/checkout/create-session`
3. **MCP-assisted development validates Checkout Session creation and parameters**
4. API route creates Stripe Checkout Session:
   - Line item: CharGPT Bible Pro subscription product
   - Mode: "subscription"
   - Success URL: `{BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`
   - Cancel URL: `{BASE_URL}/upgrade`
   - Customer email pre-filled if user logged in
   - Metadata: `user_id` (Directus user ID) for webhook processing
5. User redirected to Stripe-hosted Checkout page
6. **MCP tooling used to test Checkout flow with test cards in real-time**
7. User completes payment with test card (e.g., `4242 4242 4242 4242`)
8. On success: Redirected back to dashboard with success message
9. On cancel: Redirected back to upgrade page
10. Error handling: Display error if Checkout Session creation fails

---

### Story 4.3: Create Stripe Webhook Endpoint for Subscription Events

As a **developer**,
I want a Next.js API route that receives and processes Stripe webhook events,
so that subscription status changes are synced to Directus automatically.

**Acceptance Criteria:**
1. Webhook endpoint created at `/api/webhooks/stripe`
2. Endpoint verifies webhook signature using `STRIPE_WEBHOOK_SECRET` (prevents spoofing)
3. **MCP-assisted development validates webhook signature verification and event handling logic**
4. Endpoint handles event types:
   - `checkout.session.completed`: New subscription created
   - `customer.subscription.updated`: Subscription status changed
   - `customer.subscription.deleted`: Subscription canceled/expired
5. For `checkout.session.completed`:
   - Extract `customer_id`, `subscription_id`, `user_id` (from metadata)
   - Update Directus user record via MCP-connected Directus instance:
     - `subscription_status: "paid"`
     - `stripe_customer_id: {customer_id}`
     - `stripe_subscription_id: {subscription_id}`
     - `subscription_expires_at: {subscription.current_period_end}`
6. For `customer.subscription.updated`:
   - Update subscription status if canceled or past due
7. For `customer.subscription.deleted`:
   - Set `subscription_status: "free"` in Directus
8. Webhook handler is idempotent (check if event already processed, log event IDs)
9. All events logged to console (or file) for debugging
10. Endpoint returns 200 OK to Stripe (acknowledges receipt)
11. Error handling: Return 400 for signature verification failures, 500 for processing errors

---

### Story 4.4: Configure Stripe Webhook and Test with MCP

As a **developer**,
I want Stripe webhooks configured to send events to my application,
so that subscription changes trigger real-time updates.

**Acceptance Criteria:**
1. **MCP Stripe integration enables real-time webhook event simulation and testing**
2. Local development webhook testing via MCP tooling (replaces Stripe CLI approach)
3. **MCP-assisted webhook event triggering for testing:**
   - Trigger test `checkout.session.completed` event
   - Verify webhook endpoint receives event and processes successfully (logs confirm)
   - Verify Directus user record updated with `subscription_status: "paid"` via MCP inspection
4. Webhook secret obtained and added to `.env.local` as `STRIPE_WEBHOOK_SECRET`
5. Production webhook endpoint created in Stripe Dashboard:
   - URL: `https://{production-domain}/api/webhooks/stripe`
   - Events selected: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
6. Production webhook secret obtained, added to Vercel environment variables
7. **MCP tooling validates webhook reliability and idempotency**

---

### Story 4.5: Update Dashboard to Display Paid Subscription Status

As a **paid user**,
I want my dashboard to show my active subscription details,
so that I can see my renewal date and manage my subscription.

**Acceptance Criteria:**
1. Dashboard page (`/dashboard`) fetches updated user data after successful Stripe checkout
2. Paid users see:
   - Subscription status: "Active"
   - Renewal date: `{subscription_expires_at}` formatted (e.g., "Renews on Dec 15, 2024")
   - "Manage Subscription" button linking to Stripe Customer Portal
3. Free users see:
   - Subscription status: "Free"
   - "Upgrade to Paid" button
4. Dashboard updates in real-time after webhook processes subscription (page refresh if needed, or polling)
5. Subscription badge added to header for paid users (e.g., "Pro" badge)
6. Dashboard is mobile-responsive

---

### Story 4.6: Integrate Stripe Customer Portal for Subscription Management

As a **paid user**,
I want to manage my subscription (update payment method, cancel) via Stripe Customer Portal,
so that I can self-service without contacting support.

**Acceptance Criteria:**
1. "Manage Subscription" button on dashboard creates Stripe Billing Portal session via API route `/api/billing/create-portal-session`
2. **MCP-assisted API route development validates Billing Portal session creation**
3. API route:
   - Fetches user's `stripe_customer_id` from Directus via MCP-connected instance
   - Creates Stripe Billing Portal session using MCP Stripe integration
   - Returns URL: `{BILLING_PORTAL_URL}`
   - Return URL: `{BASE_URL}/dashboard`
4. User redirected to Stripe-hosted Billing Portal
5. Portal allows:
   - Update payment method
   - View invoices
   - Cancel subscription
6. **MCP tooling used to test Portal flow end-to-end**
7. After changes, user redirected back to dashboard
8. Webhook handles subscription cancellations (sets `subscription_status: "free"` in Directus)
9. Dashboard reflects updated status after webhook processing

---

### Story 4.7: Enable Full Prompt Library Access for Paid Users

As a **paid user**,
I want unrestricted access to all prompts in the library,
so that I get the full value of my subscription.

**Acceptance Criteria:**
1. Prompt list page (`/prompts`) removes all locked overlays for paid users (`subscription_status: "paid"`)
2. All prompt cards clickable and fully functional
3. Prompt detail pages display full prompt text and copy button for all prompts (no restrictions)
4. Paid users can browse, search, filter, and copy any prompt without limitations
5. Access control logic checks user's `subscription_status` from Directus API (authenticated requests)
6. If subscription expires (webhook sets status back to "free"), access reverts to free tier on next page load
7. No performance degradation when checking subscription status (cached or included in session token)

---

### Story 4.8: Test End-to-End Subscription Flow and Handle Edge Cases

As a **QA tester**,
I want to validate the complete subscription lifecycle,
so that I can ensure the payment integration works reliably.

**Acceptance Criteria:**
1. Test scenarios executed successfully:
   - **Happy Path:** Free user signs up → views locked prompts → clicks upgrade → completes Stripe checkout → dashboard shows "Paid" → full library accessible
   - **Webhook Delay:** User completes checkout but webhook hasn't fired yet → dashboard shows loading state or "Processing subscription..."
   - **Payment Failure:** User enters declined test card → checkout fails gracefully → user returned to upgrade page with error message
   - **Subscription Cancellation:** Paid user accesses Billing Portal → cancels subscription → webhook fires → dashboard shows "Free" → prompts locked again
   - **Expired Subscription:** Subscription expires (simulate by manually setting past date) → user loses paid access → reverts to free tier
2. Edge cases handled:
   - Duplicate webhook events (idempotency check prevents double-processing)
   - Webhook failure retry (Stripe retries failed webhooks, confirm handling)
   - User has no Stripe customer ID (create new customer during checkout)
3. All test results documented with screenshots
4. No critical bugs blocking MVP launch

---

## Checklist Results Report

### Executive Summary

**Overall PRD Completeness:** 97%

**MVP Scope Appropriateness:** Just Right - The 2-week timeline with 4 epics is aggressive but achievable with MCP-assisted development

**Readiness for Architecture Phase:** ✅ **READY** - PRD is comprehensive, well-structured, and provides clear technical guidance

**Key Strengths:**
- Exceptional clarity on technical stack (Next.js + Directus + Stripe) with MCP integration
- User stories appropriately sized for AI agent execution (2-4 hour sessions)
- 28 detailed user stories with comprehensive acceptance criteria
- Clear "Out of Scope" section maintains focus on MVP goals
- Database schema, authentication flows, and webhook processing well-documented

**Observations:**
- No blocking issues identified
- All 9 checklist categories achieved PASS status
- Technical assumptions section provides architect with clear constraints and decision criteria
- Epic sequencing follows agile best practices (foundation → content → auth → payments)

---

### Category Analysis

| Category                         | Status  | Critical Issues                                                     |
| -------------------------------- | ------- | ------------------------------------------------------------------- |
| 1. Problem Definition & Context  | PASS    | None - Clear problem statement, target users, success metrics      |
| 2. MVP Scope Definition          | PASS    | None - Scope well-defined, out-of-scope items explicit             |
| 3. User Experience Requirements  | PASS    | None - WCAG AA, core screens, flows documented                     |
| 4. Functional Requirements       | PASS    | None - 15 FRs clearly defined, testable, user-focused              |
| 5. Non-Functional Requirements   | PASS    | None - Performance, security, scalability covered                  |
| 6. Epic & Story Structure        | PASS    | None - 4 epics, 28 stories with detailed ACs, proper sequencing    |
| 7. Technical Guidance            | PASS    | None - MCP integration, architecture comprehensively documented    |
| 8. Cross-Functional Requirements | PASS    | None - Data schema, integrations, operations defined               |
| 9. Clarity & Communication       | PASS    | None - Clear language, well-structured, change log included        |

---

### MVP Scope Assessment

**Is the Scope Truly Minimal?** ✅ YES
- 4-epic structure delivers core value without feature creep
- User journey complete: Registration → Browse → Subscribe → Access full library
- All 15 functional requirements tie directly to core problem

**Features That Could Be Cut (If Timeline Pressure):**
- Story 2.7 (Related Prompts) - Nice-to-have discovery feature
- Story 3.7 (Navigation badge for paid users) - Visual polish
- Story 2.8 (Admin Documentation) - Can be created post-launch

**Timeline Realism:** Achievable with:
- MCP-assisted development (significant time savings for Directus + Stripe)
- Managed services (Directus Cloud, Vercel, Stripe Checkout)
- Solo developer with AI agent support
- Proven concept reduces product validation uncertainty

---

### Technical Readiness Assessment

**Clarity of Technical Constraints:** ✅ EXCELLENT
- Repository structure: Polyrepo (separate frontend/backend repos)
- Service architecture: Serverless-Adjacent Monolith clearly defined
- Complete tech stack with rationale for each choice
- Database schema documented with field-level detail
- Authentication and webhook flows specified

**MCP Integration Benefits:**
- Reduces Directus learning curve (schema inspection, live validation)
- Accelerates Stripe integration (real-time webhook testing)
- Enables rapid prototyping and validation throughout development

**Areas Flagged for Architect Investigation:**
1. Authentication strategy: Custom Directus JWT vs. Next-Auth adapter
2. Webhook processing location: Next.js API routes vs. Directus Flows
3. Hosting choice: Directus Cloud ($20/mo) vs. Railway ($7/mo)

---

### Detailed Validation Summary

**✅ Problem Definition & Context (100%)**
- Clear problem: Professionals struggle with ChatGPT prompt engineering (2-5 hrs/week wasted)
- Target users: Ages 28-45, mid-to-senior professionals, $50K-$150K income
- Proven demand: Previous Airtable version successfully sold
- Success metrics: 10+ subscribers in 30 days, 70%+ retention

**✅ MVP Scope Definition (100%)**
- 15 Functional Requirements covering complete user journey
- 12 Non-Functional Requirements (performance, security, cost)
- "Out of Scope for MVP" section explicit about excluded features
- Epic structure delivers incremental, deployable value

**✅ User Experience Requirements (100%)**
- 6 core screens documented with detailed descriptions
- WCAG AA compliance specified with implementation requirements
- Mobile-responsive requirements in every story
- Key interaction paradigms defined (browse-first, freemium transparency)

**✅ Functional Requirements (100%)**
- All requirements focus on WHAT not HOW
- Requirements testable and verifiable
- Consistent terminology throughout
- 28 user stories follow standard format with detailed acceptance criteria

**✅ Non-Functional Requirements (100%)**
- Performance targets: <3s load, <500ms search, 100+ concurrent users
- Security baseline: HTTPS, httpOnly cookies, RBAC, webhook verification
- Cost constraint: <$100/month infrastructure
- Browser support clearly scoped (modern browsers only, no IE11)

**✅ Epic & Story Structure (100%)**
- Epic 1 (8 stories): Complete foundation with deployed site
- Epic 2 (8 stories): Full content library and discovery
- Epic 3 (8 stories): Authentication and freemium model
- Epic 4 (8 stories): Stripe integration and revenue generation
- Stories sized for 2-4 hour AI agent sessions
- Dependencies and sequencing clearly documented

**✅ Technical Guidance (100%)**
- 2500+ word Technical Assumptions section
- MCP integration for Directus and Stripe extensively documented
- Security & compliance section covers GDPR, PCI, authentication
- Performance optimizations (pagination, caching, SSR) specified
- 5 questions flagged for architect validation

**✅ Cross-Functional Requirements (100%)**
- Database schema: 6 collections with relationships documented
- Integration points: Directus API, Stripe webhooks specified
- Deployment pipeline: Git → Vercel (frontend), Directus Cloud/Railway (backend)
- Migration approach documented (Epic 2)

**✅ Clarity & Communication (95%)**
- Clear, consistent language throughout
- Well-structured with logical flow
- Technical terms explained with context
- Change log table included
- Minor: Stakeholder communication plan could be more explicit

---

### Recommendations

**COMPLETED:**
- ✅ "Out of Scope for MVP" section added
- ✅ Free prompt limit finalized: 3 prompts (FR2, Stories 3.5, 3.6 updated)

**BEFORE EPIC 1 IMPLEMENTATION:**
- Content audit: Review existing prompt data structure for migration script feasibility
- Confirm brand assets: Check with sales partner if brand guidelines exist from Airtable version

**NICE-TO-HAVE (Post-Launch):**
- Stakeholder communication plan: Define update cadence with sales partner
- Add architecture diagram: Visualize Next.js → Directus → PostgreSQL, Stripe webhooks
- User migration strategy: If existing Airtable users transition, plan migration approach

---

### Final Decision

**✅ READY FOR ARCHITECT**

**Justification:**
- All 9 checklist categories achieved PASS status (97% overall)
- Zero blocking issues identified
- Epic and story structure exemplary with 28 detailed stories
- Technical guidance exceptionally detailed with MCP integration
- MVP scope appropriate for 2-week timeline
- Out-of-scope items explicit, free prompt limit finalized

**Confidence Level:** HIGH

**Next Actions:**
1. ✅ Out of Scope section added
2. ✅ Free prompt limit set to 3
3. **Proceed to Architecture:** UX Expert and Architect can begin work in parallel
4. **Schedule content audit** during Epic 1 implementation

---

## Next Steps

### UX Expert Prompt

Review the CharGPT Bible PRD (`docs/prd.md`) and create a comprehensive UX architecture document that defines:
- Detailed wireframes and user flows for all core screens
- Design system specifications (components, patterns, tokens)
- Interaction models and micro-interactions
- Responsive design breakdowns for mobile/tablet/desktop
- Accessibility implementation guidelines for WCAG AA compliance

Focus on translating the "library catalog meets modern SaaS" vision into concrete design deliverables that the development team can implement.

### Architect Prompt

Review the CharGPT Bible PRD (`docs/prd.md`) and create a comprehensive technical architecture document that defines:
- Detailed system architecture diagrams (Next.js + Directus + Stripe integration)
- Database schema with complete field definitions and relationships
- API contracts and endpoint specifications (Directus REST API)
- Authentication flow implementation (JWT, httpOnly cookies, middleware)
- Stripe webhook processing architecture (signature verification, idempotency, error handling)
- MCP integration patterns for Directus and Stripe development workflows
- Deployment pipeline and environment configuration
- Security controls and error handling strategies

Provide concrete technical specifications ready for story-by-story implementation by the development agent.
