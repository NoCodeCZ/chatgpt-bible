# Reference Guides

On-demand reference guides for essential development tasks in this Next.js + Directus project. Each guide provides step-by-step instructions, code examples, and checklists for specific task types.

## Available Guides

### Core Development

- **[Directus + Next.js Workflow](directus-nextjs-workflow.md)** - Creating page blocks, Directus collections, and prompt components (complete workflow)
- **[Service Functions](service-functions-guide.md)** - Creating Directus service functions in `lib/services/`
- **[React Components](react-components-guide.md)** - Creating Server and Client components
- **[Custom Hooks](custom-hooks-guide.md)** - Creating SWR hooks and UI state hooks
- **[TypeScript Types](typescript-types-guide.md)** - Defining types that mirror Directus collections

### Next.js App Router

- **[App Router Pages](app-router-pages-guide.md)** - Creating pages with Server Components, metadata, static generation
- **[API Routes](api-routes-guide.md)** - Creating serverless API routes for webhooks and integrations

### Data Management

- **[Migration Scripts](migration-scripts-guide.md)** - Creating Node.js scripts for Directus data migration

### Content Conversion

- **[HTML to Next.js + Directus](html-to-nextjs-directus-guide.md)** - Converting HTML files to Next.js components and integrating with Directus

## Quick Reference by Task

**I need to...**

- **Fetch data from Directus** → [Service Functions Guide](service-functions-guide.md)
- **Create a new page** → [App Router Pages Guide](app-router-pages-guide.md)
- **Build a React component** → [React Components Guide](react-components-guide.md)
- **Add client-side data fetching** → [Custom Hooks Guide](custom-hooks-guide.md)
- **Define TypeScript types** → [TypeScript Types Guide](typescript-types-guide.md)
- **Create an API endpoint** → [API Routes Guide](api-routes-guide.md)
- **Migrate data to Directus** → [Migration Scripts Guide](migration-scripts-guide.md)
- **Create a new Directus collection** → [Directus + Next.js Workflow](directus-nextjs-workflow.md)
- **Convert HTML files to Next.js** → [HTML to Next.js + Directus Guide](html-to-nextjs-directus-guide.md)

## Guide Structure

Each guide follows this structure:

1. **Title and Purpose** - What the guide covers and when to use it
2. **Overall Pattern** - High-level workflow diagram
3. **Step-by-Step Instructions** - Detailed steps with code examples
4. **Quick Checklist** - Markdown checklist summarizing all steps

## Best Practices

- **Always read the relevant guide before starting a task**
- **Follow the checklists** to ensure nothing is missed
- **Refer to GLOBAL_RULES.md** for project-wide conventions
- **Check existing code** in the codebase for similar patterns

## Contributing

When adding new patterns or workflows:

1. Create a new guide following the existing structure
2. Keep it concise (50-200 lines)
3. Include real code examples from the codebase
4. Add a quick checklist at the end
5. Update this README with the new guide

