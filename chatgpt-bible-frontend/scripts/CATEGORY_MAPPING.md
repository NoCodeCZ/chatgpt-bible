# Category & Subcategory Mapping for Upload

## Category Number → UUID Mapping

| Number | Name (EN) | UUID | Slug |
|--------|-----------|------|------|
| 1 | General Business Toolkit | `e5df043e-8777-4aba-9086-8725dbbda592` | general-business-toolkit |
| 2 | Email Marketing | `d7ea0435-67ab-4839-ac8d-f7c1ec71a869` | email-marketing |
| 3 | Building an Online Funnel | `b76cba3b-4a78-4e28-b03e-0b21c9fce908` | building-online-funnel |
| 4 | Website & Ecommerce | `e1748187-0467-495a-9464-19091e156b26` | website-ecommerce |
| 5 | Affiliate Marketing | `b6665a4c-5591-40a7-b9b1-43ec659f18e4` | affiliate-marketing |
| 6 | Facebook Marketing | `e1cecb42-6daf-44d0-8739-383c4605308b` | facebook-marketing |
| 7 | YouTube Marketing | `e6081c42-8d07-40a0-a522-ea80898e5f05` | youtube-marketing |
| 8 | Customer Service | `f6a470f1-f82d-4586-bb14-2f67b85477c0` | customer-service |
| 9 | SMS Marketing | `ab64dbf5-421a-4e61-8b92-9685e8696ae8` | sms-marketing |
| 10 | SEO & Content | `a90a8bcc-a23b-40c8-b7d5-f90fe74b2e15` | seo-content |
| 11 | Podcast Marketing | `d026a66f-88b3-4f7c-a58a-66fa47d3a73c` | podcast-marketing |
| 14 | Social Media | `0ebb8146-8826-42f3-abff-3f834566de1c` | social-media |
| 16 | Copywriting Assistant | `57b9b4b0-6736-4e7b-ae15-5f123624c503` | copywriting-assistant |

## Subcategory Number → ID Mapping

### Category 1 (General Business Toolkit)
| Number | Name (EN) | ID | Slug | Status |
|--------|-----------|----|------|--------|
| 1.1 | Researching Your Competitors | 2 | researching-competitors | ✅ Created |
| 1.2 | Creating a Business Plan | 3 | creating-business-plan | ✅ Created |
| 1.3 | Writing Proposals for Clients | 4 | writing-proposals-clients | ✅ Created |
| 1.4 | Company Vision Statement | - | - | ⏳ Need to create |
| 1.5 | Generating Business Ideas | - | - | ⏳ Need to create |
| 1.6 | Preparing to Pitch Investors | - | - | ⏳ Need to create |
| 1.7 | Hiring and Leadership | - | - | ⏳ Need to create |
| 1.8 | Writing a Meeting Summary | - | - | ⏳ Need to create |

### Other Categories
- All other subcategories need to be created during upload
- Total: 94 subcategories (3 created, 91 remaining)

## Prompt Type Mapping

| Thai Name | English Name | UUID | Slug |
|-----------|--------------|------|------|
| แบบเติมคำ (FILL-IN-THE-BLANK PROMPTS): | Fill-in-the-blank Prompts | `a2b2511e-4b31-4dc6-a32f-183e610355a0` | fill-in-blank |
| แบบปลายเปิด (OPEN-ENDED PROMPTS): | Open-ended Prompts | `3359228e-da00-41c7-abf2-54e4a6c971bb` | open-ended |
| แบบสถานการณ์จำลอง (SCENARIO PROMPTS): | Scenario-based Prompts | `93af6c0e-9454-4172-b35f-bbc7d3a10a73` | scenario-based |
| เชิงคำแนะนำ (INSTRUCTIONAL PROMPTS): | Instructional Prompts | `39b2b419-d5a0-4c8e-96a1-f22f837e2ee6` | instructional |
| เชิงคำถาม (QUESTION-BASED PROMPTS): | Question-based Prompts | `40976da9-11cf-4e41-90b7-935ef722d0fc` | question-based |

## Job Role Mapping

| ID | Name | Slug |
|----|------|------|
| 1 | Manager | manager |

**Note:** More job roles can be created during upload if needed.

## Usage in Upload Script

When uploading prompts:
1. Use category mapping to get UUID from category_number
2. Use subcategory mapping to get ID from subcategory_number  
3. Use prompt type mapping to get UUID from prompt_type text
4. Create `prompt_categories` junction records for category relationships
5. Create `prompt_job_roles` junction records for job role relationships (optional, default to Manager ID 1)

