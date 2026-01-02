# UI Generation Prompt - v0 / Lovable

Copy and paste this into v0.dev or Lovable to generate the component:

---

```
Create a React component called PromptListItem for a prompt library app.

Requirements:
- Dark theme with black background and purple accents
- Display prompts in a fully expanded, card-based layout
- One-click copy button for each prompt
- Copy feedback animation ("Copied!" state)
- Difficulty badge (beginner=green, intermediate=yellow, advanced=red)
- Category badge showing the prompt's category
- Lock overlay for premium/locked prompts
- Mobile responsive

Props interface:
interface PromptListItemProps {
  prompt: {
    id: number;
    title_th: string;
    title_en: string;
    description: string;
    prompt_text: string;
    difficulty_level: 'beginner' | 'intermediate' | 'advanced';
    subcategory_id: {
      category_id: {
        name_th: string;
        name_en: string;
      };
      name_th: string;
      name_en: string;
    };
  };
  isLocked?: boolean;
}

Visual design:
- Card background: zinc-900/60 with border-white/10
- Rounded corners: rounded-2xl
- Copy button: purple-600 with purple-500 hover
- Prompt text: monospace font in code block (black/40 background)
- Title: white, text-lg, medium font weight
- Badges: pill-shaped, small text

The copy button should:
- Be positioned at the top right of the card
- Show "Copy" by default
- Change to "Copied!" with green color when clicked
- Revert after 2 seconds

For locked prompts, blur the prompt text and show a lock overlay with "Upgrade to unlock" message.
```

---

## Tailwind Classes Reference

```css
/* Container */
bg-zinc-900/60 border border-white/10 rounded-2xl p-6

/* Header Section */
flex items-start justify-between gap-4 mb-4

/* Badges */
rounded-full border px-3 py-1 text-xs font-medium
border-green-500/20 bg-green-500/5 text-green-400

/* Copy Button */
bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors

/* Prompt Code Block */
bg-black/40 rounded-xl p-4 font-mono text-sm text-zinc-300 whitespace-pre-wrap
```

---

## Example Data Structure

```json
{
  "id": 1,
  "title_th": "การสร้างหัวข้ออีเมล",
  "title_en": "Generating Email Subject Lines",
  "description": "สร้างหัวข้ออีเมลที่ดึงดูดใจผู้รับ",
  "prompt_text": "Act as an email marketing expert. Create 10 compelling subject lines for [product/service] that will increase open rates. Consider: urgency, curiosity, personalization, and clarity.",
  "difficulty_level": "beginner",
  "subcategory_id": {
    "category_id": {
      "name_th": "การตลาดผ่านอีเมล",
      "name_en": "Email Marketing"
    },
    "name_th": "การสร้างหัวข้ออีเมล",
    "name_en": "Generating Email Subject Lines"
  }
}
```
