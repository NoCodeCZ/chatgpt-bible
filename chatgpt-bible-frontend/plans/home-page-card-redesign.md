# Implementation Plan: Home Page Card Redesign

## Overview

Update the card displays in home page sections (`FeaturesBlock` and `PromptsGridBlock`) to match the prompt card design shown in the provided images. The new design features:
- White cards on dark purple background
- Light purple icons (not in colored boxes)
- Free/Premium badges in top right corner
- Thai titles with tags below
- Eye icon with view count and arrow icon at bottom

## Research Summary

Based on the images provided:
1. **Prompt Cards Design**:
   - White cards (`bg-white`) with rounded corners
   - Light purple icon in top left (no background box)
   - Free/Premium badge in top right (purple pill for "ฟรี", black pill for "Premium")
   - Thai title (large, bold, white text on white card - wait, that doesn't make sense...)
   - Actually, looking closer: white cards with dark text
   - Tags displayed below title
   - Bottom section: eye icon + view count (0) and right arrow icon

2. **Current Implementation**:
   - `PromptsGridBlock`: White cards but with icon in colored background box
   - `FeaturesBlock`: Dark cards with purple icon backgrounds
   - Both need to match the new design

## Tasks

### Task 1: Update PromptsGridBlock Card Styling
**File**: `chatgpt-bible-frontend/components/blocks/PromptsGridBlock.tsx`
**Lines**: 62-143

**BEFORE**:
```typescript
<div
  key={index}
  className="bg-white rounded-2xl p-6 text-zinc-900 hover:shadow-xl hover:shadow-purple-500/10 transition-all"
>
  <div className="flex items-start justify-between mb-4">
    {prompt.icon && (
      <div className={`w-12 h-12 ${getIconColor(prompt.icon_color)} rounded-xl flex items-center justify-center`}>
        <span dangerouslySetInnerHTML={{ __html: prompt.icon }} />
      </div>
    )}
    {prompt.badge && (
      <span
        className={`text-white text-xs font-medium px-3 py-1 rounded-full ${
          prompt.badge === 'premium' ? 'bg-zinc-800' : 'bg-purple-600'
        }`}
      >
        {prompt.badge === 'premium' ? 'Premium' : 'ฟรี'}
      </span>
    )}
  </div>

  <h3 className="text-lg font-bold mb-2 text-zinc-900">{prompt.title}</h3>

  {prompt.tags && prompt.tags.length > 0 && (
    <div className="flex flex-wrap gap-2 mb-4">
      {prompt.tags.map((tag, tagIndex) => (
        <span
          key={tagIndex}
          className="bg-zinc-100 text-zinc-600 text-xs px-2 py-1 rounded-md"
        >
          {tag}
        </span>
      ))}
    </div>
  )}

  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
    {prompt.views !== undefined && (
      <div className="flex items-center gap-1 text-sm text-zinc-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <span>{prompt.views.toLocaleString()}</span>
      </div>
    )}
    {prompt.link && (
      <Link
        href={prompt.link}
        className="w-8 h-8 bg-zinc-100 hover:bg-zinc-200 rounded-full flex items-center justify-center transition-all"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4 text-zinc-600"
        >
          <path d="M5 12h14"></path>
          <path d="m12 5 7 7-7 7"></path>
        </svg>
      </Link>
    )}
  </div>
</div>
```

**AFTER**:
```typescript
<Link
  href={prompt.link || '#'}
  key={index}
  className="block bg-white rounded-2xl p-6 text-zinc-900 hover:shadow-xl hover:shadow-purple-500/10 transition-all group"
>
  <div className="flex items-start justify-between mb-4">
    {prompt.icon && (
      <div className="flex items-center justify-center text-purple-400">
        <span className="text-2xl" dangerouslySetInnerHTML={{ __html: prompt.icon }} />
      </div>
    )}
    {prompt.badge && (
      <span
        className={`text-white text-xs font-medium px-3 py-1 rounded-full ${
          prompt.badge === 'premium' ? 'bg-zinc-800' : 'bg-purple-600'
        }`}
      >
        {prompt.badge === 'premium' ? 'Premium' : 'ฟรี'}
      </span>
    )}
  </div>

  <h3 className="text-lg font-bold mb-3 text-zinc-900 leading-snug line-clamp-2">{prompt.title}</h3>

  {prompt.tags && prompt.tags.length > 0 && (
    <div className="flex flex-wrap gap-2 mb-6">
      {prompt.tags.map((tag, tagIndex) => (
        <span
          key={tagIndex}
          className="bg-zinc-100 text-zinc-600 text-xs px-2 py-1 rounded-md"
        >
          {tag}
        </span>
      ))}
    </div>
  )}

  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
    <div className="flex items-center gap-1.5 text-sm text-zinc-500">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      <span>{prompt.views !== undefined ? prompt.views.toLocaleString() : '0'}</span>
    </div>
    <div className="flex items-center gap-1 text-xs text-zinc-500 group-hover:text-purple-600 transition-colors">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
      </svg>
    </div>
  </div>
</Link>
```

**Notes**: 
- Remove the `getIconColor` function usage - icons should be light purple directly
- Wrap card in Link for better UX
- Always show eye icon and view count (default to 0)
- Always show arrow icon (not conditional on link)
- Update spacing and styling to match image

### Task 2: Remove getIconColor Function (if no longer needed)
**File**: `chatgpt-bible-frontend/components/blocks/PromptsGridBlock.tsx`
**Lines**: 26-37

**BEFORE**:
```typescript
const getIconColor = (iconColor?: string) => {
  if (!iconColor) return 'bg-purple-100 text-purple-600';
  const colorMap: Record<string, string> = {
    purple: 'bg-purple-100 text-purple-600',
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    orange: 'bg-orange-100 text-orange-600',
    cyan: 'bg-cyan-100 text-cyan-600',
    pink: 'bg-pink-100 text-pink-600',
  };
  return colorMap[iconColor] || 'bg-purple-100 text-purple-600';
};
```

**AFTER**:
```typescript
// Removed - icons now use direct purple color styling
```

**Notes**: This function is no longer needed since icons are styled directly with `text-purple-400`

### Task 3: Update FeaturesBlock Card Styling
**File**: `chatgpt-bible-frontend/components/blocks/FeaturesBlock.tsx`
**Lines**: 56-79

**BEFORE**:
```typescript
<div
  key={index}
  className={`${cardClasses} rounded-2xl p-8 text-center hover:bg-zinc-900/70 transition-all`}
>
  {/* Icon */}
  {feature.icon && (
    <div className="w-16 h-16 bg-purple-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
      <span className="text-2xl text-purple-400" dangerouslySetInnerHTML={{ __html: feature.icon }} />
    </div>
  )}

  {/* Title */}
  <h3 className={`text-lg font-bold mb-3 ${textColorClasses} ${theme === 'dark' ? 'text-white' : ''}`}>
    {feature.title}
  </h3>

  {/* Description */}
  <p className={`text-sm leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-300' : 'text-zinc-600'}`}>
    {feature.description}
  </p>
</div>
```

**AFTER**:
```typescript
<div
  key={index}
  className="bg-white rounded-2xl p-6 text-zinc-900 hover:shadow-xl hover:shadow-purple-500/10 transition-all"
>
  <div className="flex items-start justify-between mb-4">
    {/* Icon */}
    {feature.icon && (
      <div className="flex items-center justify-center text-purple-400">
        <span className="text-2xl" dangerouslySetInnerHTML={{ __html: feature.icon }} />
      </div>
    )}
    {/* No badge for features - leave empty space or remove this div if no icon */}
    {!feature.icon && <div></div>}
  </div>

  {/* Title */}
  <h3 className="text-lg font-bold mb-3 text-zinc-900 leading-snug">
    {feature.title}
  </h3>

  {/* Description */}
  <p className="text-sm leading-relaxed text-zinc-600 line-clamp-3">
    {feature.description}
  </p>
</div>
```

**Notes**: 
- Change FeaturesBlock cards to white background to match prompt cards
- Remove dark theme card styling for features
- Update icon styling to match prompt cards (light purple, no background)
- Update text colors for white card background

### Task 4: Update FeaturesBlock Section Background
**File**: `chatgpt-bible-frontend/components/blocks/FeaturesBlock.tsx`
**Lines**: 33-37

**BEFORE**:
```typescript
<section className={`sm:px-6 lg:px-8 px-4 py-20 ${themeClasses} relative`}>
  {/* Subtle overlay for better text readability */}
  {theme === 'dark' && (
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent z-0 pointer-events-none"></div>
  )}
```

**AFTER**:
```typescript
<section className={`sm:px-6 lg:px-8 px-4 py-20 ${theme === 'dark' ? 'bg-transparent' : 'bg-white'} relative`}>
  {/* Subtle overlay for better text readability */}
  {theme === 'dark' && (
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-transparent z-0 pointer-events-none"></div>
  )}
```

**Notes**: Keep dark theme background transparent to show animation, but ensure cards are white

### Task 5: Update FeaturesBlock Text Colors
**File**: `chatgpt-bible-frontend/components/blocks/FeaturesBlock.tsx`
**Lines**: 40-52

**BEFORE**:
```typescript
{(heading || description) && (
  <div className="text-center mb-16">
    {heading && (
      <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${textColorClasses} ${theme === 'dark' ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' : ''}`}>
        {heading}
      </h2>
    )}
    {description && (
      <p className={`text-base font-medium ${theme === 'dark' ? 'text-zinc-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' : 'text-zinc-600'}`}>
        {description}
      </p>
    )}
  </div>
)}
```

**AFTER**:
```typescript
{(heading || description) && (
  <div className="text-center mb-16">
    {heading && (
      <h2 className={`text-3xl sm:text-4xl font-bold tracking-tight mb-4 ${theme === 'dark' ? 'text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]' : 'text-zinc-900'}`}>
        {heading}
      </h2>
    )}
    {description && (
      <p className={`text-base font-medium ${theme === 'dark' ? 'text-zinc-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]' : 'text-zinc-600'}`}>
        {description}
      </p>
    )}
  </div>
)}
```

**Notes**: Simplify text color logic since cards are now always white

## Complete Chain Checklist
- [x] TypeScript Interface (types/blocks.ts) - No changes needed
- [x] Service Function (lib/services/) - No changes needed
- [x] Component Updates (components/blocks/)
  - [ ] PromptsGridBlock.tsx - Update card styling
  - [ ] FeaturesBlock.tsx - Update card styling
- [ ] Directus Collection - No changes needed
- [ ] Validation (npm run build)

## Directus Setup Checklist
N/A - No Directus changes required

## Validation Steps
1. `npm run lint` - Check for linting errors
2. `npx tsc --noEmit` - Check for TypeScript errors
3. `npm run build` - Verify build succeeds
4. Visual check - Verify cards match the provided image design:
   - White cards on dark background
   - Light purple icons (no background boxes)
   - Free/Premium badges in top right
   - Tags displayed below titles
   - Eye icon + view count and arrow icon at bottom

