# /rca [issue-id]

## Purpose

Document root cause analysis for bugs. Investigates the issue, documents the root cause, and proposes a fix approach.

## When to Use

- **When investigating bugs** - Before fixing
- **For reported issues** - GitHub issues, user reports, etc.
- **For production issues** - Critical bugs requiring investigation

## Process

1. **Fetch Issue Context**
   - Get issue details from GitHub (if available)
   - Understand reported symptoms
   - Note reproduction steps

2. **Investigate Code**
   - Trace through relevant code paths
   - Identify where the bug occurs
   - Find root cause (not just symptoms)

3. **Document Root Cause**
   - Explain what's wrong and why
   - Include code references
   - Note related issues or dependencies

4. **Propose Fix Approach**
   - Suggest fix strategy
   - Note potential side effects
   - Consider edge cases

5. **Generate RCA Document**
   - Create `docs/rca/issue-[issue-id].md`
   - Include all findings and recommendations

## Output Format

RCA document structure:

```markdown
# Root Cause Analysis: Issue #[issue-id]

## Issue Summary
[Brief description of the issue]

## Symptoms
[What was observed/reported]

## Reproduction Steps
[How to reproduce the issue]

## Investigation

### Code Path Analysis
[Trace through relevant code]

### Root Cause
[What's actually wrong and why]

## Code References
[Specific code locations with line numbers]

## Proposed Fix
[Suggested approach to fix]

## Potential Side Effects
[What else might be affected]

## Related Issues
[Any related issues or dependencies]
```

## Next Steps

- Implement fix: `/implement-fix [issue-id]`
- Review RCA: Human review recommended for complex issues

## Reference

- Bug fix workflow: `.claude/rules/sections/12_slash_commands.md#bug-fix-workflow`
- RCA examples: `docs/rca/`

