# Upload Scripts Overview

## Scripts Available

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






