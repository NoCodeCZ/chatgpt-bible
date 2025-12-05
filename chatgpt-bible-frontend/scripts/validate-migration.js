/**
 * Migration Validation Script (Story 2.2)
 * 
 * Validates that migration was successful by:
 * - Comparing prompt counts between source and Directus
 * - Checking random prompts for accuracy
 * - Verifying status and relationships
 * - Generating validation report
 * 
 * Usage:
 *   node scripts/validate-migration.js [source-path]
 */

// Load environment variables
try {
  require('dotenv').config({ path: '.env.local' });
} catch (e) {
  // dotenv not installed, use process.env directly
}

const { createDirectus, rest, readItems, aggregate } = require('@directus/sdk');
const fs = require('fs');
const path = require('path');

// Configuration
const DEFAULT_SOURCE_PATH = path.join(__dirname, '../data');
const SAMPLE_SIZE = 10; // Number of random prompts to inspect

// Initialize Directus client
const directusUrl = process.env.NEXT_PUBLIC_DIRECTUS_URL;
if (!directusUrl) {
  console.error('❌ Error: NEXT_PUBLIC_DIRECTUS_URL environment variable is required');
  process.exit(1);
}

const directus = createDirectus(directusUrl).with(rest());

/**
 * Logging utility
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const prefix = {
    info: '📝',
    success: '✅',
    error: '❌',
    warning: '⚠️',
    progress: '📊',
    check: '🔍',
  }[type] || '📝';
  
  console.log(`${prefix} [${timestamp}] ${message}`);
}

/**
 * Count prompts in source files
 */
function countSourcePrompts(sourcePath) {
  const dataFiles = [];
  const stats = fs.statSync(sourcePath);
  
  if (stats.isDirectory()) {
    const files = fs.readdirSync(sourcePath);
    for (const file of files) {
      if (file.endsWith('.json') && file.includes('batch')) {
        dataFiles.push(path.join(sourcePath, file));
      }
    }
  } else if (stats.isFile() && sourcePath.endsWith('.json')) {
    dataFiles.push(sourcePath);
  }
  
  let total = 0;
  for (const filePath of dataFiles) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const prompts = JSON.parse(content);
      if (Array.isArray(prompts)) {
        total += prompts.length;
      }
    } catch (error) {
      log(`Error reading ${filePath}: ${error.message}`, 'error');
    }
  }
  
  return total;
}

/**
 * Get prompts from Directus
 */
async function getDirectusPrompts() {
  try {
    const prompts = await directus.request(
      readItems('prompts', {
        fields: ['id', 'title_th', 'title_en', 'description', 'prompt_text', 'difficulty_level', 'status', 'subcategory_id'],
        limit: -1, // Get all
      })
    );
    
    return prompts;
  } catch (error) {
    log(`Error fetching prompts from Directus: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Get prompt statistics
 */
async function getPromptStats() {
  try {
    const stats = {
      total: 0,
      published: 0,
      draft: 0,
      archived: 0,
      beginner: 0,
      intermediate: 0,
      advanced: 0,
    };
    
    // Get total count
    const totalResult = await directus.request(
      aggregate('prompts', {
        aggregate: { count: '*' },
      })
    );
    stats.total = Number(totalResult[0].count) || 0;
    
    // Get counts by status
    const statusResult = await directus.request(
      aggregate('prompts', {
        aggregate: { count: '*' },
        groupBy: ['status'],
      })
    );
    
    statusResult.forEach((result) => {
      const status = result.status;
      const count = Number(result.count) || 0;
      if (status === 'published') stats.published = count;
      else if (status === 'draft') stats.draft = count;
      else if (status === 'archived') stats.archived = count;
    });
    
    // Get counts by difficulty
    const difficultyResult = await directus.request(
      aggregate('prompts', {
        aggregate: { count: '*' },
        groupBy: ['difficulty_level'],
      })
    );
    
    difficultyResult.forEach((result) => {
      const difficulty = result.difficulty_level;
      const count = Number(result.count) || 0;
      if (difficulty === 'beginner') stats.beginner = count;
      else if (difficulty === 'intermediate') stats.intermediate = count;
      else if (difficulty === 'advanced') stats.advanced = count;
    });
    
    return stats;
  } catch (error) {
    log(`Error fetching statistics: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Get random sample of prompts for manual inspection
 */
function getRandomSample(prompts, count) {
  const shuffled = [...prompts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, prompts.length));
}

/**
 * Validate prompt structure
 */
function validatePromptStructure(prompt) {
  const issues = [];
  
  if (!prompt.title_th && !prompt.title_en) {
    issues.push('Missing both title_th and title_en');
  }
  
  if (!prompt.description) {
    issues.push('Missing description');
  }
  
  if (!prompt.prompt_text) {
    issues.push('Missing prompt_text');
  }
  
  if (!prompt.status) {
    issues.push('Missing status');
  }
  
  if (!prompt.difficulty_level) {
    issues.push('Missing difficulty_level');
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Main validation function
 */
async function validateMigration(sourcePath) {
  log('🔍 Starting migration validation...', 'info');
  log(`Source: ${sourcePath}`, 'info');
  
  const validationReport = {
    sourceCount: 0,
    directusCount: 0,
    match: false,
    stats: null,
    samplePrompts: [],
    issues: [],
    timestamp: new Date().toISOString(),
  };
  
  try {
    // Count source prompts
    log('📊 Counting source prompts...', 'progress');
    validationReport.sourceCount = countSourcePrompts(sourcePath);
    log(`Source prompts: ${validationReport.sourceCount}`, 'info');
    
    // Get Directus prompts
    log('📊 Fetching prompts from Directus...', 'progress');
    const directusPrompts = await getDirectusPrompts();
    validationReport.directusCount = directusPrompts.length;
    log(`Directus prompts: ${validationReport.directusCount}`, 'info');
    
    // Compare counts
    validationReport.match = validationReport.directusCount >= validationReport.sourceCount;
    if (validationReport.match) {
      log(`✅ Count match: Directus has ${validationReport.directusCount} prompts (expected at least ${validationReport.sourceCount})`, 'success');
    } else {
      log(`⚠️ Count mismatch: Directus has ${validationReport.directusCount} prompts, expected ${validationReport.sourceCount}`, 'warning');
      validationReport.issues.push({
        type: 'count_mismatch',
        message: `Expected ${validationReport.sourceCount} prompts, found ${validationReport.directusCount}`,
      });
    }
    
    // Get statistics
    log('📊 Gathering statistics...', 'progress');
    validationReport.stats = await getPromptStats();
    
    log('', 'info');
    log('═══════════════════════════════════════', 'info');
    log('📊 Prompt Statistics', 'info');
    log('═══════════════════════════════════════', 'info');
    log(`Total prompts: ${validationReport.stats.total}`, 'info');
    log(`Published: ${validationReport.stats.published}`, validationReport.stats.published > 0 ? 'success' : 'warning');
    log(`Draft: ${validationReport.stats.draft}`, 'info');
    log(`Archived: ${validationReport.stats.archived}`, 'info');
    log(`Beginner: ${validationReport.stats.beginner}`, 'info');
    log(`Intermediate: ${validationReport.stats.intermediate}`, 'info');
    log(`Advanced: ${validationReport.stats.advanced}`, 'info');
    
    // Check that published prompts exist
    if (validationReport.stats.published === 0) {
      log('⚠️ Warning: No published prompts found', 'warning');
      validationReport.issues.push({
        type: 'no_published',
        message: 'No prompts have status=published',
      });
    }
    
    // Get random sample for manual inspection
    log('', 'info');
    log(`🔍 Getting ${SAMPLE_SIZE} random prompts for inspection...`, 'progress');
    const samplePrompts = getRandomSample(directusPrompts, SAMPLE_SIZE);
    
    log('', 'info');
    log('═══════════════════════════════════════', 'info');
    log('📋 Random Sample for Manual Inspection', 'info');
    log('═══════════════════════════════════════', 'info');
    
    samplePrompts.forEach((prompt, index) => {
      const validation = validatePromptStructure(prompt);
      const statusIcon = validation.valid ? '✅' : '❌';
      
      log('', 'info');
      log(`${statusIcon} Prompt #${index + 1} (ID: ${prompt.id})`, validation.valid ? 'success' : 'error');
      log(`  Title (EN): ${prompt.title_en || '(missing)'}`, 'info');
      log(`  Title (TH): ${prompt.title_th || '(missing)'}`, 'info');
      log(`  Status: ${prompt.status}`, prompt.status === 'published' ? 'success' : 'warning');
      log(`  Difficulty: ${prompt.difficulty_level || '(missing)'}`, 'info');
      log(`  Description length: ${prompt.description?.length || 0} chars`, 'info');
      log(`  Prompt text length: ${prompt.prompt_text?.length || 0} chars`, 'info');
      
      if (!validation.valid) {
        log(`  Issues: ${validation.issues.join(', ')}`, 'error');
        validationReport.issues.push({
          type: 'structure_issue',
          promptId: prompt.id,
          issues: validation.issues,
        });
      }
      
      validationReport.samplePrompts.push({
        id: prompt.id,
        title_en: prompt.title_en,
        title_th: prompt.title_th,
        status: prompt.status,
        difficulty_level: prompt.difficulty_level,
        validation,
      });
    });
    
    // Summary
    log('', 'info');
    log('═══════════════════════════════════════', 'info');
    log('📊 Validation Summary', 'info');
    log('═══════════════════════════════════════', 'info');
    log(`Source count: ${validationReport.sourceCount}`, 'info');
    log(`Directus count: ${validationReport.directusCount}`, 'info');
    log(`Count match: ${validationReport.match ? '✅ Yes' : '❌ No'}`, validationReport.match ? 'success' : 'error');
    log(`Published prompts: ${validationReport.stats.published}`, validationReport.stats.published > 0 ? 'success' : 'warning');
    log(`Issues found: ${validationReport.issues.length}`, validationReport.issues.length === 0 ? 'success' : 'warning');
    
    if (validationReport.issues.length > 0) {
      log('', 'info');
      log('⚠️ Issues found:', 'warning');
      validationReport.issues.forEach((issue, index) => {
        log(`  ${index + 1}. [${issue.type}] ${issue.message}`, 'error');
      });
    }
    
    log('', 'info');
    log('✅ Validation complete!', 'success');
    log('📝 Next steps:', 'info');
    log('  1. Manually inspect the random sample prompts above', 'info');
    log('  2. Verify they appear correctly in the frontend', 'info');
    log('  3. Test search functionality', 'info');
    log('  4. Check that categories/roles are assigned (if applicable)', 'info');
    
    return validationReport;
    
  } catch (error) {
    log(`❌ Validation failed: ${error.message}`, 'error');
    validationReport.issues.push({
      type: 'validation_error',
      message: error.message,
    });
    throw error;
  }
}

// CLI Interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const sourcePath = args[0] || DEFAULT_SOURCE_PATH;
  
  validateMigration(sourcePath)
    .then((report) => {
      // Save report to file
      const reportPath = path.join(__dirname, '../data/validation-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
      log(`📄 Validation report saved to: ${reportPath}`, 'info');
      
      process.exit(report.issues.length > 0 ? 1 : 0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = { validateMigration };

