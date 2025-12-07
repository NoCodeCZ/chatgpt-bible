This project uses a **two-layer context loading strategy** to optimize AI assistant performance:

- **Layer 1 (Always Loaded):** Core principles, architecture, and tech stack (this document)
- **Layer 2 (Load on Demand):** Task-specific reference guides in `docs/reference/`

### Always-Loaded Context (This Document)

The following sections are **always loaded** and apply to all development tasks:

- **Core Principles** (Section 1) - Type safety, separation of concerns, error handling
- **Tech Stack** (Section 2) - Framework versions, dependencies, tooling
- **Architecture** (Section 3) - Project structure, patterns, data flow
- **Code Style** (Section 4) - Naming conventions, formatting, component patterns
- **Logging** (Section 5) - Logging patterns and error handling
- **Testing** (Section 6) - Testing frameworks and conventions
- **API Contracts** (Section 7) - Next.js ↔ Directus integration patterns
- **Common Patterns** (Section 8) - Reusable code patterns
- **Development Commands** (Section 9) - npm scripts and workflows

### Load-on-Demand Context (Reference Guides)

**When to use:** Only when working on a specific task type. Read the relevant guide before starting.

See the Reference Guides table below for available guides.

### Loading Strategy Workflow

1. **Identify task type** - What are you building? (component, service function, page, etc.)
2. **Check this document** - Review relevant always-loaded sections (principles, patterns)
3. **Load reference guide** - Read the specific guide for your task type
4. **Follow checklist** - Use the guide's checklist to ensure nothing is missed
5. **Implement** - Write code following patterns from both this document and the guide

