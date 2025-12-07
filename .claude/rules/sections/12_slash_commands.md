# Slash Command Workflows

AI-assisted development workflows for Next.js 14 + Directus CMS ChatGPT Bible framework.

## 🔗 End-to-End Integrated Approach

All workflows follow the **complete data chain** principle:

```
TypeScript Interface → Service Function → Component/Page → Directus Collection → Validate
```

This ensures no fragmentation - every layer of the stack stays in sync.

## Framework Overview

- **Tech Stack**: Next.js 14 (App Router) + Directus CMS + TypeScript + Tailwind CSS
- **Architecture**: Block-based page builder with M2A (Many-to-Any) relationships + Prompt catalog system
- **Pattern**: Server Components by default, Client Components only for interactivity
- **Data Layer**: `lib/directus.ts` (client), `lib/services/` (fetch functions), `types/` (interfaces)

---

## Quick Reference

| Command | Purpose | Complete Chain |
|---------|---------|----------------|
| `/prime` | Load project context | Start of session |
| `/research feature` | Generate compressed research | `/prime` → `/planning` |
| `/planning feature` | Create implementation plan | `/prime` or `/research` |
| `/review type artifact` | Human review checkpoint | After research/plan/code |
| `/execute feature` | Implement from plan | `/planning` |
| `/commit` | Git commit | `/execute` |
| `/rca issue-id` | Investigate bug | `/prime` |
| `/implement-fix issue-id` | Fix from RCA | `/rca` |
| `/add-service name` | Create Directus service | TS → Service → Directus |
| `/add-block name` | Create CMS block | TS → Service → Component → Directus |
| `/add-page type route` | Create new page | TS → Service → Page → Directus |
| `/add-prompt-feature name` | Add prompt catalog feature | TS → Service → Component → Directus |
| `/convert-html-flow` | Interactive HTML → Next.js + Directus | Conversational workflow |

---

## The Complete Chain Philosophy

### Why End-to-End Integration Matters

❌ **Fragmented approach (old)**:
- Edit TypeScript... somewhere
- Create component... separately
- Hope Directus matches... maybe

✅ **Integrated approach (new)**:
- Every workflow covers the FULL chain
- Schema validation at each step
- Directus setup checklist aligned to TypeScript
- Build validation before completion

### The Chain for Services

```
1. TypeScript Interface (types/)
   - Add {Name} interface
   - Export from types/index.ts if needed

2. Service Function (lib/services/{name}.ts)
   - Create get{Name}() function
   - Use directus client from lib/directus.ts
   - Handle errors with try-catch
   - Return null on error, not throw (unless critical)

3. Component/Page Usage
   - Import service function
   - Call in Server Component
   - Handle null/empty states gracefully

4. Directus Collection (admin setup)
   - Create collection matching TypeScript interface
   - Add fields matching interface exactly
   - Set permissions (public read for content)

5. Validation (build + runtime)
   - npm run lint && npx tsc --noEmit && npm run build
```

### The Chain for Blocks

```
1. TypeScript Interface (types/blocks.ts)
   - Add Block{Name} interface
   - Register in blocks union type

2. Service Function (lib/directus-pages.ts or lib/services/)
   - Create get{Name}Block(blockId) function
   - Or extend getBlockData() to handle new type

3. React Component (components/blocks/{Name}.tsx)
   - Accept data prop with block type
   - Handle null/empty states gracefully

4. Block Renderer Wiring (components/blocks/BlockRenderer.tsx)
   - Add case for new block type
   - Map to component

5. Directus Collection (admin setup)
   - Create block_{name} collection
   - Add fields matching TypeScript interface
   - Configure M2A junction (page_blocks)

6. Validation (build + runtime)
   - npm run lint && npx tsc --noEmit && npm run build
```

### The Chain for Prompt Features

```
1. TypeScript Interface (types/Prompt.ts or types/)
   - Add/update Prompt interface or related type
   - Export from types/

2. Service Function (lib/services/prompts.ts or new service)
   - Create get{Feature}() function
   - Follow existing getPrompts() pattern
   - Handle filters, pagination, relations

3. React Component (components/prompts/ or app/prompts/)
   - Create UI component
   - Use service function
   - Handle loading/error states

4. Directus Collection (if new)
   - Create/update collection
   - Add fields matching TypeScript
   - Set up relations (categories, job_roles, etc.)

5. Validation (build + runtime)
   - npm run lint && npx tsc --noEmit && npm run build
```

---

## Development Workflows (RPI Framework)

### Simple Tasks (Button color, small fixes)

```
┌─────────────────────────────────────────────────────────┐
│              SIMPLE TASK CYCLE                          │
└─────────────────────────────────────────────────────────┘

1. /prime
   │ Loads: Project context
   ↓

2. /planning simple-feature
   │ Creates: plans/simple-feature.md (with code snippets)
   ↓

3. /execute simple-feature
   │ Implements: All tasks from plan
   ↓

4. /commit
   │ Commits: feat: add simple feature
   ↓

   READY FOR NEXT CYCLE
```

### Medium Tasks (New service, single feature)

```
┌─────────────────────────────────────────────────────────┐
│              MEDIUM TASK CYCLE (RPI)                    │
└─────────────────────────────────────────────────────────┘

1. /prime
   │ Loads: Project context
   ↓

2. /research feature-name
   │ Creates: docs/research/feature-name.md
   │ Compressed: System behavior, patterns, constraints
   ↓

3. /review research feature-name
   │ Human: Verify research accuracy
   ↓

4. /planning feature-name
   │ Creates: plans/feature-name.md
   │ Includes: Code snippets, BEFORE/AFTER examples
   ↓

5. /review plan feature-name
   │ Human: Verify plan correctness
   ↓

6. /execute feature-name
   │ Implements: Low-context execution from detailed plan
   ↓

7. /commit
   │ Commits: feat: add feature-name
   ↓

   READY FOR NEXT CYCLE
```

### Complex Tasks (Multi-repo, major refactor)

```
┌─────────────────────────────────────────────────────────┐
│              COMPLEX TASK CYCLE (Full RPI)              │
└─────────────────────────────────────────────────────────┘

1. /prime
   │ Loads: Project context
   ↓

2. /research feature-name [deep-scope]
   │ Creates: docs/research/feature-name.md
   │ Deep: Vertical slices, all dependencies
   ↓

3. /review research feature-name
   │ Human: Critical review - catch wrong direction
   ↓

4. /planning feature-name
   │ Creates: plans/feature-name.md
   │ Detailed: Exact code snippets, line numbers, tests
   ↓

5. /review plan feature-name
   │ Human: Critical review - prevent wasted effort
   ↓

6. /execute feature-name
   │ Implements: Minimal context, maximum precision
   ↓

7. /review code feature-name
   │ Human: Quality check
   ↓

8. /commit
   │ Commits: feat: add feature-name
   ↓

   READY FOR NEXT CYCLE
```

---

## Bug Fix Workflow

```
┌─────────────────────────────────────────────────────────┐
│                    BUG FIX CYCLE                        │
└─────────────────────────────────────────────────────────┘

1. /prime
   │ Understands: Project context
   ↓

2. /rca 123
   │ Creates: docs/rca/issue-123.md
   ↓

3. /implement-fix 123
   │ Fixes: Bug per RCA document
   ↓

4. /commit
   │ Commits: fix: description (Fixes #123)
   ↓

   ISSUE RESOLVED
```

---

## Framework-Specific Workflows

### New Service Function (End-to-End)

```
/prime → /add-service categories → /commit

Chain executed:
  ✓ types/Category.ts (verify/update interface)
  ✓ lib/services/categories.ts (getCategories function)
  ✓ Error handling with try-catch
  ✓ Returns null on error
  ✓ Directus collection checklist provided
  ✓ npm run build (validated)
```

### New Block (End-to-End)

```
/prime → /add-block faq → /commit

Chain executed:
  ✓ types/blocks.ts (BlockFaq interface)
  ✓ lib/directus-pages.ts (getFaqBlock or extend getBlockData)
  ✓ components/blocks/Faq.tsx
  ✓ components/blocks/BlockRenderer.tsx (wired)
  ✓ Directus checklist provided
  ✓ npm run build (validated)
```

### New Prompt Feature (End-to-End)

```
/prime → /add-prompt-feature filters → /commit

Chain executed:
  ✓ types/Prompt.ts (verify/update interface)
  ✓ lib/services/prompts.ts (getPrompts with new filters)
  ✓ components/prompts/FilterBar.tsx (if needed)
  ✓ app/prompts/page.tsx (integrated)
  ✓ Directus checklist (if schema changes)
  ✓ npm run build (validated)
```

### New Page - List (End-to-End)

```
/prime → /add-page list categories → /commit

Chain executed:
  ✓ types/Category.ts (verify interface)
  ✓ lib/services/categories.ts (getCategories function)
  ✓ app/categories/page.tsx
  ✓ Metadata & SEO
  ✓ Directus checklist provided
  ✓ npm run build (validated)
```

### New Page - Detail (End-to-End)

```
/prime → /add-page detail categories → /commit

Chain executed:
  ✓ types/Category.ts (verify interface)
  ✓ lib/services/categories.ts (getCategoryBySlug function)
  ✓ app/categories/[slug]/page.tsx
  ✓ generateStaticParams included
  ✓ Dynamic metadata
  ✓ npm run build (validated)
```

### HTML to Next.js Conversion Flow ⭐ NEW

Interactive conversational workflow for converting HTML files to Next.js pages with automatic Directus collection analysis:

```
1. Upload HTML files
2. Configure sitemap (filename → route mapping)
3. Convert HTML → Next.js component
4. Analyze data structure → Propose Directus collections
5. Modify schema (add fields, relations)
6. Create collections in Directus
7. Connect page to Directus API
```

**Example Flow:**

```
USER: [uploads products.html, product-detail.html]
USER: products is /products, product-detail is /products/[slug]
USER: convert products.html to nextjs
USER: what collections does this need?
USER: add category relation and stock_count
USER: yes create it
USER: update the nextjs page
```

---

## Command Details

### /prime

Loads comprehensive project context:

- Reads `CLAUDE.md` and rule sections from `.claude/rules/sections/`
- Understands `types/` patterns and interfaces
- Reviews `lib/services/` data fetching patterns
- Checks `lib/directus.ts` client setup
- Lists available components and pages
- Summarizes current block types and collections
- Checks git state (if repository exists)

**Use this at the start of every session** to establish context.

### /research [feature-name] [scope]

Generates compressed research document (RPI Framework):

- Creates vertical slices through codebase
- Documents current system behavior
- Identifies key patterns and constraints
- Finds similar implementations
- Outputs: `docs/research/[feature-name].md`
- **When to use**: Medium to complex features
- **When to skip**: Simple UI changes, single-file fixes

**Output**: Compressed "truth" based on actual code, preventing AI from "making stuff up"

### /planning [feature-name] [research-doc]

Creates detailed, executable implementation plan:

- **NEW**: Checks for research document and uses it
- **NEW**: Includes code snippets showing BEFORE/AFTER
- **NEW**: Documents current system behavior
- **NEW**: Includes exact line numbers for modifications
- Loads relevant reference guides from `docs/reference/`
- Studies existing patterns
- Outputs: `plans/[feature-name].md`
- Ready for `/review plan` or `/execute`

**Quality**: Plans are now "dumb-proof" with actual code examples

### /review [type] [artifact-name]

Human review checkpoints at high-leverage points:

- `research`: Review research document (highest leverage)
- `plan`: Review implementation plan (high leverage)
- `code`: Review code changes (lower leverage, still important)

**Impact**: Reviewing research/plans prevents catastrophic errors before implementation

### /execute [feature-name]

Implements features from plans:

- Reads plan file
- Executes tasks in order
- Validates after each step
- Reports completion

### /commit [files...]

Creates conventional commits:

- Reviews changes
- Determines commit type
- Creates formatted message
- Commits and confirms

### /rca [issue-id]

Documents root cause analysis:

- Fetches issue from GitHub (if available)
- Investigates code
- Documents root cause
- Proposes fix approach

### /implement-fix [issue-id]

Fixes bugs from RCA:

- Reads RCA document
- Implements fix steps
- Validates all changes
- Ready for commit

### /add-service [name]

Creates new Directus service function with **complete chain**:

1. Verifies/creates TypeScript interface in `types/`
2. Creates service function in `lib/services/{name}.ts`
3. Follows existing patterns (error handling, null returns)
4. Provides Directus collection setup checklist
5. Validates build

**Output includes schema alignment table** matching TypeScript to Directus.

### /add-block [name]

Creates new Directus block with **complete chain**:

1. Adds TypeScript interface to `types/blocks.ts` (Block{Name})
2. Creates/extends service function in `lib/directus-pages.ts` or `lib/services/`
3. Builds React component (components/blocks/{Name}.tsx)
4. Wires to BlockRenderer (components/blocks/BlockRenderer.tsx)
5. Provides Directus collection setup checklist
6. Validates build

**Output includes schema alignment table** matching TypeScript to Directus.

### /add-page [type] [route]

Creates new pages with **complete chain**:

- Types: `list`, `detail`, `cms`

1. Defines/verifies TypeScript interface in `types/`
2. Creates/verifies service function(s) in `lib/services/`
3. Creates page file(s) in `app/{route}/page.tsx` or `app/{route}/[slug]/page.tsx`
4. Adds proper metadata & SEO (static or `generateMetadata()`)
5. Handles empty states with graceful fallbacks
6. Includes `export const revalidate = 60` for ISR
7. Provides Directus setup checklist
8. Validates build

**Output includes schema alignment table** matching TypeScript to Directus.

**Page Types**:
- `list`: Collection listing page (e.g., `/categories`)
- `detail`: Dynamic detail page with `[slug]` route (e.g., `/categories/[slug]`)
- `cms`: Block-based page using Directus page builder (e.g., `/about`)

### /add-prompt-feature [name]

Adds new feature to prompt catalog system:

1. Verifies/updates TypeScript interface in `types/Prompt.ts` or related
2. Creates/updates service function in `lib/services/prompts.ts` or new service
3. Creates/updates component in `components/prompts/` or `app/prompts/`
4. Integrates with existing prompt pages
5. Provides Directus checklist (if schema changes needed)
6. Validates build

**Examples**: Filters, search, sorting, related prompts, favorites, etc.

### /convert-html-flow ⭐ NEW

Interactive conversational workflow for converting HTML files to Next.js pages with Directus integration.

**Session State Management:**

Tracks conversation state across commands:
- Uploaded HTML files
- Sitemap configuration (filename → route)
- Conversion status per page
- Proposed Directus collections
- Created collections

**Command Recognition Patterns:**

1. **File Upload Detection**
   - User uploads HTML files → Initialize session state

2. **Sitemap Configuration**
   - Pattern: `{filename} is {route}` or `{filename} → {route}`
   - Examples: `"homepage is root"`, `"products is /products"`, `"product-detail is /products/[slug]"`

3. **Conversion Requests**
   - Pattern: `convert|make|turn` + `{filename}` + `nextjs|component|page`
   - Examples: `"convert products.html to nextjs"`, `"make products page into a component"`

4. **Collection Analysis**
   - Pattern: `collections|data structure|database tables|schema`
   - Examples: `"what collections needed?"`, `"analyze the data structure"`

5. **Schema Modifications**
   - Pattern: `add` + `{field}` + `{type|relation}`
   - Examples: `"add category relation and stock_count"`, `"add field X as type Y"`

6. **Execution**
   - Pattern: `yes|create|make|proceed` + `it`
   - Examples: `"yes create it"`, `"create it"`, `"make it"`

7. **Page Updates**
   - Pattern: `update|connect` + `nextjs|directus|page`
   - Examples: `"update the nextjs page"`, `"connect to directus"`

**Workflow Steps:**

1. **Initialize Session** - Track uploaded files and state
2. **Parse Sitemap** - Map filenames to Next.js routes
3. **Convert HTML to Next.js** - Generate React components from HTML
4. **Analyze Collections** - Detect repeating patterns and propose Directus schema
5. **Update Proposed Collection** - Modify schema based on user input
6. **Execute Proposed Action** - Create collections in Directus via MCP
7. **Connect Page to Directus** - Add data fetching and TypeScript types

---

## Schema Validation

Every integrated workflow validates schema alignment:

```
✓ TypeScript Interface (types/)
  - All fields defined with correct types
  - Optional fields marked with ?
  - Image fields typed as string | null | undefined
  - Arrays use inline object types or proper interfaces

✓ Service Function (lib/services/)
  - Type import present from '@/types/...'
  - Collection name matches TypeScript
  - Image relations expanded with 'image.*' in fields
  - Error handling with try-catch
  - Returns null on error, not throws (unless critical)
  - Logs errors with console.error

✓ Directus Collection
  - Field names match TypeScript exactly
  - Types align (Input→string, JSON→array, etc.)
  - Permissions set correctly (public read for content)
  - M2A junction (page_blocks) configured for block relationships
```

---

## Validation Commands

All workflows use these validation steps:

```bash
# Lint check
npm run lint

# Type check
npx tsc --noEmit

# Build check
npm run build

# Combined validation (used by workflows)
npm run lint && npx tsc --noEmit && npm run build
```

**Always run validation** after:
- Adding new services, blocks, or pages
- Modifying TypeScript interfaces
- Creating new data fetching functions
- Before committing changes

---

## RPI Framework: Research-Plan-Implement

This workflow system implements the **RPI Framework** for high-leverage AI coding:

### Core Principles

1. **Research Phase**: Compress truth about the system
   - Generate "on-demand compressed context"
   - Document actual code behavior, not assumptions
   - Create reusable knowledge artifacts

2. **Plan Phase**: Compress intent with code snippets
   - Include BEFORE/AFTER code examples
   - Specify exact file paths and line numbers
   - Create "dumb-proof" plans

3. **Implement Phase**: Low-context execution
   - Use detailed plans to minimize context window
   - Stay in "smart zone" (<40% context usage)
   - Validate after each step

### Complexity-Based Routing

**Simple Tasks** (skip research):
- Button color changes
- Text updates
- Single-file modifications
- Workflow: `/prime` → `/planning` → `/execute` → `/commit`

**Medium Tasks** (use research):
- New services, blocks, or pages
- Multi-file features
- Features requiring pattern understanding
- Workflow: `/prime` → `/research` → `/planning` → `/review plan` → `/execute` → `/commit`

**Complex Tasks** (deep research):
- Major refactors
- Multi-repo changes
- System-wide modifications
- Workflow: Full RPI with all review gates

### Context Window Management

- **Research documents** compress knowledge (reusable)
- **Plans with code snippets** are self-contained
- **Implementation** uses minimal context
- **Review gates** prevent trajectory contamination

### Human Review Strategy

Review at high-leverage points:
1. **Research review** (highest leverage) - Catch wrong direction early
2. **Plan review** (high leverage) - Prevent wasted implementation
3. **Code review** (lower leverage) - Quality assurance

Shift focus "up the pipeline" from code review toward research/plan review.

---

## Framework-Specific Tips

1. **Always start with /prime** for new sessions
2. **Use /research for complex features** - prevents "making stuff up"
3. **Review plans before executing** - catch issues early (high leverage)
4. **Include code snippets in plans** - makes plans 10x more effective
5. **Use /add-service for Directus queries** - ensures full chain integration
6. **Use /add-block for CMS content** - ensures full chain integration
7. **Use /add-prompt-feature for catalog features** - follows prompt patterns
8. **Check schema tables** - the output shows TypeScript ↔ Directus mapping
9. **Complete Directus checklist** - it's aligned to exactly what TypeScript expects
10. **Chain commands** - they're designed to work together
11. **Review research for complex tasks** - highest leverage intervention point
12. **Follow reference guides** - Load from `docs/reference/` folder for specific patterns
13. **Server Components first** - Default to RSC, only use `"use client"` for interactivity
14. **ISR revalidation** - Always include `export const revalidate = 60` in data-fetching pages
15. **Graceful fallbacks** - Handle null/empty CMS responses with sensible defaults
16. **Error handling pattern** - Services return null on error, log with console.error
17. **Service function pattern** - Follow existing patterns in `lib/services/prompts.ts`

---

## Quick Start Checklist

**New Session:**
1. `/prime` - Load project context
2. Review current tasks or start new feature
3. Choose workflow based on complexity (Simple/Medium/Complex)

**Adding New Service:**
1. `/prime` → `/add-service {name}` → `/commit`
2. Complete Directus collection setup from checklist
3. Test with sample data

**Adding New Block:**
1. `/prime` → `/add-block {name}` → `/commit`
2. Complete Directus collection setup from checklist
3. Test with sample data in page builder

**Adding New Page:**
1. `/prime` → `/add-page {type} {route}` → `/commit`
2. Complete Directus collection setup from checklist
3. Test page rendering and data flow

**Adding Prompt Feature:**
1. `/prime` → `/add-prompt-feature {name}` → `/commit`
2. Complete Directus checklist if schema changes
3. Test feature in prompt catalog

**Complex Feature:**
1. `/prime` → `/research {feature}` → `/review research {feature}`
2. `/planning {feature}` → `/review plan {feature}`
3. `/execute {feature}` → `/commit`

---

## Framework Architecture Summary

**Data Flow:**

```
Directus CMS → lib/directus.ts (client) → lib/services/ (fetch) → types/ (types) → Components/Pages
```

**Block System:**
- Pages use M2A (Many-to-Any) via `page_blocks` junction
- Blocks fetched via `getPageBlocks()` and `getBlockData()`
- Blocks rendered via `BlockRenderer` component

**Prompt Catalog System:**
- Prompts stored in `prompts` collection
- Related via `prompt_categories` and `prompt_job_roles` junctions
- Services in `lib/services/prompts.ts`
- Components in `components/prompts/`
- Pages in `app/prompts/`

**Key Files:**
- `types/` - All TypeScript interfaces
- `lib/services/` - All data fetching functions
- `lib/directus.ts` - Directus client and helpers
- `lib/directus-pages.ts` - Page builder service functions
- `app/` - Next.js App Router pages
- `components/` - React components
- `docs/reference/` - Task-specific development guides

**Patterns:**
- Server Components by default (`export default async function`)
- ISR with `export const revalidate = 60`
- Graceful fallbacks for missing CMS data
- Type-safe Directus queries
- Error handling: try-catch, return null, log errors
- Service functions follow `lib/services/prompts.ts` pattern

