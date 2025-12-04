# Navbar Setup Guide

This guide explains how to set up the dynamic navigation bar for the CharGPT Bible website.

## Overview

The navbar system consists of:
- **Directus Collection**: `navigation` - Stores menu items
- **Service Layer**: `lib/services/navigation.ts` - Fetches data from Directus
- **TypeScript Types**: `types/Navigation.ts` - Type definitions
- **React Component**: `components/layout/Navbar.tsx` - Renders the navbar
- **Integration**: `app/layout.tsx` - Includes navbar in root layout

## Step 1: Create Navigation Collection in Directus

1. **Log into Directus Admin Panel**
   - Open your Directus instance URL
   - Sign in with admin credentials

2. **Navigate to Data Model**
   - Click **Settings** in the sidebar
   - Click **Data Model**

3. **Create New Collection**
   - Click **"Create Collection"** button
   - Set **Collection Name**: `navigation`
   - Enable the following options:
     - ✅ Hidden Collection (unchecked)
     - ✅ Singleton (unchecked)
     - ✅ Translations (unchecked for MVP)

4. **Add Fields** (in order)

   Click **"Create Field"** for each field below:

   ### Primary Key Field
   - **Field Name**: `id`
   - **Type**: UUID
   - **Interface**: Input (Hash)
   - **Options**:
     - ✅ Primary Key
     - ✅ Hidden
     - ✅ Readonly

   ### Status Field
   - **Field Name**: `status`
   - **Type**: String
   - **Interface**: Dropdown
   - **Options**:
     - Default Value: `published`
     - Choices:
       ```
       published = Published
       draft = Draft
       archived = Archived
       ```
   - **Layout**: Half Width

   ### Sort Field
   - **Field Name**: `sort`
   - **Type**: Integer
   - **Interface**: Input
   - **Placeholder**: Order (lower = first)
   - **Note**: "Order of navigation items (lower numbers appear first)"
   - **Layout**: Half Width

   ### Label Field (Required)
   - **Field Name**: `label`
   - **Type**: String
   - **Interface**: Input
   - **Max Length**: 255
   - **Required**: ✅ Yes
   - **Note**: "Text displayed in navigation"
   - **Layout**: Half Width

   ### URL Field (Required)
   - **Field Name**: `url`
   - **Type**: String
   - **Interface**: Input
   - **Max Length**: 500
   - **Required**: ✅ Yes
   - **Note**: "Link destination (e.g., /prompts or https://example.com)"
   - **Layout**: Half Width

   ### Is External Field
   - **Field Name**: `is_external`
   - **Type**: Boolean
   - **Interface**: Toggle
   - **Default Value**: `false`
   - **Note**: "Is this an external link?"
   - **Layout**: Half Width

   ### Target Field
   - **Field Name**: `target`
   - **Type**: String
   - **Interface**: Dropdown
   - **Default Value**: `_self`
   - **Choices**:
     ```
     _self = Same Tab
     _blank = New Tab
     ```
   - **Note**: "How link should open"
   - **Layout**: Half Width

   ### Icon Field (Optional)
   - **Field Name**: `icon`
   - **Type**: String
   - **Interface**: Input
   - **Max Length**: 100
   - **Note**: "Optional icon name (for future use)"
   - **Layout**: Half Width

   ### Metadata Fields (Auto-generated)
   Add these standard Directus fields:

   - **Field Name**: `date_created`
     - Type: Timestamp
     - Interface: Datetime
     - Special: Date Created
     - Hidden: ✅ Yes

   - **Field Name**: `date_updated`
     - Type: Timestamp
     - Interface: Datetime
     - Special: Date Updated
     - Hidden: ✅ Yes

   - **Field Name**: `user_created`
     - Type: UUID
     - Interface: Select Dropdown (M2O)
     - Special: User Created
     - Hidden: ✅ Yes

   - **Field Name**: `user_updated`
     - Type: UUID
     - Interface: Select Dropdown (M2O)
     - Special: User Updated
     - Hidden: ✅ Yes

5. **Configure Collection Settings**
   - Click on the `navigation` collection
   - Go to **Collection Settings** (⚙️ icon)
   - Set **Display Template**: `{{label}}`
   - Set **Sort Field**: `sort`
   - Click **Save**

## Step 2: Set Collection Permissions

1. **Navigate to Settings → Access Control → Public Role**
2. **Find the `navigation` collection**
3. **Set permissions**:
   - Read: ✅ **Custom** (set condition: `status = published`)
   - Create: ❌ No access
   - Update: ❌ No access
   - Delete: ❌ No access

4. **For Admin Role**: Grant full access (CRUD)

## Step 3: Add Sample Navigation Items

Add these sample navigation items via Directus Admin Panel:

### Home Link
- Status: `published`
- Sort: `10`
- Label: `Home`
- URL: `/`
- Is External: `false`
- Target: `_self`

### Prompts Link
- Status: `published`
- Sort: `20`
- Label: `Prompts`
- URL: `/prompts`
- Is External: `false`
- Target: `_self`

### About Link
- Status: `published`
- Sort: `30`
- Label: `About`
- URL: `/about`
- Is External: `false`
- Target: `_self`

### Pricing Link
- Status: `published`
- Sort: `40`
- Label: `Pricing`
- URL: `/pricing`
- Is External: `false`
- Target: `_self`

### Optional: External Link Example
- Status: `published`
- Sort: `50`
- Label: `Blog`
- URL: `https://yourblog.com`
- Is External: `true`
- Target: `_blank`

## Step 4: Verify Environment Variables

Ensure your `.env.local` file contains:

```bash
NEXT_PUBLIC_DIRECTUS_URL=https://your-directus-instance.directus.app
```

## Step 5: Test the Implementation

1. **Start the development server**:
   ```bash
   cd chargpt-bible-frontend
   npm run dev
   ```

2. **Visit http://localhost:3000**

3. **Verify the navbar**:
   - ✅ Navigation items appear in correct order
   - ✅ Links navigate to correct pages
   - ✅ Mobile menu works (hamburger icon)
   - ✅ External links open in new tab (if target = _blank)
   - ✅ Styling matches site design

4. **Test responsiveness**:
   - Desktop (1024px+): Horizontal menu
   - Tablet (768px - 1023px): Horizontal menu
   - Mobile (<768px): Hamburger menu

## Troubleshooting

### Navbar doesn't appear
1. Check browser console for errors
2. Verify `NEXT_PUBLIC_DIRECTUS_URL` is set correctly
3. Ensure navigation collection has at least one published item
4. Check Directus permissions for public role

### "Collection not found" error
- The `navigation` collection hasn't been created in Directus yet
- Follow Step 1 to create the collection

### Navigation items don't show
1. Check that items have `status = published`
2. Verify public role has read access to navigation collection
3. Clear Next.js cache: `rm -rf .next && npm run dev`

### Mobile menu doesn't work
- This is a client-side feature using React state
- Ensure JavaScript is enabled in browser
- Check browser console for React errors

## Architecture Notes

### Server vs Client Components
- **Layout** (`app/layout.tsx`): Server Component - Fetches nav data
- **Navbar** (`components/layout/Navbar.tsx`): Client Component - Handles interactivity

### Data Flow
1. Root layout (server) fetches navigation via `getNavigationItems()`
2. Navigation service queries Directus API
3. Data is passed as props to Navbar client component
4. Navbar renders with click handlers for mobile menu

### Performance
- Navigation is fetched once per page load (SSR)
- No client-side API calls for navigation
- Fast initial render with server-side data
- Mobile menu toggle is instant (client-side state)

## Future Enhancements

Consider these features post-MVP:
- **Nested menus** (dropdown submenus)
- **Icons** for navigation items (integrate icon library)
- **Active state highlighting** (show current page in nav)
- **Sticky behavior customization** (via Directus setting)
- **Multiple navigation sets** (header, footer, sidebar)
- **Internationalization** (multi-language labels)
- **User role-based visibility** (show/hide items by auth status)

## Files Modified

- ✅ `types/Navigation.ts` - Type definitions
- ✅ `lib/services/navigation.ts` - Data fetching service
- ✅ `components/layout/Navbar.tsx` - UI component
- ✅ `app/layout.tsx` - Integration in root layout

## Quick Command Reference

```bash
# Start dev server
npm run dev

# Check for TypeScript errors
npx tsc --noEmit

# Run linter
npm run lint

# Build for production
npm run build
```

## Support

If you encounter issues:
1. Check the [CLAUDE.md](./CLAUDE.md) project documentation
2. Review Directus logs in admin panel
3. Check Next.js console output for errors
4. Verify all environment variables are set

---

**Setup Complete!** Your navbar should now be dynamically managed through Directus.
