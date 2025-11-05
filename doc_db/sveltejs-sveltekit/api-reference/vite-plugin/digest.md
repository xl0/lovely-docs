The `sveltekit()` function from `@sveltejs/kit/vite` returns an array of Vite plugins required for SvelteKit projects.

```js
import { sveltekit } from '@sveltejs/kit/vite';

const plugins = await sveltekit();
```

This is typically used in your `vite.config.js` to integrate SvelteKit with Vite's build system.