# Automated Prompt Upload Guide

## Overview

The automated upload script (`upload-prompts-automated.js`) is designed for scalable, reliable prompt uploads with:

- ✅ **Resume capability** - Can resume from where it left off
- ✅ **Error handling** - Retries failed uploads automatically
- ✅ **Progress tracking** - Saves progress after each batch
- ✅ **Safe re-runs** - Skips already uploaded prompts
- ✅ **Detailed logging** - Shows progress and errors
- ✅ **Batch processing** - Handles large volumes efficiently

## Prerequisites

1. **Environment variables** - Ensure `.env.local` has:
   ```env
   NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-instance.com
   ```

2. **Dependencies** - Already installed:
   - `@directus/sdk` (v20.1.1)
   - `dotenv` (for environment variables)

## Usage

### Upload All Batches

```bash
node scripts/upload-prompts-automated.js
```

### Upload Specific Batches

```bash
# Upload batches 1-5
node scripts/upload-prompts-automated.js 1 5

# Upload from batch 2 onwards
node scripts/upload-prompts-automated.js 2

# Upload batches 10-15
node scripts/upload-prompts-automated.js 10 15
```

## How It Works

1. **Loads batches** from `data/prompt-batches.json`
2. **Checks progress** from `data/upload-progress.json`
3. **Filters duplicates** - Skips already uploaded prompts
4. **Uploads in chunks** - 50 prompts per API call
5. **Saves progress** - After each successful chunk
6. **Retries failures** - Up to 3 attempts with exponential backoff

## Progress Tracking

The script creates `data/upload-progress.json` with:

```json
{
  "uploaded": [
    {
      "id": 42,
      "prompt_text": "...",
      "title_th": "...",
      "batch": 1,
      "uploaded_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "failed": [
    {
      "prompt_text": "...",
      "title_th": "...",
      "batch": 2,
      "error": "Error message",
      "failed_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "lastBatch": 5
}
```

## Resuming Uploads

If the script stops (network error, interruption, etc.):

1. **Simply re-run** the same command
2. The script will **automatically skip** already uploaded prompts
3. It will **continue from** where it left off

## Handling Failures

If some prompts fail:

1. Check `data/upload-progress.json` for failed items
2. Re-run the script - it will retry failed uploads
3. For persistent failures, check:
   - Network connectivity
   - Directus API permissions
   - Data validation (subcategory_id, prompt_type_id)

## Future Uploads

For new prompt data:

1. **Parse new data** using `parse-and-upload-prompts.js`
2. **Generate batches** using `upload-prompts-batch.js`
3. **Run automated upload**:
   ```bash
   node scripts/upload-prompts-automated.js
   ```

The script will:
- ✅ Skip existing prompts (by prompt_text comparison)
- ✅ Upload only new prompts
- ✅ Track progress for both

## Performance

- **Batch size**: 50 prompts per API call
- **Rate limiting**: 500ms delay between chunks
- **Retry logic**: 3 attempts with exponential backoff
- **Expected speed**: ~100-200 prompts/minute (depends on API response time)

## Troubleshooting

### "Cannot find module '@directus/sdk'"
```bash
cd chargpt-bible-frontend
npm install
```

### "NEXT_PUBLIC_DIRECTUS_URL is not defined"
- Check `.env.local` exists
- Verify environment variable name
- Ensure script runs from project root

### "Permission denied" errors
- Check Directus API token permissions
- Verify collection access rights
- Ensure subcategory_id and prompt_type_id exist

### Script stops mid-upload
- Check network connectivity
- Review Directus server logs
- Re-run script - it will resume automatically

## Best Practices

1. **Test with small batches first**:
   ```bash
   node scripts/upload-prompts-automated.js 1 1
   ```

2. **Monitor progress** - Watch console output and `upload-progress.json`

3. **Backup progress file** - Before large uploads, copy `upload-progress.json`

4. **Run during off-peak hours** - For large uploads (1000+ prompts)

5. **Verify results** - Check Directus admin panel after upload completes







