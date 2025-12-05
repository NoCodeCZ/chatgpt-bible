# Testing Guide - Prompt Features

This guide helps you test all the Epic 2 prompt features in the Next.js frontend.

## Prerequisites

1. **Directus Instance Running**
   - Your Directus instance must be accessible
   - Prompts should be imported (use migration script if needed)

2. **Environment Variables**
   - Create `.env.local` file in `chargpt-bible-frontend/` directory
   - Add: `NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-instance.com`

3. **Dependencies Installed**
   ```bash
   npm install
   ```

## Starting the Dev Server

```bash
cd chargpt-bible-frontend
npm run dev
```

The server will start at: **http://localhost:3000**

## Testing Checklist

### 1. Prompt List Page (`/prompts`)

**URL:** http://localhost:3000/prompts

**What to Test:**
- [ ] Prompts are displayed in a grid layout
- [ ] Each prompt card shows:
  - [ ] Title (Thai/English)
  - [ ] Description (truncated)
  - [ ] Categories (blue badges)
  - [ ] Job roles (purple badges)
  - [ ] Difficulty badge (green/yellow/red)
- [ ] Pagination works (if more than 20 prompts)
- [ ] Empty state shows when no prompts found

### 2. Search Functionality (Story 2.4)

**What to Test:**
- [ ] Search bar appears at top of prompts page
- [ ] Type in search bar (e.g., "email")
- [ ] Results update after 500ms debounce
- [ ] Search persists in URL (`?search=email`)
- [ ] Clear button (X) appears when typing
- [ ] Clear button removes search and shows all prompts
- [ ] Search works with Thai and English text
- [ ] Empty state shows when no search results

**Test Cases:**
- Search for: "email", "report", "manager", "การวิเคราะห์"
- Try partial matches
- Try clearing search

### 3. Category Filtering (Story 2.3)

**Desktop:**
- [ ] Filter sidebar appears on left side
- [ ] Categories list shows all available categories
- [ ] Click checkbox to select category
- [ ] URL updates with `?categories=slug1,slug2`
- [ ] Filtered results show only prompts with selected categories
- [ ] Multiple categories can be selected (OR logic)
- [ ] Filter count badge shows number of active filters
- [ ] "Clear All" button removes all filters

**Mobile:**
- [ ] Filter button appears in header
- [ ] Clicking opens drawer from left
- [ ] Drawer closes when filter is applied
- [ ] Drawer can be closed with X button
- [ ] Backdrop closes drawer when clicked

**Test Cases:**
- Select 1 category → Should show prompts in that category
- Select 2 categories → Should show prompts in either category
- Clear filters → Should show all prompts

### 4. Job Role Filtering (Story 2.3)

**What to Test:**
- [ ] Job roles section in filter sidebar
- [ ] Select job role checkbox
- [ ] URL updates with `?jobRoles=slug1,slug2`
- [ ] Filtered results show only prompts with selected roles
- [ ] Multiple roles can be selected
- [ ] Works in combination with category filters

**Test Cases:**
- Select "Manager" → Should show manager-related prompts
- Select multiple roles → Should show prompts for any role
- Combine with category filter → Should show intersection

### 5. Difficulty Filter (Story 2.5)

**What to Test:**
- [ ] Difficulty filter section in sidebar
- [ ] Radio buttons for Beginner/Intermediate/Advanced
- [ ] Select difficulty level
- [ ] URL updates with `?difficulty=beginner`
- [ ] Filtered results show only that difficulty
- [ ] Color indicators (green/yellow/red dots) visible
- [ ] Can clear difficulty filter

**Test Cases:**
- Select "Beginner" → Should show only beginner prompts
- Select "Advanced" → Should show only advanced prompts
- Clear filter → Should show all difficulties

### 6. Combined Filters (Story 2.3, 2.4, 2.5)

**What to Test:**
- [ ] Search + Category filter
- [ ] Search + Job Role filter
- [ ] Search + Difficulty filter
- [ ] Category + Job Role + Difficulty
- [ ] All filters combined (Search + Category + Role + Difficulty)
- [ ] URL reflects all active filters
- [ ] Filter count badge shows correct number
- [ ] "Clear All" removes all filters

**Test Cases:**
- Search "email" + Category "Business" → Should show business emails
- Category "Marketing" + Role "Manager" → Should show marketing prompts for managers
- All filters → Should show very specific results

### 7. Pagination with Filters (Story 2.3)

**What to Test:**
- [ ] Pagination preserves filters in URL
- [ ] Navigate to page 2 with filters active
- [ ] Filters remain active on page 2
- [ ] Search persists across pages
- [ ] Filter changes reset to page 1

**Test Cases:**
- Apply filters → Go to page 2 → Filters should remain
- Change filter → Should reset to page 1
- Search + page 2 → Search should persist

### 8. Prompt Detail Page (`/prompts/[id]`)

**URL:** http://localhost:3000/prompts/1 (replace 1 with actual prompt ID)

**What to Test:**
- [ ] Full prompt details displayed
- [ ] Title (Thai/English)
- [ ] Description
- [ ] Metadata (categories, job roles, difficulty badge)
- [ ] Prompt text in code block format
- [ ] Copy button works
- [ ] Related prompts section appears (if available)
- [ ] Related prompts are clickable
- [ ] Related prompts exclude current prompt
- [ ] Related prompts show matching category OR job role

**Test Cases:**
- Click a prompt card → Should navigate to detail page
- Check related prompts → Should show 3-5 related prompts
- Click related prompt → Should navigate to that prompt
- Verify related prompts share category or job role

### 9. Mobile Responsiveness

**What to Test:**
- [ ] Filter drawer works on mobile
- [ ] Search bar is full-width on mobile
- [ ] Prompt cards stack vertically on mobile
- [ ] Related prompts grid adapts to mobile
- [ ] All buttons are touch-friendly
- [ ] Text is readable on small screens

**Test Cases:**
- Resize browser to mobile width (< 1024px)
- Test filter drawer opening/closing
- Test search functionality
- Test prompt card layout

### 10. Performance (Story 2.6)

**What to Test:**
- [ ] Initial page load < 3 seconds
- [ ] Filter changes respond quickly (< 500ms)
- [ ] Search results appear quickly
- [ ] No console errors
- [ ] Smooth transitions between pages

**Tools:**
- Browser DevTools → Network tab
- Browser DevTools → Performance tab
- Lighthouse audit (optional)

### 11. Error Handling

**What to Test:**
- [ ] Invalid prompt ID shows 404 page
- [ ] Network errors handled gracefully
- [ ] Empty states show appropriate messages
- [ ] Loading skeletons appear during data fetch

**Test Cases:**
- Navigate to `/prompts/99999` (non-existent ID) → Should show 404
- Disconnect internet → Should show error (if implemented)
- No prompts match filters → Should show empty state

## Common Issues & Solutions

### Issue: "NEXT_PUBLIC_DIRECTUS_URL is required"

**Solution:**
1. Create `.env.local` file in `chargpt-bible-frontend/` directory
2. Add: `NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-url.com`
3. Restart dev server

### Issue: No prompts showing

**Solution:**
1. Check Directus has prompts with `status=published`
2. Verify Directus URL is correct
3. Check browser console for errors
4. Verify prompts have required fields (title_th, title_en, description, prompt_text)

### Issue: Filters not working

**Solution:**
1. Check categories/job roles exist in Directus
2. Verify prompts have relationships assigned
3. Check browser console for API errors
4. Verify URL parameters are updating

### Issue: Search not working

**Solution:**
1. Check Directus search is enabled
2. Verify prompts have text in title/description
3. Check browser console for errors
4. Try different search terms

### Issue: Related prompts not showing

**Solution:**
1. Verify prompt has categories or job roles assigned
2. Check other prompts exist with same category/role
3. Verify related prompts service is working
4. Check browser console for errors

## Testing URLs

- **Home:**** http://localhost:3000
- **Prompts List:** http://localhost:3000/prompts
- **Prompt Detail:** http://localhost:3000/prompts/1 (replace 1 with actual ID)
- **With Filters:** http://localhost:3000/prompts?categories=slug&jobRoles=manager&difficulty=beginner&search=email

## Browser DevTools Tips

1. **Network Tab:** Monitor API calls to Directus
2. **Console Tab:** Check for JavaScript errors
3. **Application Tab:** Check localStorage/cookies
4. **Elements Tab:** Inspect component structure

## Next Steps After Testing

1. **Report Issues:** Note any bugs or unexpected behavior
2. **Performance:** Check load times and optimize if needed
3. **UX Improvements:** Suggest UI/UX enhancements
4. **Documentation:** Update docs based on findings

---

**Happy Testing!** 🚀

