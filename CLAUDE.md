# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CharGPT Bible is a subscription-based web application that provides curated, job-specific ChatGPT prompt templates for professionals. The platform addresses the problem of professionals struggling to craft effective prompts by offering a searchable library organized by role and task type.

**Target MVP Timeline:** 2 weeks
**Business Model:** Freemium SaaS ($15-25/month subscription)
**Key Value Prop:** Browse, copy, and use proven prompts - no prompt engineering required

### Previous Context
- A previous version (GPT Bible on Airtable) successfully validated market demand
- Sales/marketing partner handles customer acquisition
- Existing prompt content library ready for migration

## Tech Stack

### Frontend
- **Framework:** Next.js 14+ with App Router (TypeScript strict mode)
- **Styling:** Tailwind CSS 3+ with default breakpoints (360px, 640px, 768px, 1024px, 1440px)
- **State Management:** React Context for auth/session + SWR for server cache (5-min TTL)
- **Data Fetching:** React Server Components (SSR) + SWR for client-side caching
- **Forms:** React Hook Form + Zod validation
- **Deployment:** Vercel (free tier, automatic HTTPS, serverless functions)

### Backend
- **BaaS:** Directus 10+ (managed headless CMS)
- **Database:** PostgreSQL 14+ (managed by Directus Cloud or Railway)
- **API:** Directus REST API (prefer over GraphQL for MVP simplicity)
- **Authentication:** Directus built-in JWT auth (httpOnly cookies)
- **Hosting:** Directus Cloud ($20/mo) OR Railway/Render ($7-10/mo Docker)

### Payment Processing
- **Provider:** Stripe
- **Integration:** Stripe Checkout (hosted payment page), Customer Portal
- **Webhook Handling:** Next.js API routes at `/api/webhooks/stripe`

### Development Tooling
- **MCP Integration:** Critical for rapid development
  - Directus MCP: Real-time schema inspection, automated collection creation, live API testing
  - Stripe MCP: Real-time webhook testing, Checkout Session validation, event simulation
- **Testing:** Vitest for unit tests (minimal MVP scope), manual E2E testing
- **CI/CD:** Vercel Git integration (automatic deploys on push to main)

## Repository Structure

**Architecture:** Polyrepo (separate repositories for MVP speed)

### Main Repositories
1. **`chargpt-bible-frontend`** (Next.js application)
   - `app/` - Next.js App Router pages and API routes
   - `components/` - Reusable React components
   - `lib/` - Utilities, Directus client, Stripe client, auth helpers
   - `types/` - TypeScript interfaces (mirror Directus schema)
   - `public/` - Static assets

2. **`directus-config`** (Directus schema and migrations)
   - `scripts/` - Migration scripts (e.g., migrate-prompts.js)
   - `snapshots/` - Directus schema snapshots (schema.yaml)
   - `data/` - Seed data and prompt sources

**Current State:** Documentation-only (brief.md, architecture.md, prd.md)

## Core Data Models

### User (Extended Directus User)
- Built-in Directus fields + custom subscription fields
- `subscription_status`: 'free' | 'paid' (default: 'free')
- `stripe_customer_id`, `stripe_subscription_id`, `subscription_expires_at`
- Access control enforced via Directus RBAC (Free vs Paid roles)

### Prompt
- `title`, `description`, `prompt_text` (max 5000 chars)
- `difficulty_level`: 'beginner' | 'intermediate' | 'advanced'
- `status`: 'draft' | 'published' | 'archived'
- Many-to-Many relationships: Categories, Job Roles

### Category & JobRole (Taxonomy)
- `name`, `slug`, `description`, `sort` order
- Used for filtering and organizing prompts

### Junction Tables
- `prompt_categories`, `prompt_job_roles` (Many-to-Many)

## Key Technical Patterns

### Authentication Flow
1. User submits email/password → Next.js calls Directus `/auth/login`
2. Receives JWT access token (15-min expiry) + refresh token (7-day)
3. Tokens stored in httpOnly cookies (XSS protection)
4. Next.js middleware checks token validity on protected routes
5. Directus SDK handles automatic token refresh

### Freemium Access Control
- Free users: See 3 prompts fully (configurable via `FREE_PROMPT_LIMIT` env var)
- Paid users: Unrestricted access to all prompts
- Access enforced at Directus API level via RBAC (security in-depth)
- Frontend checks `subscription_status` from authenticated user session

### Stripe Webhook Flow
1. Stripe event (e.g., `checkout.session.completed`) → Next.js `/api/webhooks/stripe`
2. Verify webhook signature using `STRIPE_WEBHOOK_SECRET`
3. Parse event, extract customer_id and subscription details
4. Update Directus user record via API (subscription_status, stripe IDs)
5. Handler is idempotent (check for duplicate events by event ID)
6. Log all events for debugging, return 200 OK to Stripe

### Performance Optimizations
- **SSR for initial load:** Server Components fetch data, URL params drive filters
- **SWR for client caching:** 5-minute stale-while-revalidate cache
- **Pagination:** 20 prompts per page (Directus API limit/offset)
- **Static generation:** Landing page and marketing content
- **Code splitting:** Automatic per-route bundles via Next.js

## Development Workflow

### Initial Setup (Not Yet Done)
```bash
# Frontend
git clone https://github.com/your-org/chargpt-bible-frontend.git
cd chargpt-bible-frontend
npm install
cp .env.local.example .env.local
# Edit .env.local with credentials
npm run dev
```

### Common Commands (Future)
```bash
# Frontend Development
npm run dev              # Start dev server (localhost:3000)
npm run type-check       # TypeScript validation
npm run lint             # ESLint
npm run build            # Production build
npm run test             # Unit tests (Vitest)

# Backend (Directus Config)
npm run seed:categories  # Seed taxonomy
npm run seed:roles       # Seed job roles
npm run migrate          # Migrate prompts from docs
npm run schema:snapshot  # Export Directus schema
```

### Environment Variables (Required)
```bash
# Frontend (.env.local)
NEXT_PUBLIC_DIRECTUS_URL=https://your-instance.directus.app
DIRECTUS_URL=https://your-instance.directus.app
DIRECTUS_ADMIN_TOKEN=your_admin_token
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
NEXT_PUBLIC_BASE_URL=http://localhost:3000
FREE_PROMPT_LIMIT=3
```

## Implementation Approach

### Epic Structure (4 Epics, 28 Stories)
1. **Epic 1: Foundation & Prompt Display** (8 stories)
   - Next.js + Directus setup, basic prompt browsing
   - Deploy to Vercel, seed initial data
   - Result: Public website with visible prompts

2. **Epic 2: Content Management & Discovery** (8 stories)
   - Migrate existing prompt library
   - Implement search, filtering by category/role/difficulty
   - Optimize performance with caching

3. **Epic 3: Authentication & Access Control** (8 stories)
   - User registration/login (Directus JWT)
   - Freemium model (3 free prompts, rest locked)
   - User dashboard

4. **Epic 4: Subscription & Payment** (8 stories)
   - Stripe Checkout integration
   - Webhook processing for subscription sync
   - Customer Portal for self-service management
   - Full library access for paid users

### Story Sizing
- Each story designed for 2-4 hour AI agent implementation sessions
- Detailed acceptance criteria in PRD (Directus-website/docs/prd.md)
- Dependencies clearly sequenced (foundation → content → auth → payments)

## Critical Development Practices

### MCP-Assisted Development
- **Always use MCP when working with Directus or Stripe**
- MCP enables real-time schema inspection, validation, and testing
- Significantly reduces learning curve and accelerates Epic 1, 2, and 4
- Example use cases:
  - Creating Directus collections and relationships
  - Testing Stripe webhook events without Stripe CLI
  - Validating API responses against live schema

### Security Requirements
- **Never commit secrets:** Use `.env.local` (gitignored) and Vercel env vars
- **Directus RBAC:** Enforce Free vs Paid permissions at API level
- **Webhook security:** Always verify Stripe webhook signatures
- **Input sanitization:** Directus handles internally, avoid raw SQL
- **Rate limiting:** Configure Directus for 100 req/min per IP
- **XSS protection:** httpOnly cookies, React auto-escaping
- **HTTPS everywhere:** Automatic via Vercel and Directus Cloud

### TypeScript Standards
- **Strict mode enforced:** No implicit any, explicit return types required
- **Type sharing:** Define shared types in `types/` directory (mirror Directus schema)
- **Never use `any`:** Use `unknown` with type guards instead
- **Explicit nullables:** Use `| null` not `?` for optional fields

### API Integration Patterns
- **Never direct fetch in components:** Use service layer (`lib/services/`)
- **Directus SDK everywhere:** No raw SQL, use SDK for all DB operations
- **Error handling:** Standard error handler for all API routes
- **Authentication:** Directus client auto-handles token refresh

### Testing Strategy (MVP)
- **Primary:** TypeScript strict mode as bug prevention
- **Secondary:** Manual testing of critical flows (15-min checklist)
- **Selective unit tests:** High-value utilities only (webhook signature, formatters)
- **No E2E tests yet:** Deferred to post-MVP per PRD
- **Performance:** Lighthouse validation (<3s load, 90+ score)

## Architecture Decisions & Rationale

### Why Polyrepo (Not Monorepo)?
- **Speed:** Simpler deployment, no Turborepo/Nx overhead for 2-week timeline
- **Independence:** Frontend and backend deploy separately (Vercel vs Directus Cloud)
- **Future-proof:** Can consolidate to monorepo post-MVP if shared code emerges

### Why Directus BaaS (Not Custom Backend)?
- **Eliminates weeks of work:** REST API, auth, RBAC, admin UI out-of-box
- **Production-grade:** Battle-tested, handles 100+ concurrent users
- **2-week feasibility:** Only achievable by avoiding custom backend code
- **Content management:** Native CMS for admins to add prompts (<3 min per prompt)

### Why Stripe Checkout (Not Custom)?
- **PCI compliance:** Stripe handles card data, reduces security burden
- **Reliability:** Webhooks with automatic retry, idempotency built-in
- **Time-saving:** Hosted UI eliminates payment form development
- **Customer Portal:** Self-service subscription management included

### Why Next.js App Router?
- **Server Components:** Reduces client JS by 60-70%, improves performance
- **Built-in API routes:** Perfect for webhook handlers
- **Vercel-optimized:** Zero-config deployment, automatic edge distribution
- **TypeScript-first:** Excellent DX with strict mode

## Performance Targets

- **Initial Page Load:** <3 seconds (4G connection)
- **Time to Interactive:** <5 seconds
- **Search/Filter Response:** <500ms
- **Lighthouse Score:** 90+ (Performance, Accessibility, Best Practices, SEO)
- **Concurrent Users:** 100+ without degradation
- **Infrastructure Cost:** <$100/month

## Accessibility Requirements

- **Target:** WCAG 2.1 Level AA compliance
- **Keyboard navigation:** All interactive elements
- **Color contrast:** 4.5:1 minimum for text
- **Semantic HTML:** Proper headings, landmarks, buttons
- **Screen reader friendly:** aria-labels where needed
- **Touch targets:** 48px minimum for mobile

## Key Files to Reference

- **Project Brief:** `Directus-website/brief.md` - Business context, problem statement, success metrics
- **Architecture Doc:** `Directus-website/docs/architecture.md` - Complete technical specifications, diagrams, workflows
- **PRD:** `Directus-website/docs/prd.md` - All 28 user stories with detailed acceptance criteria

## Known Constraints

- **Timeline:** 2-week hard deadline for MVP
- **Budget:** $0 upfront, ~$20-35/month operational costs
- **Resources:** Solo developer with Claude Code assistance
- **Technical:** Must use Directus (non-negotiable), must integrate Stripe
- **Scope:** MVP features only - no AI generation, social features, or mobile apps

## Post-MVP Considerations

Features explicitly deferred (see PRD "Out of Scope"):
- AI-powered prompt generation/customization
- In-app ChatGPT integration
- Social features (comments, ratings, favorites)
- Multiple subscription tiers or annual billing
- Mobile native apps (web-only for MVP)
- Advanced analytics dashboard
- User-generated content

## Development Notes

### When Starting Epic 1
1. Confirm Directus hosting choice (Cloud $20/mo vs Railway $7/mo)
2. Set up MCP servers for both Directus and Stripe
3. Create `.env.local.example` with all required variables
4. Initialize Next.js with TypeScript strict mode + Tailwind

### Migration Script Strategy
- Parse existing prompt docs (format TBD during Epic 1)
- Use Directus SDK for bulk import (not raw SQL)
- Include dry-run mode for preview
- Handle errors gracefully (log failures, continue)
- Target: Complete in <5 minutes for full library

### Webhook Idempotency Pattern
- Log all Stripe event IDs to Directus or file
- Check if event ID already processed before updating user
- Return 200 OK even if already processed (Stripe expects this)
- Set reasonable timeout for webhook handler (<10s)

## Common Pitfalls to Avoid

1. **Don't skip Directus RBAC setup:** Access control must be at API level, not just UI
2. **Don't trust webhook events blindly:** Always verify Stripe signatures
3. **Don't forget pagination:** Prompt library will grow, always paginate (20 per page)
4. **Don't over-engineer:** Stick to MVP scope, resist feature creep
5. **Don't neglect mobile:** Every story requires mobile-responsive design
6. **Don't cache subscription status too long:** Max 5 minutes to avoid access issues
7. **Don't skip error states:** Empty states, loading states, error messages all required

## Quick Reference

**Freemium Logic:** `FREE_PROMPT_LIMIT=3` (env var)
**Pagination:** 20 prompts per page
**Cache TTL:** 5 minutes (SWR)
**JWT Expiry:** 15 min access, 7 day refresh
**Webhook Events:** `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
**Browser Support:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+ (no IE11)
**Mobile Breakpoints:** 360px (mobile), 640px (sm), 768px (md), 1024px (lg), 1440px (xl)
