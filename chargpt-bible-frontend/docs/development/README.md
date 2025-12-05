# Development Documentation

Guides for development workflows, testing, and performance optimization.

## Contents

| File | Description |
|------|-------------|
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Testing strategies and test setup |
| [PERFORMANCE-REPORT.md](PERFORMANCE-REPORT.md) | Performance benchmarks and optimization |
| [MOBILE-RESPONSIVE-TEST.md](MOBILE-RESPONSIVE-TEST.md) | Mobile responsiveness checklist |
| [NAVBAR_SETUP.md](NAVBAR_SETUP.md) | Navigation component documentation |

## Development Workflow

### Getting Started
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run linting
npm run lint
```

### Testing
```bash
# Run tests (when configured)
npm test

# Run tests in watch mode
npm run test:watch
```

### Code Quality
- Follow patterns in `CLAUDE.md` at the project root
- Use TypeScript for all new code
- Run `npm run lint` before committing
