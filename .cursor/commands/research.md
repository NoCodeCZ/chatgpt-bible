# /research [feature-name] [scope]

## Purpose

Generate compressed research document following the RPI Framework. Creates vertical slices through the codebase to document actual system behavior, preventing AI from "making stuff up."

## When to Use

- **Medium to complex features** - Features requiring pattern understanding
- **Multi-file changes** - Features spanning multiple components/services
- **New integrations** - Features requiring understanding of existing systems

## When to Skip

- Simple UI changes (button colors, text updates)
- Single-file modifications
- Trivial fixes

## Process

1. **Feature Analysis**
   - Understand the feature requirement
   - Identify scope (default: medium, optional: `deep-scope` for complex)

2. **Vertical Slices**
   - Create slices through codebase touching the feature
   - Document actual code behavior, not assumptions
   - Include: types, services, components, pages, Directus collections

3. **Pattern Identification**
   - Find similar implementations
   - Document key patterns and constraints
   - Note architectural decisions

4. **System Behavior Documentation**
   - Document how current system handles similar features
   - Note edge cases and error handling
   - Identify dependencies

5. **Generate Research Document**
   - Create `docs/research/[feature-name].md`
   - Include code references with line numbers
   - Compress "truth" based on actual code

## Output Format

Research document structure:

```markdown
# Research: [feature-name]

## Overview
[Feature description and scope]

## Current System Behavior
[How similar features work in the codebase]

## Key Patterns
[Relevant patterns from codebase]

## Similar Implementations
[Examples of similar features]

## Constraints & Considerations
[Limitations, dependencies, edge cases]

## Code References
[Specific code locations with line numbers]

## Recommendations
[Suggested approach based on research]
```

## Next Steps

- Review research: `/review research [feature-name]`
- Create plan: `/planning [feature-name]`

## Reference

- RPI Framework: `.claude/rules/sections/12_slash_commands.md#rpi-framework`
- Research examples: `docs/research/`

