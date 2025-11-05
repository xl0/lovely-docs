`sveltekit()` from `@sveltejs/kit/vite` returns the Vite plugins array needed for SvelteKit integration.

```js
import { sveltekit } from '@sveltejs/kit/vite';
const plugins = await sveltekit();
```