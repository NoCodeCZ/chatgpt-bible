# Scripts Overview

## Scripts Available

### Admin User Creation

#### `create-admin-user.js` 🔐

**Purpose:** Create an admin user in Directus with full access permissions

**Usage:**
```bash
# Basic usage (email and password only)
node scripts/create-admin-user.js admin@example.com "SecurePassword123!"

# With name
node scripts/create-admin-user.js admin@example.com "SecurePassword123!" "John" "Doe"
```

**What it does:**
- Creates a new user in Directus
- Assigns Administrator role (full access)
- Sets user status to active
- Validates email format and password length

**Requirements:**
- `DIRECTUS_TOKEN` or `DIRECTUS_ADMIN_TOKEN` must be set in `.env.local`
- Token must have admin permissions

**Example:**
```bash
cd chargpt-bible-frontend
node scripts/create-admin-user.js admin@mysite.com "MySecurePass123!" "Admin" "User"
```

---

## Upload Scripts

### 1. `upload-prompts-automated.js` ⭐ **RECOMMENDED**

**Best for:** Production uploads, large volumes, future scalability

**Features:**
- ✅ Resume capability
- ✅ Error handling & retries
- ✅ Progress tracking
- ✅ Safe re-runs (skips duplicates)
- ✅ Detailed logging

**Usage:**
```bash
# Upload all batches
node scripts/upload-prompts-automated.js

# Upload specific batches
node scripts/upload-prompts-automated.js 1 5
```

**See:** `UPLOAD_GUIDE.md` for full documentation

---

### 2. `parse-and-upload-prompts.js`

**Purpose:** Parse markdown file into structured JSON

**Usage:**
```bash
node scripts/parse-and-upload-prompts.js
```

**Output:** `data/parsed-prompts.json`

---

### 3. `upload-prompts-batch.js`

**Purpose:** Prepare prompt data into batches

**Usage:**
```bash
node scripts/upload-prompts-batch.js
```

**Output:** `data/prompt-batches.json`

---

## Quick Start for Future Uploads

1. **Parse new data:**
   ```bash
   node scripts/parse-and-upload-prompts.js
   ```

2. **Generate batches:**
   ```bash
   node scripts/upload-prompts-batch.js
   ```

3. **Upload automatically:**
   ```bash
   node scripts/upload-prompts-automated.js
   ```

The automated script will:
- Skip already uploaded prompts
- Resume from where it left off
- Handle errors gracefully
- Track progress automatically

## Why Automated Script?

For **future uploads with large volumes**, the automated script provides:

1. **Reliability** - Won't lose progress if interrupted
2. **Efficiency** - Skips duplicates automatically  
3. **Scalability** - Handles 1000+ prompts easily
4. **Maintainability** - One script for all future uploads
5. **Safety** - Can re-run without duplicating data

## Manual Upload Alternative

If you prefer manual control via MCP tools:
- Use `batch-X-ready.json` files from `data/` directory
- Upload via MCP Directus `items` tool
- More control but slower for large volumes






