## sveltekit

Async function that returns an array of Vite plugins for SvelteKit:

```js
import { sveltekit } from '@sveltejs/kit/vite';
const plugins = await sveltekit(); // Promise<Plugin[]>
```