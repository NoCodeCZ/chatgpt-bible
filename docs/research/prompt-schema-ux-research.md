# Prompt Schema & UX Research

> Research document for restructuring the prompt display system based on user stories and content analysis from Thai prompt source files.

**Date:** 2026-01-02
**Researcher:** Claude (Opus 4.5)
**Status:** Analysis Complete

---

## Executive Summary

The ChatGPT Bible prompt content is organized around a **3-method user journey** that teaches users HOW to use prompts based on their situation (urgent vs. brainstorming vs. learning). The current Directus schema and frontend display do not fully support this educational framework.

**Key Finding:** The content is not just a prompt catalog—it's an **educational system** that teaches users 3 distinct methods of using AI prompts. The UI needs to reflect this.

---

## 1. Content Structure Analysis

### 1.1 Source File Organization

The Thai prompt content (บท 1-5.md) follows this hierarchical structure:

```
Chapter (บท)
├── Section (หัวข้อหลัก)
│   └── Subsection (หัวข้อย่อย) e.g., "1.1 การวิเคราะห์คู่แข่ง"
│       ├── PROMPT แบบเติมคำ (Fill-in-the-Blank)
│       │   └── [List of template prompts with placeholders]
│       ├── PROMPT แบบปลายเปิด (Open-Ended)
│       │   └── [List of brainstorming questions]
│       └── PROMPT เชิงคำถาม (Questions-Based)
│           └── [List of guided questions]
```

### 1.2 Content Hierarchy Example (from บท 2.md)

```markdown
## 2. เครื่องมือพื้นฐานสำหรับธุรกิจ
### 2.1 การวิเคราะห์คู่แข่ง

**PROMPT แบบเติมคำ (FILL-IN-THE-BLANK PROMPTS):**
* นี่คือรายชื่อคู่แข่ง... **[ระบุอุตสาหกรรม]**

**PROMPT แบบปลายเปิด (OPEN-ENDED PROMPTS):**
1. "ใครคือคู่แข่งคนสำคัญใน **[ระบุอุตสาหกรรม]**..."
```

### 1.3 Chapter Breakdown

| Chapter | Content Focus | Prompt Types |
|---------|--------------|--------------|
| บท 1 | Introduction - How to use this system | Educational |
| บท 2 | Business Toolkit (เครื่องมือพื้นฐาน) | Fill-in, Open-ended |
| บท 3 | Social Media Marketing | Fill-in, Open-ended |
| บท 4 | Content Marketing | Fill-in, Open-ended |
| บท 5 | Personal Development | Fill-in, Open-ended |

---

## 2. The 3-Method User Journey

### 2.1 Method Definition (from บท 1 & บท 2)

The content explicitly teaches users **3 methods** of using prompts:

| Method | Thai Name | English Translation | Use Case | Prompt Type |
|--------|-----------|---------------------|----------|-------------|
| **วิธีที่ 1** | สูตรสำเร็จ (The Recipe) | Quick Template | Urgent tasks, need specific output | Fill-in-the-Blank |
| **วิธีที่ 2** | คู่คิดระดมสมอง | Brainstorming Partner | Explore ideas, get perspectives | Open-Ended |
| **วิธีที่ 3** | ตำราเรียนเชิงกลยุทธ์ | Strategic Playbook | Study structure, learn patterns | Educational/Study |

### 2.2 User Journey Flow

```
User arrives at Prompts page
│
├── "I need something QUICK" → Method 1: Fill-in-the-Blank templates
│   └── Copy template, fill in [placeholders], use immediately
│
├── "I want to EXPLORE ideas" → Method 2: Open-Ended brainstorming
│   └── Select question, have AI conversation, iterate
│
└── "I want to LEARN" → Method 3: Study the prompt structure
    └── Read explanations, understand prompt engineering principles
```

---

## 3. Current Directus Schema Analysis

### 3.1 Existing Collections

| Collection | Purpose | Fields |
|-----------|---------|--------|
| `categories` | Top-level categories (Business, Marketing, etc.) | id, name, slug, name_th, name_en, description |
| `subcategories` | Specific topics (e.g., "Competitor Analysis") | id, name_th, name_en, slug, category_id, sort |
| `prompts` | Individual prompt items | id, title_th, title_en, description, prompt_text, difficulty_level, subcategory_id, **prompt_type_id** |
| `prompt_types` | Type classification | id, name_th, name_en, slug, icon |
| `prompt_categories` | Junction (M2M) | categories_id, prompts_id |
| `prompt_job_roles` | Junction (M2M) | prompts_id, job_roles_id |
| `job_roles` | Job role targeting | id, name, slug, description |

### 3.2 Schema Strengths

✅ **Already supports:**
- `prompt_type_id` field in `prompts` collection
- `prompt_types` collection with multilingual names
- Hierarchical categories → subcategories structure
- Multilingual support (name_th, name_en)
- Difficulty levels
- Job role targeting

### 3.3 Schema Gaps

❌ **Missing or underutilized:**

1. **Chapter/Section organization** - No way to group prompts by "บท 2" or chapter number
2. **Prompt Method tagging** - No way to identify which of the 3 methods a prompt belongs to
3. **Prompt groups/sets** - No way to show "all prompts for 1.1 Competitor Analysis"
4. **Use case indicators** - No way to mark "best for urgent tasks" vs "best for brainstorming"
5. **Placeholder detection** - No metadata about which prompts have `[placeholders]`

---

## 4. UX Improvement Recommendations

### 4.1 Core UX Problems

| Problem | Impact | Solution |
|---------|--------|----------|
| Users don't know HOW to use prompts | High bounce rate | Add "3 Methods" education landing |
| Fill-in-the-blank prompts look same as open-ended | Confusion | Visual distinction with icons/badges |
| Can't find "quick" prompts | Frustration | Filter by use case (urgent vs. explore) |
| No context for prompt structure | Low learning | Show "prompt pattern" explanations |

### 4.2 Proposed UX Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    PROMPTS LANDING PAGE                         │
├─────────────────────────────────────────────────────────────────┤
│  [Hero Section]                                                  │
│  "Choose how you want to use AI prompts today:"                  │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ 📝 Recipe   │  │ 💡 Explore  │  │ 📚 Learn    │             │
│  │ Quick       │  │ Brainstorm  │  │ Study       │             │
│  │ Templates   │  │ Partners    │  │ Patterns    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  OR browse by: [Categories ▼] [Job Roles ▼]                    │
└─────────────────────────────────────────────────────────────────┘
```

### 4.3 Prompt Card Enhancements

Current prompt card should add:
- **Method badge**: 📝 Fill-in | 💡 Open-ended | 📚 Study
- **Use case tag**: Quick | Explore | Learn
- **Placeholder indicator**: Shows number of `[placeholders]` to fill
- **Time estimate**: ~2 min | ~10 min conversation

---

## 5. Schema Adjustment Recommendations

### 5.1 New Fields to Add

| Collection | Field | Type | Purpose |
|-----------|-------|------|---------|
| `subcategories` | `chapter_number` | string | e.g., "1", "2" for chapter grouping |
| `subcategories` | `section_number` | string | e.g., "1", "1.1" for display |
| `prompts` | `use_case` | string | Enum: "quick", "brainstorm", "learn" |
| `prompts` | `placeholder_count` | integer | Number of [placeholders] in prompt |
| `prompts` | `estimated_time` | string | e.g., "2 min", "5-10 min" |
| `prompts` | `pattern_explanation` | text | Educational explanation of the prompt pattern |

### 5.2 Utilize Existing `prompt_type_id`

The `prompt_types` collection already exists! It should be populated with:

| id | name_th | name_en | slug | icon |
|----|---------|---------|------|------|
| UUID | เติมคำ | Fill-in-the-Blank | fill-in-blank | 📝 |
| UUID | ปลายเปิด | Open-Ended | open-ended | 💡 |
| UUID | คำถามนำ | Question-Based | question-based | ❓ |
| UUID | ศึกษา | Educational | educational | 📚 |

### 5.3 New Collection: `chapters` (Optional)

For better organization of the book-like structure:

| Field | Type | Purpose |
|-------|------|---------|
| id | UUID | Primary key |
| chapter_number | integer | 1, 2, 3, 4, 5 |
| title_th | string | Chapter title in Thai |
| title_en | string | Chapter title in English |
| description_th | text | Chapter intro |
| slug | string | URL-friendly |
| sort | integer | Display order |

Then link `subcategories` to `chapters` via `chapter_id`.

---

## 6. Frontend Component Changes

### 6.1 New Components Needed

```
components/prompts/
├── MethodSelector.tsx          # 3-method choice cards
├── PromptMethodBadge.tsx       # 📝/💡/📚 badge component
├── PlaceholderIndicator.tsx    # Shows "[3] placeholders"
├── PromptPatternCard.tsx       # Educational pattern explanation
└── ChapterNavigation.tsx       # Chapter-based navigation (บท 1-5)
```

### 6.2 Page Structure Changes

```
app/prompts/
├── page.tsx                    # Landing with 3-method selector
├── method/
│   ├── quick/page.tsx          # Fill-in-the-blank templates
│   ├── brainstorm/page.tsx     # Open-ended prompts
│   └── learn/page.tsx          # Educational content
├── chapters/
│   └── [chapter]/page.tsx      # Chapter-based listing (บท 1-5)
└── [slug]/page.tsx             # Individual prompt detail
```

---

## 7. Migration Considerations

### 7.1 Data Migration Steps

1. **Populate `prompt_types`** with the 4 core types
2. **Update existing prompts** with correct `prompt_type_id`
3. **Add `use_case` field** to prompts collection
4. **Tag existing prompts** by use case (quick/brainstorm/learn)
5. **Create chapter records** if implementing `chapters` collection
6. **Link subcategories** to chapters

### 7.2 Content Mapping

| Source Structure | Target Schema |
|-----------------|---------------|
| บท 2 → Chapter 2 | `chapters.id = 2` |
| 2.1 การวิเคราะห์คู่แข่ง | `subcategories.section_number = "1.1"` |
| PROMPT แบบเติมคำ | `prompts.prompt_type_id = fill-in-blank` |
| Fill-in-the-blank content | `prompts.use_case = "quick"` |

---

## 8. Success Metrics

Track these metrics after implementation:

1. **Method engagement** - Which method do users choose most?
2. **Copy rate by type** - Do fill-in-the-blank get copied more?
3. **Time on page** - Do users spend more time on "learn" content?
4. **Return visits** - Do users come back to explore other methods?
5. **Bounce rate** - Does the 3-method landing reduce bounce rate?

---

## 9. Recommended Implementation Priority

### Phase 1: Quick Wins (High Impact, Low Effort)
1. Populate `prompt_types` with proper values
2. Update existing prompts with `prompt_type_id`
3. Add visual badges to prompt cards (📝/💡/📚)
4. Add filter by prompt type on prompts page

### Phase 2: Enhanced Experience (Medium Effort)
1. Add 3-method selector to landing page
2. Create method-specific pages (quick/brainstorm/learn)
3. Add chapter-based navigation
4. Add placeholder count indicator

### Phase 3: Full Educational Platform (Higher Effort)
1. Create `chapters` collection
2. Build chapter-based content pages
3. Add pattern explanations
4. Implement progressive disclosure (teach as you use)

---

## 10. Appendix: Content Examples

### Example 1: Fill-in-the-Blank Prompt
```markdown
Title: การวิเคราะห์คู่แข่ง
Prompt: นี่คือรายชื่อคู่แข่งสำคัญในอุตสาหกรรม **[ระบุอุตสาหกรรม]**:
**[ชื่อคู่แข่ง 1]**, **[ชื่อคู่แข่ง 2]**, และ **[ชื่อคู่แข่ง 3]**
```
- Type: Fill-in-the-Blank
- Use Case: Quick
- Placeholders: 3

### Example 2: Open-Ended Prompt
```markdown
Title: ค้นหาคู่แข่ง
Prompt: "ใครคือคู่แข่งคนสำคัญใน **[ระบุอุตสาหกรรม/ตลาดเฉพาะกลุ่ม]**
และพวกเขามีอะไรบ้าง?"
```
- Type: Open-Ended
- Use Case: Brainstorm
- Placeholders: 1

---

## Next Steps

1. **Review this research** with UX team/stakeholders
2. **Decide on Phase 1 scope** (quick wins vs. full implementation)
3. **Create migration plan** for existing data
4. **Design UI mockups** for 3-method landing page
5. **Implement schema changes** in Directus
6. **Update frontend components** with new UX patterns
