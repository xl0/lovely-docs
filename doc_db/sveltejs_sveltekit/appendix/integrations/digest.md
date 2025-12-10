## vitePreprocess

Include `vitePreprocess` from `@sveltejs/vite-plugin-svelte` to use CSS flavors supported by Vite: PostCSS, SCSS, Less, Stylus, SugarSS.

```js
// svelte.config.js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: [vitePreprocess()]
};

export default config;
```

TypeScript is included by default when set up with TypeScript. For Svelte 4, a preprocessor is required for TypeScript. Svelte 5 supports TypeScript natively for type syntax only; use `vitePreprocess({ script: true })` for complex TypeScript syntax.

## Add-ons

Use `npx sv add` to setup integrations:
- prettier (formatting)
- eslint (linting)
- vitest (unit testing)
- playwright (e2e testing)
- lucia (auth)
- tailwind (CSS)
- drizzle (DB)
- paraglide (i18n)
- mdsvex (markdown)
- storybook (frontend workshop)

## Packages

High-quality Svelte packages are available on the packages page. Additional libraries, templates, and resources are at sveltesociety.dev.

## svelte-preprocess

`svelte-preprocess` offers additional functionality beyond `vitePreprocess`: support for Pug, Babel, and global styles. However, `vitePreprocess` may be faster and require less configuration, so it's used by default. CoffeeScript is not supported.

Install with `npm i -D svelte-preprocess` and add to `svelte.config.js`. Often requires installing corresponding libraries like `npm i -D sass` or `npm i -D less`.

## Vite plugins

SvelteKit projects use Vite, so Vite plugins can enhance your project. Available plugins are listed in the vitejs/awesome-vite repository.

## Integration FAQs

The SvelteKit FAQ answers questions about integrating features with SvelteKit.