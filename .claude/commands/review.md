# /review [type] [artifact-name]

## Purpose

Human review checkpoints at high-leverage points to prevent catastrophic errors before implementation. Reviewing research/plans prevents wasted effort and catches wrong directions early.

## When to Use

- **After /research** - Review research document (highest leverage)
- **After /planning** - Review implementation plan (high leverage)
- **After /execute** - Review code changes (lower leverage, still important)

## Review Types

### research [artifact-name]

Review research document for accuracy and completeness.

**Checkpoints:**
- Is the research based on actual code, not assumptions?
- Are all relevant patterns identified?
- Are similar implementations correctly documented?
- Are constraints and dependencies noted?

**File**: `docs/research/[artifact-name].md`

### plan [artifact-name]

Review implementation plan for correctness and completeness.

**Checkpoints:**
- Are code snippets accurate?
- Is the complete chain covered?
- Are Directus requirements clear?
- Is the plan executable?

**File**: `plans/[artifact-name].md`

### code [artifact-name]

Review code changes for quality and correctness.

**Checkpoints:**
- Does code follow project patterns?
- Is error handling correct?
- Are types properly defined?
- Does it pass validation?

## Process

1. **Load Artifact**
   - Read the artifact file (research, plan, or code)
   - Understand the context and goals

2. **Review Against Standards**
   - Check against project patterns
   - Verify complete chain coverage
   - Validate technical approach

3. **Provide Feedback**
   - Note any issues or concerns
   - Suggest improvements if needed
   - Approve if ready

4. **Next Steps**
   - If approved: Proceed to next step
   - If issues: Address feedback and re-review

## Impact

- **Research review** (highest leverage) - Catch wrong direction early
- **Plan review** (high leverage) - Prevent wasted implementation
- **Code review** (lower leverage) - Quality assurance

## Reference

- Review strategy: `.claude/rules/sections/12_slash_commands.md#human-review-strategy`
- RPI Framework: `.claude/rules/sections/12_slash_commands.md#rpi-framework`

