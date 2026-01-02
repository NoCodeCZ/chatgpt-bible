# /commit [files...]

## Purpose

Create conventional commits with proper formatting. Reviews changes, determines commit type, and creates formatted commit message.

## When to Use

- **After /execute** - After implementing features
- **After /implement-fix** - After fixing bugs
- **After manual changes** - After making code changes

## Process

1. **Review Changes**
   - Check git status
   - Review modified files
   - Understand scope of changes

2. **Determine Commit Type**
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting, etc.)
   - `refactor:` - Code refactoring
   - `test:` - Adding or updating tests
   - `chore:` - Maintenance tasks

3. **Create Commit Message**
   - Follow conventional commit format
   - Include issue reference if applicable (e.g., `Fixes #123`)
   - Write clear, descriptive message

4. **Commit and Confirm**
   - Stage relevant files
   - Create commit with formatted message
   - Confirm commit created

## Commit Message Format

```
<type>: <description>

[optional body]

[optional footer with issue references]
```

## Examples

- `feat: add user favorites feature`
- `fix: resolve prompt filtering bug (Fixes #42)`
- `docs: update slash commands documentation`
- `refactor: simplify service function error handling`

## Reference

- Conventional commits: https://www.conventionalcommits.org/
- Project patterns: `.claude/rules/sections/12_slash_commands.md#commit`

