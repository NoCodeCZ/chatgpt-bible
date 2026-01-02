# /prime - Load Project Context

## Purpose

Load comprehensive project context at the start of every session to establish full understanding of the codebase, patterns, and current state.

## When to Use

- **Start of every session** - First command to run
- **After long breaks** - Re-establish context
- **Before complex tasks** - Ensure full understanding

## Process

1. **Read Core Documentation**
   - Load `CLAUDE.md` and all rule sections from `.claude/rules/sections/`
   - Understand project structure and principles

2. **Understand Type System**
   - Review `types/` directory patterns and interfaces
   - Identify existing type definitions
   - Note type relationships and patterns

3. **Review Data Layer**
   - Check `lib/directus.ts` client setup
   - Review `lib/services/` data fetching patterns
   - Understand service function patterns (error handling, null returns)

4. **Inventory Components & Pages**
   - List available components in `components/`
   - List pages in `app/`
   - Note component patterns (Server vs Client Components)

5. **Summarize Block System**
   - Review `types/blocks.ts` for block types
   - Check `components/blocks/BlockRenderer.tsx` for registered blocks
   - Understand M2A (Many-to-Any) relationship patterns

6. **Check Directus Collections**
   - Review existing collection patterns
   - Note schema alignment patterns (TypeScript ↔ Directus)

7. **Git State Check**
   - Check current branch
   - Review uncommitted changes
   - Note recent commits

## Output Format

Provide a comprehensive summary:

- **Project Overview**: Tech stack, architecture, patterns
- **Type System**: Key interfaces and patterns
- **Data Layer**: Service functions and Directus client setup
- **Component Inventory**: Available components and pages
- **Block System**: Registered blocks and patterns
- **Current State**: Git status, recent changes
- **Ready for**: Next command in workflow

## Key Patterns to Note

- **Server Components by default** - Only use `"use client"` for interactivity
- **ISR with revalidate** - `export const revalidate = 60` for data-fetching pages
- **Error handling** - Services return `null` on error, log with `console.error`
- **Complete chain** - TypeScript → Service → Component → Directus
- **Schema alignment** - TypeScript interfaces must match Directus collections exactly

## Reference

- Full documentation: `.claude/rules/sections/12_slash_commands.md`
- Project rules: `CLAUDE.md`
- Reference guides: `chatgpt-bible-frontend/docs/reference/`

