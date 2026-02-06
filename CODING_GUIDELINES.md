# Coding Guidelines (for Codex / contributors)

## Stack & Structure
- Framework: Next.js (App Router), React 19, TypeScript, TailwindCSS
- i18n: next-intl (App Router + [locale] segment)
- Keep the current folder structure and existing patterns.

## Non-negotiables
- **No `any`**. Use proper types, generics, type guards, or `unknown` + narrowing.
- Do **not** change config files (`next.config.*`, `tsconfig.json`, eslint config, Tailwind config) unless explicitly requested.
- Avoid sweeping refactors. **Keep changes minimal** and scoped to the task.
- Don’t introduce new libraries unless explicitly asked.

## Next.js / React rules
- Use Server Components by default; add `"use client"` only when needed.
- Do not access `window`, `document`, `localStorage` in Server Components.
- Avoid hydration mismatch:
  - No `Date.now()` / `Math.random()` for SSR output
  - If something must be client-only, gate it properly in a Client Component.

## i18n (next-intl)
- All UI text must come from `useTranslations()` keys.
- Do not hardcode strings in UI (unless explicitly allowed).
- Respect locale-aware routing and params.

## Styling
- Use Tailwind utility classes (prefer existing design tokens/patterns).
- Keep className changes minimal.
- Avoid adding new global CSS unless necessary.

## Commands to run before finalizing
- `npm run lint`
- `npm run typecheck`
- (If the task impacts build) `npm run build`

## Output expectations
- Provide a short summary of what changed.
- List files touched.
- Mention any tradeoffs or assumptions.