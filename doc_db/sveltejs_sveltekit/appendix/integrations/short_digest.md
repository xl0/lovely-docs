## vitePreprocess

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const config = { preprocess: [vitePreprocess()] };
```

Enables PostCSS, SCSS, Less, Stylus, SugarSS. Included by default with TypeScript. For Svelte 5 complex TypeScript: `vitePreprocess({ script: true })`.

## Add-ons

`npx sv add` installs: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

## svelte-preprocess

Alternative with Pug, Babel, global styles support. Install: `npm i -D svelte-preprocess` plus language libraries (sass, less, etc).

## Vite plugins

Use any Vite plugin from vitejs/awesome-vite repository.

## FAQs

See SvelteKit FAQ for integration questions.