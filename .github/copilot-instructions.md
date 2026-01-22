# AI Coding Agent Instructions

## Project Overview

**Portfolio Hedgehog** is a bilingual (HR/EN) Next.js portfolio website showcasing web development services. It uses modern animations, component-based architecture, and internationalization via `next-intl`.

### Key Tech Stack
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 4 + TailwindCSS PostCSS plugin
- **i18n**: `next-intl` for HR/EN locale routing
- **Animation**: Motion library for smooth component animations
- **UI Components**: Radix UI (switch), Tabler Icons, React Icons
- **Type Safety**: Full TypeScript with path alias `@/*`

## Architecture Patterns

### Localization (i18n)

All text is **externalized to JSON** at `messages/{locale}.json` (currently `en.json`, `hr.json`).

**Routing Convention**:
- Root app layout (`app/layout.tsx`) is minimal
- Locale-specific layout at `app/[locale]/layout.tsx` wraps content with `NextIntlClientProvider`
- Supported locales: `['hr', 'en']` with `hr` as default in `i18n/routing.ts`
- URL structure: `/{locale}/{page}` (e.g., `/en/projects`, `/hr/about`)

**Usage in Components**:
```tsx
"use client";
import { useTranslations } from "next-intl";

export function MyComponent() {
  const t = useTranslations("SectionName"); // Match JSON key
  return <h1>{t("key")}</h1>; // e.g., t("home") → "Home" or "Početna"
}
```

For locale-aware links in nav:
```tsx
const localeHref = (slug?: string) => `/${locale}/${slug || ""}`;
```

### Component Organization

- **UI Components** (`components/ui/`): Reusable, unstyled or minimally styled building blocks (bento-grid, resizable-navbar, switch, typewriter-effect)
- **Page Components** (`components/mainpage/`): Full sections combining UI + animations (Introduction, Projects, TypewriterEffectHero)
- **Shared** (`components/navigation/`, `components/background/`, `components/socials/`): Layout parts used across pages

### Styling & Tailwind

- **Custom CSS** in `app/globals.css` defines CSS variables (--dot-color, --glow-color, --bg-from/via/to) for gradients and themes
- **Class Utility**: Use `cn()` from `lib/utils.ts` (via `clsx` + `tailwind-merge`) to merge Tailwind classes safely
- **Motion Integration**: Import from `motion/react` for animations; components export `motion.div`, `motion.section`, etc.

### Image Optimization

`next.config.ts` whitelist remote image domains for Next.js `Image` component:
- `localhost`, `wp.zivic-elektro.shop`, `res.cloudinary.com`, `images.unsplash.com`, `assets.aceternity.com`, `api.microlink.io`

Always use `next/image` for remote images, not `<img>`.

## File Structure Guide

```
app/[locale]/                    # Locale-aware pages
├── layout.tsx                   # Wraps pages with i18n & layout components
├── page.tsx                     # Home (/)
├── about/page.tsx               # (/about)
├── projects/page.tsx            # (/projects)
└── contact/page.tsx             # (/contact)

components/
├── mainpage/                    # Full-page sections
│   ├── Introduction.tsx         # Bento grid showcase (uses icons + translations)
│   ├── Projects.tsx             # Project cards grid
│   └── TypewriterEffectHero.tsx # Animated hero banner
├── navigation/
│   ├── NavBar.tsx               # Main navbar with mobile responsive menu
│   └── LangSwitch.tsx           # Language toggle
├── background/
│   └── DottedBackground.tsx     # Animated dotted background
└── ui/
    ├── bento-grid.tsx           # Responsive grid layout
    ├── resizable-navbar.tsx     # Mobile-aware navbar structure
    └── typewriter-effect.tsx    # Text animation component

messages/
├── en.json                      # English translations (flat key structure)
└── hr.json                      # Croatian translations

i18n/
├── routing.ts                   # Locale config & supported locales
├── request.ts                   # Server-side i18n utilities
└── navigation.ts                # Locale-aware link helpers
```

## Common Workflows

### Adding a New Page

1. Create `app/[locale]/newpage/page.tsx`
2. Create translation keys in `messages/en.json` and `messages/hr.json` under a new section (e.g., `"NewPage": {...}`)
3. Use `useTranslations("NewPage")` in your component
4. Add nav link in `NavBar.tsx` with `localeHref("newpage")`

### Using Animations

```tsx
"use client"; // Required for Motion
import { motion } from "motion/react";

export function AnimatedSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      Content
    </motion.div>
  );
}
```

### Adding UI Components

Place reusable, theme-agnostic components in `components/ui/`. Example:
```tsx
// components/ui/my-component.tsx
export function MyComponent({ className, ...props }) {
  return <div className={cn("base-class", className)} {...props} />;
}
```

## Development Commands

```bash
npm run dev    # Start dev server (http://localhost:3000)
npm run build  # Production build
npm run start  # Run production server
npm run lint   # Run ESLint (Next.js config)
```

## Code Quality

- **ESLint**: Uses `eslint-config-next` (core-web-vitals + TypeScript rules)
- **TypeScript**: Strict mode enabled; all types must be explicit
- **Imports**: Use `@/*` alias for absolute imports from workspace root

## Important Notes

- **No React Context/Redux**: Components use simple `useState` + `useCallback` for state
- **Server Components**: `page.tsx` files are server components by default; use `"use client"` explicitly for interactive components
- **Message Keys**: Match JSON keys to `useTranslations()` argument exactly (case-sensitive)
- **Locale Param**: Always handle `params: Promise<{ locale: string }>` with `await params` in layout components
