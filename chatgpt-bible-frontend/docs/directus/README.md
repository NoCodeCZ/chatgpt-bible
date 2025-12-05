# Directus Integration Documentation

Documentation for Directus CMS setup, schema design, and Next.js integration.

## Contents

| File | Description |
|------|-------------|
| [DIRECTUS_ADMIN_GUIDE.md](DIRECTUS_ADMIN_GUIDE.md) | Admin panel usage and configuration |
| [DATABASE-SCHEMA-DIAGRAM.md](DATABASE-SCHEMA-DIAGRAM.md) | Complete database schema documentation |
| [PAGE-BUILDER-USAGE.md](PAGE-BUILDER-USAGE.md) | How to use the page builder system |
| [directus-page-management-schema.md](directus-page-management-schema.md) | Page collection schema details |
| [directus-page-schema.yaml](directus-page-schema.yaml) | YAML schema definition |
| [nextjs-page-builder-integration.md](nextjs-page-builder-integration.md) | Frontend integration guide |
| [directus-api-testing.md](directus-api-testing.md) | API testing documentation |

## Architecture Overview

```
Directus CMS                    Next.js Frontend
┌──────────────┐               ┌──────────────────┐
│   Pages      │◄──────────────│ lib/directus.ts  │
│   Prompts    │   REST API    │ lib/services/    │
│   Categories │               │ components/      │
│   Blocks     │               └──────────────────┘
└──────────────┘
```

## Key Collections

- **pages** - Dynamic pages with SEO fields
- **page_blocks** - Page builder blocks (Hero, CTA, etc.)
- **prompts** - AI prompt catalog
- **categories** - Prompt categorization
- **subcategories** - Sub-categorization

## Related Reference Guides

- [Service Functions Guide](../reference/service-functions-guide.md) - Creating data fetching functions
- [Directus + Next.js Workflow](../reference/directus-nextjs-workflow.md) - End-to-end workflow
