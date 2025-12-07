### Context Loading Protocol

1. **Always start with this document** - Core principles, architecture, and patterns (Sections 1-9) are always loaded
2. **Identify task type** - Determine what you're building (component, service function, page, block, etc.)
3. **Load relevant reference guide** - Read the specific guide from Section 10 before writing code
4. **Follow both layers** - Apply always-loaded principles (this doc) + task-specific steps (reference guide)

### Mandatory Workflow

- **Before coding:** Read this `CLAUDE.md` + relevant reference guide + existing code in target directory
- **During coding:** Match existing patterns, follow checklists from reference guides
- **After coding:** Run `npm run lint`, verify against checklists, ensure type safety

### Critical Rules (Always Apply)

- **Type safety is non-negotiable** - All code must be TypeScript with explicit types
- **Separation of concerns** - Directus access in `lib/`, components receive props only
- **No silent failures** - Service functions must log errors or throw explicitly
- **Server Components by default** - Only use `"use client"` when hooks/browser APIs required
- **Error handling** - Catch at service boundaries, surface friendly fallbacks in UI

### Task-Specific Guidance

- **Creating components** → Read `react-components-guide.md` + Section 4 (Code Style)
- **Creating service functions** → Read `service-functions-guide.md` + Section 7 (API Contracts)
- **Creating pages** → Read `app-router-pages-guide.md` + Section 3 (Architecture)
- **Creating blocks** → Read `page-builder-blocks-guide.md` + Section 3 (Architecture)
- **Adding types** → Read `typescript-types-guide.md` + Section 7 (API Contracts)
- **Creating API routes** → Read `api-routes-guide.md` + Section 5 (Logging)
- **Migration scripts** → Read `migration-scripts-guide.md` + Section 5 (Logging)

### Quality Checks

- [ ] Read relevant reference guide before starting
- [ ] Followed checklist from reference guide
- [ ] Matched existing code patterns in directory
- [ ] TypeScript types defined/updated in `types/`
- [ ] Error handling implemented (no silent failures)
- [ ] Logging added where appropriate (Section 5)
- [ ] `npm run lint` passes
- [ ] Code follows naming conventions (Section 4)

