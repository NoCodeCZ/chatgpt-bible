# Cursor Commands - ChatGPT Bible

This directory contains Cursor command prompts for the ChatGPT Bible project. These commands implement the slash command workflows defined in `.claude/rules/sections/12_slash_commands.md`.

## Quick Reference

| Command | File | Purpose |
|---------|------|---------|
| `/prime` | `prime.md` | Load project context |
| `/research [feature]` | `research.md` | Generate compressed research |
| `/planning [feature]` | `planning.md` | Create implementation plan |
| `/review [type] [artifact]` | `review.md` | Human review checkpoint |
| `/execute [feature]` | `execute.md` | Implement from plan |
| `/commit` | `commit.md` | Git commit |
| `/rca [issue-id]` | `rca.md` | Investigate bug |
| `/implement-fix [issue-id]` | `implement-fix.md` | Fix from RCA |
| `/add-service [name]` | `add-service.md` | Create Directus service |
| `/add-block [name]` | `add-block.md` | Create CMS block |
| `/add-page [type] [route]` | `add-page.md` | Create new page |
| `/add-prompt-feature [name]` | `add-prompt-feature.md` | Add prompt catalog feature |
| `/convert-html-flow` | `convert-html-flow.md` | Interactive HTML → Next.js + Directus |

## How to Use

These commands are designed to work with Cursor's command system. When you type a command like `/prime` or `/add-service categories`, Cursor will:

1. Recognize the command pattern
2. Load the corresponding command file from this directory
3. Execute the workflow defined in the command file
4. Follow the complete chain philosophy

## Command Structure

Each command file follows best practices:

- **Clear Purpose**: What the command does and when to use it
- **Process Steps**: Detailed workflow steps
- **Output Format**: What to expect from the command
- **Reference Links**: Links to related documentation

## Complete Chain Philosophy

All framework-specific commands (`/add-service`, `/add-block`, `/add-page`, `/add-prompt-feature`) follow the complete chain:

```
TypeScript Interface → Service Function → Component/Page → Directus Collection → Validate
```

This ensures no fragmentation - every layer of the stack stays in sync.

## Workflow Examples

### Simple Task
```
/prime → /planning simple-feature → /execute simple-feature → /commit
```

### Medium Task (RPI)
```
/prime → /research feature → /review research feature → /planning feature → /review plan feature → /execute feature → /commit
```

### Adding a Service
```
/prime → /add-service categories → /commit
```

### Bug Fix
```
/prime → /rca 42 → /implement-fix 42 → /commit
```

## Documentation

- **Full Documentation**: `.claude/rules/sections/12_slash_commands.md`
- **Quick Start**: `docs/SLASH_COMMANDS_QUICK_START.md`
- **Setup Guide**: `docs/SLASH_COMMANDS_SETUP.md`

## Best Practices

1. **Always start with `/prime`** - Loads project context
2. **Use `/research` for complex features** - Prevents "making stuff up"
3. **Review plans before executing** - Catch issues early (high leverage)
4. **Follow complete chain** - Ensures all layers stay in sync
5. **Validate after changes** - Run lint, type check, and build

## Reference Guides

When working on specific tasks, reference guides are available in `chatgpt-bible-frontend/docs/reference/`:

- `service-functions-guide.md` - Creating service functions
- `react-components-guide.md` - Building components
- `page-builder-blocks-guide.md` - Creating blocks
- `app-router-pages-guide.md` - Creating pages
- `html-to-nextjs-directus-guide.md` - HTML conversion
- And more...

## Notes

- Commands are **documentation-driven** - No executable files needed
- AI interprets and executes based on documented workflows
- All commands follow project patterns and best practices
- Schema validation ensures TypeScript ↔ Directus alignment

