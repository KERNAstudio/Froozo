# Froozo Cafe — Madhavadhara, Visakhapatnam

Standalone Vite + React + TanStack Router rebuild of the site originally
prototyped in Lovable. Pulled from Lovable project `52e78806-92cc-4357-bb26-ad69fd394e9c`.

## What changed vs. the Lovable version

The Lovable project used **TanStack Start** (SSR, file-based routing with
codegen, a Nitro server) plus Lovable's own `@lovable.dev/vite-tanstack-config`
build plugin — none of which exists outside Lovable's infra. This rebuild is:

- Plain **Vite + React 19**, client-side only (no SSR, no server.ts/start.ts)
- **TanStack Router** in code-based mode (`src/router.tsx`) instead of
  file-based routing + `routeTree.gen.ts` codegen
- Page `<title>`/meta description set via a small `useDocumentMeta` hook
  (`src/lib/useDocumentMeta.ts`) instead of TanStack Start's SSR `head()`
  route option
- The sprite sheet is a normal Vite asset import
  (`import spriteUrl from "@/assets/froozo-hero-sprite.webp"`) instead of
  Lovable's `*.asset.json` indirection

All actual page content, copy, the design-token palette, the menu data, and
the `SpriteScrubber`/`FoodStory` scroll-hero logic are carried over verbatim.

## Setup

```bash
npm install

# Re-add shadcn/ui components as needed (none are wired into the pages yet —
# the original project only imported the base primitives, none were actually
# used by name in these custom components). Add specific ones on demand, e.g.:
npx shadcn@latest add button dialog

npm run dev
```

Then open the printed local URL.

## Structure

```
src/
  routes/           Home, Menu, Gallery, Location, NotFound
  components/site/  SiteHeader, SiteFooter, OrderButtons, CategoryIcon,
                     FoodStory (scroll narrative), SpriteScrubber (canvas hero)
  components/site/food/foodConfigs.ts   burger/pizza/milkshake data configs
  data/menu.ts       full menu content + outlet info (address, hours, links)
  assets/            froozo-hero-sprite.webp (78-frame scroll sequence)
  styles.css         design tokens — teal/oak/sage/brass palette pulled from
                     the outlet's real interior photos
```

## Known gaps carried over from the Lovable build

- Gallery is still illustrated placeholder tiles — real interior/food
  photography hasn't been shot yet.
- No food-model switcher UI wired up yet (pizza/milkshake configs exist in
  `foodConfigs.ts` but nothing in the UI lets a visitor pick them).
- No backend/CMS — menu content is a static TypeScript file.
