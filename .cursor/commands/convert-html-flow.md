# /convert-html-flow

## Purpose

Interactive conversational workflow for converting HTML files to Next.js pages with automatic Directus collection analysis. Tracks session state across commands and handles the complete conversion process.

## When to Use

- **Converting HTML to Next.js** - Migrating static HTML to Next.js
- **HTML file uploads** - When user uploads HTML files
- **Page migration** - Moving from static to dynamic pages

## Session State Management

Tracks conversation state across commands:
- Uploaded HTML files
- Sitemap configuration (filename → route)
- Conversion status per page
- Proposed Directus collections
- Created collections

## Command Recognition Patterns

### 1. File Upload Detection
- User uploads HTML files → Initialize session state
- Store file paths and content

### 2. Sitemap Configuration
- Pattern: `{filename} is {route}` or `{filename} → {route}`
- Examples:
  - `"homepage is root"` → `/`
  - `"products is /products"` → `/products`
  - `"product-detail is /products/[slug]"` → `/products/[slug]`

### 3. Conversion Requests
- Pattern: `convert|make|turn` + `{filename}` + `nextjs|component|page`
- Examples:
  - `"convert products.html to nextjs"`
  - `"make products page into a component"`

### 4. Collection Analysis
- Pattern: `collections|data structure|database tables|schema`
- Examples:
  - `"what collections needed?"`
  - `"analyze the data structure"`

### 5. Schema Modifications
- Pattern: `add` + `{field}` + `{type|relation}`
- Examples:
  - `"add category relation and stock_count"`
  - `"add field X as type Y"`

### 6. Execution
- Pattern: `yes|create|make|proceed` + `it`
- Examples:
  - `"yes create it"`
  - `"create it"`
  - `"make it"`

### 7. Page Updates
- Pattern: `update|connect` + `nextjs|directus|page`
- Examples:
  - `"update the nextjs page"`
  - `"connect to directus"`

## Workflow Steps

1. **Initialize Session**
   - Track uploaded files
   - Store file content
   - Initialize state

2. **Parse Sitemap**
   - Map filenames to Next.js routes
   - Handle dynamic routes (`[slug]`)
   - Store route mappings

3. **Convert HTML to Next.js**
   - Generate React components from HTML
   - Convert to Server Components
   - Handle images, links, etc.
   - Create proper file structure

4. **Analyze Collections**
   - Detect repeating patterns in HTML
   - Propose Directus schema
   - Identify data structures
   - Suggest collections and fields

5. **Update Proposed Collection**
   - Modify schema based on user input
   - Add fields, relations
   - Update collection structure

6. **Execute Proposed Action**
   - Create collections in Directus via MCP
   - Set up fields and relations
   - Configure permissions

7. **Connect Page to Directus**
   - Add data fetching
   - Create TypeScript types
   - Update components to use Directus data
   - Add service functions

## Process

1. **Wait for User Input**
   - Listen for file uploads or commands
   - Recognize patterns
   - Update session state

2. **Process Based on Pattern**
   - File upload → Initialize session
   - Sitemap config → Store mappings
   - Conversion request → Convert HTML
   - Collection analysis → Analyze and propose
   - Schema modification → Update proposal
   - Execution → Create in Directus
   - Page update → Connect to Directus

3. **Maintain State**
   - Keep track of all session data
   - Remember previous steps
   - Provide context in responses

## Output Format

Interactive responses based on user input:

- **File Upload**: Confirm files received, ask for sitemap
- **Sitemap Config**: Confirm routes, ready for conversion
- **Conversion**: Show converted component, ask about collections
- **Collection Analysis**: Propose schema, wait for approval/modification
- **Schema Update**: Show updated schema, confirm
- **Execution**: Create collections, confirm success
- **Page Update**: Show updated page with Directus integration

## Example Flow

```
USER: [uploads products.html, product-detail.html]
AI: Files received. Please provide route mappings.

USER: products is /products, product-detail is /products/[slug]
AI: Routes configured. Ready to convert.

USER: convert products.html to nextjs
AI: [Converts HTML to Next.js component]
     Component created. What collections does this need?

USER: what collections needed?
AI: [Analyzes HTML, proposes collections]
     Proposed: products collection with fields...

USER: add category relation and stock_count
AI: [Updates proposal]
     Updated schema. Create it?

USER: yes create it
AI: [Creates collections in Directus]
     Collections created. Update the Next.js page?

USER: update the nextjs page
AI: [Connects page to Directus, adds data fetching]
     Page updated with Directus integration.
```

## Reference

- HTML to Next.js guide: `chatgpt-bible-frontend/docs/reference/html-to-nextjs-directus-guide.md`
- Directus workflow: `chatgpt-bible-frontend/docs/reference/directus-nextjs-workflow.md`
- Complete chain: `.claude/rules/sections/12_slash_commands.md#convert-html-flow`

