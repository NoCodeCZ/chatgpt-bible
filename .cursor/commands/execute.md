# /execute [feature-name]

## Purpose

Implement features from detailed plans with minimal context. Uses the plan document to execute tasks in order, validating after each step.

## When to Use

- **After /planning** - Always execute from a plan
- **After /review plan** - After plan is reviewed and approved

## Prerequisites

- Plan document exists: `plans/[feature-name].md`
- Plan has been reviewed (recommended)
- Research document exists (for complex features)

## Process

1. **Load Plan**
   - Read `plans/[feature-name].md`
   - Understand task sequence
   - Note code snippets and line numbers

2. **Execute Tasks in Order**
   - Follow plan tasks sequentially
   - Use code snippets as guides
   - Make modifications at specified locations

3. **Complete Chain Implementation**
   - TypeScript interfaces first
   - Service functions second
   - Components/pages third
   - Directus checklist provided (manual setup)

4. **Validate After Each Major Step**
   - Run linting: `npm run lint`
   - Type check: `npx tsc --noEmit`
   - Fix any errors before proceeding

5. **Final Validation**
   - Run full build: `npm run build`
   - Verify all tests pass
   - Check for runtime errors

6. **Report Completion**
   - Summarize what was implemented
   - Note any deviations from plan
   - List Directus setup items (if applicable)

## Implementation Guidelines

- **Follow plan exactly** - Use code snippets as provided
- **Maintain patterns** - Follow existing codebase patterns
- **Error handling** - Services return `null` on error, log with `console.error`
- **Server Components** - Default to Server Components, only use `"use client"` for interactivity
- **ISR** - Include `export const revalidate = 60` for data-fetching pages
- **Type safety** - Ensure all types are properly defined

## Output Format

Implementation summary:

- **Tasks Completed**: List of completed tasks
- **Files Created/Modified**: List of changed files
- **Directus Checklist**: Items requiring manual setup
- **Validation Status**: Lint, type check, build results
- **Ready for**: Next step (usually `/commit` or `/review code`)

## Next Steps

- Review code: `/review code [feature-name]` (optional)
- Commit changes: `/commit`

## Reference

- Execution patterns: `.claude/rules/sections/12_slash_commands.md#execute`
- Complete chain: `.claude/rules/sections/12_slash_commands.md#the-complete-chain-philosophy`

