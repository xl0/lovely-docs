## Tailwind v4 Migration

Upgrade from Tailwind v3 to v4 and Svelte 4 to v5. Requires Svelte 5 + Tailwind v3 as starting point.

### Key Changes
- CSS-based config with `@theme inline` replaces `tailwind.config.ts`
- Vite replaces PostCSS
- HSL colors convert to OKLCH
- `tw-animate-css` replaces `tailwindcss-animate`
- New `size-*` utility replaces `w-* h-*`

### Steps
1. Follow official Tailwind v4 upgrade guide
2. Replace PostCSS with Vite in `vite.config.ts`
3. Update `app.css` with CSS variables and `@theme inline`
4. Update dependencies
5. Optionally add type helpers to `utils.ts`
6. Optionally update components and colors with CLI
7. Use `size-*` instead of `w-* h-*`

### New Projects
```bash
npx shadcn-svelte@latest init
```