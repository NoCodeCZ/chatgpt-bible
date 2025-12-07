> Note: There is no dedicated testing setup yet; when adding tests, follow these conventions.

- **Frameworks**
  - Use **Vitest** or **Jest** for unit tests and **Testing Library** for React component tests (prefer React Testing Library).
- **Structure & naming**
  - Place tests next to the file under test:
    - `components/prompts/PromptCard.tsx` → `components/prompts/PromptCard.test.tsx`
    - `lib/directus-pages.ts` → `lib/directus-pages.test.ts`
  - Use `.test.ts` / `.test.tsx` suffixes.
- **Patterns**
  - Test service functions with mocked Directus client.
  - Test components by rendering with meaningful props and asserting on visible text and ARIA attributes.
- **Commands**
  - When tests are added, define:
    - `npm test` → unit test runner.
    - `npm run test:watch` → watch mode.

