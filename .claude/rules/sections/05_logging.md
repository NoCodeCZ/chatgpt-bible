- **Frontend logging**
  - Use `console.error`/`console.warn` in server utilities (`lib/`) when external services (Directus) fail.
  - Do **not** spam logs from react components; handle errors via fallbacks (e.g. conditional rendering, `notFound()`).

- **Service logging pattern** (from `lib/directus-pages.ts`):

```ts
try {
  const blocks = await directus.request(/* ... */);
  return (blocks || []) as unknown as PageBlock[];
} catch (error) {
  console.error('Error fetching page blocks:', error);
  return [];
}
```

- **Script logging** (from `scripts/migrate-prompts.js`):
  - Use a centralized logger with timestamps and types:

```js
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = { info: '📝', success: '✅', error: '❌', warning: '⚠️', progress: '📊', dryrun: '🔍' }[type] || '📝';
  console.log(`${prefix} [${timestamp}] ${message}`);
}
```

  - Always include contextual fields in messages (prompt title, collection name, file name, IDs).

- **Sensitive data**
  - Never log secrets, access tokens, or raw environment variables. You may log that a required variable is missing by name, but not its value.

