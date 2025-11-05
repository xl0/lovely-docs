## vitePreprocess

Enables CSS preprocessing with PostCSS, SCSS, Less, Stylus, and SugarSS. Included by default with TypeScript projects.

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: [vitePreprocess()]
};
```

TypeScript support: native in Svelte 5 for type syntax only; use `vitePreprocess({ script: true })` for complex TypeScript in Svelte 5 or any TypeScript in Svelte 4.

## Add-ons

Use `npx sv add` to install integrations: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

## Packages

Browse curated Svelte packages on the packages page or sveltesociety.dev for libraries, templates, and resources.

## svelte-preprocess

Alternative preprocessor with additional features: Pug, Babel, and global styles support. May be slower and require more configuration than vitePreprocess. Install with `npm i -D svelte-preprocess` and add to svelte.config.js. CoffeeScript is not supported.

## Vite plugins

Use any Vite plugin from the vitejs/awesome-vite repository to enhance projects.