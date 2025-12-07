# Slash Commands Quick Start

Quick reference for using slash commands in the ChatGPT Bible project.

## 🚀 Getting Started

### First Time Setup

1. **Start a new session:**
   ```
   /prime
   ```
   This loads all project context, patterns, and current state.

2. **Choose your workflow:**
   - Simple task? → `/planning` → `/execute` → `/commit`
   - Medium task? → `/research` → `/planning` → `/review plan` → `/execute` → `/commit`
   - Complex task? → Full RPI with all review gates

## 📋 Common Workflows

### Adding a New Service Function

```bash
/prime
/add-service categories
/commit
```

**What it does:**
- Creates TypeScript interface in `types/`
- Creates service function in `lib/services/categories.ts`
- Provides Directus collection checklist
- Validates build

### Adding a New Page Builder Block

```bash
/prime
/add-block testimonial
/commit
```

**What it does:**
- Creates TypeScript interface in `types/blocks.ts`
- Creates service function (or extends existing)
- Creates React component in `components/blocks/Testimonial.tsx`
- Wires to BlockRenderer
- Provides Directus collection checklist
- Validates build

### Adding a New Prompt Catalog Feature

```bash
/prime
/add-prompt-feature favorites
/commit
```

**What it does:**
- Updates/creates TypeScript interfaces
- Creates/updates service function in `lib/services/prompts.ts`
- Creates component in `components/prompts/`
- Integrates with existing prompt pages
- Validates build

### Adding a New Page

```bash
/prime
/add-page list categories
/commit
```

**Page types:**
- `list` - Collection listing (e.g., `/categories`)
- `detail` - Dynamic detail with `[slug]` (e.g., `/categories/[slug]`)
- `cms` - Block-based page builder page

### Complex Feature Development

```bash
/prime
/research user-authentication
/review research user-authentication
/planning user-authentication
/review plan user-authentication
/execute user-authentication
/commit
```

## 🔍 Research Phase

Use `/research` for medium to complex features:

```bash
/research feature-name
```

**When to use:**
- ✅ New services or blocks
- ✅ Multi-file features
- ✅ Features requiring pattern understanding
- ❌ Skip for: Button colors, text updates, single-file fixes

**Output:** `docs/research/feature-name.md`

## 📝 Planning Phase

Always create a plan before implementing:

```bash
/planning feature-name
```

**What you get:**
- Detailed step-by-step plan
- Code snippets (BEFORE/AFTER)
- Exact file paths and line numbers
- Validation steps

**Output:** `plans/feature-name.md`

## ✅ Review Checkpoints

Review at high-leverage points:

```bash
/review research feature-name    # Highest leverage
/review plan feature-name         # High leverage
/review code feature-name         # Quality check
```

**Why review early:**
- Catch wrong direction before implementation
- Prevent wasted effort
- Higher ROI than code review

## 🐛 Bug Fixes

```bash
/prime
/rca 123
/implement-fix 123
/commit
```

**What it does:**
- Investigates bug
- Documents root cause in `docs/rca/issue-123.md`
- Implements fix
- Validates changes

## 🔄 HTML to Next.js Conversion

Interactive workflow:

```bash
# 1. Upload HTML files (via chat)
# 2. Configure routes
"products.html is /products"
"product-detail.html is /products/[slug]"

# 3. Convert
"convert products.html to nextjs"

# 4. Analyze data
"what collections does this need?"

# 5. Modify schema
"add category relation and stock_count"

# 6. Create collections
"yes create it"

# 7. Connect to Directus
"update the nextjs page"
```

## 📚 Reference Guides

When working on specific tasks, reference guides are automatically loaded:

- `service-functions-guide.md` - Creating Directus services
- `react-components-guide.md` - Building components
- `page-builder-blocks-guide.md` - Creating blocks
- `app-router-pages-guide.md` - Creating pages
- `typescript-types-guide.md` - Defining types

## ✅ Validation

All workflows automatically validate:

```bash
npm run lint && npx tsc --noEmit && npm run build
```

**Always run validation:**
- After adding services, blocks, or pages
- After modifying TypeScript interfaces
- Before committing changes

## 🎯 Best Practices

1. **Always start with `/prime`** - Loads project context
2. **Use `/research` for complex features** - Prevents "making stuff up"
3. **Review plans before executing** - Catch issues early
4. **Follow the complete chain** - TypeScript → Service → Component → Directus
5. **Check schema alignment tables** - Shows TypeScript ↔ Directus mapping
6. **Complete Directus checklists** - Aligned to TypeScript expectations
7. **Server Components first** - Only use `"use client"` for interactivity
8. **Error handling pattern** - Services return null, log errors
9. **ISR revalidation** - Include `export const revalidate = 60`
10. **Graceful fallbacks** - Handle null/empty CMS responses

## 📖 Full Documentation

See `.claude/rules/sections/12_slash_commands.md` for complete documentation.

