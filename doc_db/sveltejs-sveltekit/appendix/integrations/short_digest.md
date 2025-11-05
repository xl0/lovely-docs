## vitePreprocess
Enables CSS preprocessing (PostCSS, SCSS, Less, Stylus, SugarSS). Included by default with TypeScript.

```js
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
const config = { preprocess: [vitePreprocess()] };
```

## Add-ons
`npx sv add` installs: prettier, eslint, vitest, playwright, lucia, tailwind, drizzle, paraglide, mdsvex, storybook.

## Alternatives
- **svelte-preprocess**: Supports Pug, Babel, global styles; requires manual setup
- **Vite plugins**: Use any plugin from vitejs/awesome-vite