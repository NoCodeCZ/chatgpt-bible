# QA Gates - CharGPT Bible Project

This directory contains all quality assurance gate decisions and remediation documentation for the CharGPT Bible project.

## Directory Structure

```
app-planning/qa/
├── README.md                          # This file
├── gates/                             # QA gate decision files
│   ├── epic-1.story-1.1-initialize-nextjs.yml
│   ├── epic-1.story-1.2-setup-directus-backend.yml
│   ├── 1.3-connect-nextjs-to-directus.yml
│   ├── 1.4-create-public-landing-page.yml
│   └── epic-1.story-1.5-build-prompt-list-page.yml
└── remediation/                       # Fix documentation
    └── epic-1.story-1.5-qa-fixes-applied.md
```

## What is a QA Gate?

A QA gate is a formal quality checkpoint that occurs after implementing a user story. The QA gate reviewer (Quinn - Test Architect) evaluates:

- ✅ **Acceptance Criteria**: Are all story requirements met?
- ✅ **Code Quality**: Does code follow TypeScript strict mode and project standards?
- ✅ **Security**: Are there any vulnerabilities or hardcoded secrets?
- ✅ **Performance**: Does the implementation meet performance targets?
- ✅ **Accessibility**: Is the UI accessible per WCAG 2.1 AA standards?

## QA Gate Decisions

### PASS ✅
- **Criteria**: >= 95% of acceptance criteria met
- **Action**: Story is production-ready, can proceed to next story
- **No blockers**: Zero CRITICAL or HIGH severity issues

### PASS WITH MINOR CONCERNS ⚠️
- **Criteria**: 85-94% of acceptance criteria met
- **Action**: Can proceed, but must address concerns in future iteration
- **Conditions**: Max 2 HIGH-risk issues, no CRITICAL blockers

### FAIL ❌
- **Criteria**: < 85% of acceptance criteria met OR any CRITICAL blocker
- **Action**: Must remediate issues and request re-review
- **Cannot proceed**: Story not production-ready

## Naming Conventions

### QA Gate Files
- **Primary Format**: `epic-{epic}.story-{story}-{story-slug}.yml`
  - Example: `epic-1.story-1.5-build-prompt-list-page.yml`
- **Alternative Format**: `{story}-{story-slug}.yml`
  - Example: `1.3-connect-nextjs-to-directus.yml`

### Remediation Files
- **Format**: `epic-{epic}.story-{story}-qa-fixes-applied.md`
  - Example: `epic-1.story-1.5-qa-fixes-applied.md`

## Remediation Process

When a QA gate returns a **FAIL** decision:

1. **Review Findings**: Read the QA gate YAML file in `gates/` directory
2. **Create Remediation Doc**: Create a markdown file in `remediation/` directory
3. **Fix Issues**: Address all CRITICAL and HIGH severity issues
4. **Document Fixes**: Update remediation doc with:
   - What was fixed
   - File paths and code changes
   - Test results confirming fixes
5. **Request Re-review**: Notify reviewer that fixes are ready
6. **Re-review**: Reviewer updates QA gate file with re-review results

## Current QA Gate Status

### Epic 1: Foundation & Prompt Display

| Story | QA Gate File | Status | Date | Confidence |
|-------|--------------|--------|------|------------|
| 1.1 | `epic-1.story-1.1-initialize-nextjs.yml` | ✅ PASS | 2025-11-09 | HIGH |
| 1.2 | `epic-1.story-1.2-setup-directus-backend.yml` | ✅ PASS | 2025-11-09 | HIGH |
| 1.3 | `1.3-connect-nextjs-to-directus.yml` | ⚠️ PASS WITH CONCERNS | 2025-11-09 | HIGH (88%) |
| 1.4 | `1.4-create-public-landing-page.yml` | ✅ PASS | 2025-11-09 | HIGH |
| 1.5 | `epic-1.story-1.5-build-prompt-list-page.yml` | ❌ FAIL → 🔄 REMEDIATED | 2025-11-10 | MEDIUM (70%) |

**Note**: Story 1.5 has been remediated (see `remediation/epic-1.story-1.5-qa-fixes-applied.md`) and is ready for re-review.

## Severity Levels

### CRITICAL 🔴
- **Definition**: Functional gaps, security vulnerabilities, data loss risks
- **Examples**: Missing authentication, SQL injection, broken core user flow
- **Action**: MUST fix before production

### HIGH 🟠
- **Definition**: Significant deviations from requirements, poor UX, performance issues
- **Examples**: Missing filtering, incorrect sort order, slow page load
- **Action**: SHOULD fix before production

### MEDIUM 🟡
- **Definition**: Minor functional gaps, accessibility issues, missing error states
- **Examples**: Missing loading states, keyboard navigation gaps
- **Action**: Fix in next iteration

### LOW 🟢
- **Definition**: Code quality improvements, optimization opportunities
- **Examples**: Code duplication, missing comments, minor refactoring
- **Action**: Optional, can defer

## Global QA Gate Rules

All QA gates must follow the standards defined in:
- **`.bmad-core/qa-gate-rules.yml`** - Comprehensive QA gate rules and processes

Key rules include:
- Pass threshold: 95% of acceptance criteria
- Fail threshold: < 85% or any CRITICAL blocker
- Max review iterations: 2 (escalate if 3+)
- Remediation time target: <= 6 hours

## File Format

QA gate files use YAML format with the following structure:

```yaml
metadata:
  gate_id: "unique-gate-identifier"
  story_reference: "path/to/story.md"
  reviewer: "Quinn (Test Architect)"
  review_date: "2025-11-10"
  review_iteration: 1
  confidence_level: "HIGH"

decision:
  status: "PASS | PASS WITH MINOR CONCERNS | FAIL"
  production_ready: "YES | NO | CONDITIONAL"
  go_live_approval: "APPROVED | CONDITIONAL | BLOCKED"

findings:
  critical_blockers: []
  high_risk_items: []
  medium_risk_items: []
  low_risk_items: []

acceptance_criteria:
  - criteria_id: "AC1"
    status: "MET | PARTIAL | NOT_MET"
    evidence: "Description of implementation"
    risk_level: "CRITICAL | HIGH | MEDIUM | LOW | NONE"

recommendations:
  immediate_actions: []
  follow_up_actions: []
```

## Automated Checks

Before submitting for QA gate review, ensure:

```bash
# TypeScript compilation
npm run build              # Must pass without errors

# Type checking
npm run type-check         # Must pass with strict mode

# Linting
npm run lint               # No errors (warnings OK)
```

## Production Readiness Checklist

All of the following must be true for **PASS** or **PASS WITH MINOR CONCERNS**:

- [ ] TypeScript build passes with strict mode
- [ ] No console errors in production build
- [ ] Core user flows work end-to-end
- [ ] No hardcoded secrets or API keys
- [ ] Authentication/authorization working (if applicable)
- [ ] Page load < 3 seconds (4G connection)
- [ ] Keyboard navigation functional
- [ ] Color contrast meets WCAG 2.1 AA
- [ ] Environment variables documented
- [ ] README updated with any new setup steps

## Contact

- **QA Gate Reviewer**: Quinn (Test Architect)
- **Project Lead**: Technical lead for escalations
- **Documentation**: See `CLAUDE.md` for project context

## References

- **Project Instructions**: `/CLAUDE.md`
- **Story Definitions**: `/app-planning/stories/*.md`
- **Architecture**: `/docs/architecture.md`
- **PRD**: `/docs/prd.md`
- **QA Gate Rules**: `/.bmad-core/qa-gate-rules.yml`
