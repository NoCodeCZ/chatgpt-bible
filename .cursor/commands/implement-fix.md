# /implement-fix [issue-id]

## Purpose

Fix bugs from root cause analysis documents. Reads the RCA document and implements the fix steps with validation.

## When to Use

- **After /rca** - After root cause analysis is complete
- **After RCA review** - After RCA has been reviewed (recommended)

## Prerequisites

- RCA document exists: `docs/rca/issue-[issue-id].md`
- Root cause is identified
- Fix approach is proposed

## Process

1. **Load RCA Document**
   - Read `docs/rca/issue-[issue-id].md`
   - Understand root cause
   - Review proposed fix approach

2. **Implement Fix**
   - Follow fix steps from RCA
   - Make code changes at identified locations
   - Address root cause, not just symptoms

3. **Handle Side Effects**
   - Check for potential side effects noted in RCA
   - Update related code if needed
   - Ensure no regressions

4. **Validate Changes**
   - Run linting: `npm run lint`
   - Type check: `npx tsc --noEmit`
   - Build check: `npm run build`
   - Test fix (if applicable)

5. **Verify Fix**
   - Confirm root cause is addressed
   - Verify symptoms are resolved
   - Check for regressions

## Implementation Guidelines

- **Fix root cause** - Not just symptoms
- **Follow patterns** - Maintain codebase consistency
- **Error handling** - Ensure proper error handling
- **Type safety** - Maintain type safety
- **Documentation** - Update comments if needed

## Output Format

Fix summary:

- **Issue**: Issue ID and description
- **Root Cause**: What was wrong
- **Fix Applied**: What was changed
- **Files Modified**: List of changed files
- **Validation Status**: Lint, type check, build results
- **Ready for**: Next step (usually `/commit`)

## Commit Message

When committing, use format:
```
fix: [description] (Fixes #[issue-id])
```

## Next Steps

- Commit changes: `/commit`
- Verify fix: Test the fix manually if needed

## Reference

- Bug fix workflow: `.claude/rules/sections/12_slash_commands.md#bug-fix-workflow`
- RCA process: `/rca [issue-id]`

