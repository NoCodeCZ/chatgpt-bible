This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Directus Integration & Maintenance

### Type Synchronization Process

This project uses **manual TypeScript type definitions** that mirror the Directus schema. When the Directus schema changes, types must be updated manually to prevent runtime errors.

#### When to Update Types

Update TypeScript types whenever:
- ✅ Adding/removing fields in Directus collections
- ✅ Changing field types (string → number, etc.)
- ✅ Modifying relationships between collections
- ✅ Updating Directus SDK version

#### Step-by-Step Type Sync Process

**1. Inspect Directus Schema via MCP**
```bash
# Use MCP Directus integration to inspect collection schema
# MCP command: inspect collection "prompts"
# MCP command: inspect collection "categories"
# MCP command: inspect collection "job_roles"
```

**2. Compare Schema with TypeScript Types**
- Open `types/Prompt.ts`, `types/Category.ts`, `types/JobRole.ts`
- Compare field names and types against MCP output
- Check for:
  - Missing fields in TypeScript
  - Type mismatches (string vs number, nullable vs required)
  - Relationship structure changes

**3. Update Type Definitions**
```typescript
// Example: Adding a new field to Prompt
export interface Prompt {
  id: number;
  title_th: string;
  title_en: string;
  new_field: string; // ← Add new field here
  // ... rest of fields
}
```

**4. Update Version Tracking**
```typescript
/**
 * DIRECTUS SCHEMA VERSION: 1.1 (Updated in Story X.X)
 * LAST VALIDATED: 2025-11-10  // ← Update date
 * VALIDATION METHOD: MCP schema inspection
 */
```

**5. Test with Integration Test Page**
```bash
npm run dev
# Navigate to: http://localhost:3000/test-directus
# Verify no TypeScript errors
# Confirm data displays correctly
```

**6. Run Type Check**
```bash
npx tsc --noEmit
# Expected: No type errors
```

#### Integration Test Page

The `/test-directus` route serves as a **permanent integration test** for Directus connectivity:
- **Location:** `app/test-directus/page.tsx`
- **Purpose:** Validates SDK configuration, environment variables, and type accuracy
- **Access:** http://localhost:3000/test-directus
- **⚠️ DO NOT DELETE** - Required for regression testing

#### Troubleshooting Type Errors

**Error: "Property 'xyz' does not exist on type 'Prompt'"**
- Schema changed in Directus but TypeScript not updated
- Solution: Follow type sync process above

**Error: "Type 'string' is not assignable to type 'number'"**
- Field type mismatch between Directus and TypeScript
- Solution: Inspect Directus schema, update type definition

**Runtime Error: "Cannot read property 'xyz' of undefined"**
- Missing field in API response (not in query `fields` parameter)
- Solution: Add field to `readItems()` fields array

### Environment Variables

```bash
# .env.local (required for local development)
NEXT_PUBLIC_DIRECTUS_URL=https://your-instance.directus.app
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

See `.env.local.example` for template.

### Directus Collections

- **prompts**: Main content (title, description, prompt_text, difficulty)
- **categories**: Taxonomy for organizing prompts
- **job_roles**: User roles/professions
- **prompt_categories**: Many-to-Many junction table
- **prompt_job_roles**: Many-to-Many junction table

For detailed schema, see Story 1.2 documentation.
