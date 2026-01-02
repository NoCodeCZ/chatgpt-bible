# /planning [feature-name] [research-doc]

## Purpose

Create detailed, executable implementation plan with code snippets showing BEFORE/AFTER examples. Plans are "dumb-proof" with actual code examples and exact line numbers.

## When to Use

- **After /prime** - For simple features
- **After /research** - For medium/complex features (uses research document)
- **Before /execute** - Always plan before implementing

## Process

1. **Load Context**
   - Check for research document: `docs/research/[feature-name].md`
   - If exists, use it as foundation
   - Load relevant reference guides from `chatgpt-bible-frontend/docs/reference/`

2. **Study Existing Patterns**
   - Review similar implementations in codebase
   - Understand service function patterns
   - Note component patterns (Server vs Client)

3. **Create Detailed Plan**
   - Break down into specific, actionable tasks
   - Include code snippets showing BEFORE/AFTER
   - Specify exact file paths and line numbers
   - Document current system behavior

4. **Complete Chain Planning**
   - Plan TypeScript interface changes
   - Plan service function creation/updates
   - Plan component/page creation/updates
   - Plan Directus collection requirements
   - Plan validation steps

5. **Generate Plan Document**
   - Create `plans/[feature-name].md`
   - Include all code snippets
   - Make plan executable with minimal context

## Output Format

Plan document structure:

```markdown
# Implementation Plan: [feature-name]

## Overview
[Feature description and goals]

## Research Summary
[If research doc exists, summarize key findings]

## Tasks

### Task 1: [Description]
**File**: `path/to/file.ts`
**Lines**: X-Y
**BEFORE**:
```typescript
// existing code
```

**AFTER**:
```typescript
// new code
```

**Notes**: [Any important considerations]

### Task 2: [Description]
[...]

## Complete Chain Checklist
- [ ] TypeScript Interface (types/)
- [ ] Service Function (lib/services/)
- [ ] Component/Page (app/ or components/)
- [ ] Directus Collection (checklist provided)
- [ ] Validation (npm run build)

## Directus Setup Checklist
[If applicable, detailed checklist matching TypeScript interface]

## Validation Steps
1. npm run lint
2. npx tsc --noEmit
3. npm run build
```

## Quality Standards

- **Code snippets required** - Show actual BEFORE/AFTER code
- **Line numbers specified** - Exact locations for modifications
- **Complete chain covered** - All layers of stack included
- **Executable** - Plan can be followed with minimal context

## Next Steps

- Review plan: `/review plan [feature-name]`
- Execute: `/execute [feature-name]`

## Reference

- Planning examples: `plans/`
- Reference guides: `chatgpt-bible-frontend/docs/reference/`
- Complete chain philosophy: `.claude/rules/sections/12_slash_commands.md#the-complete-chain-philosophy`

