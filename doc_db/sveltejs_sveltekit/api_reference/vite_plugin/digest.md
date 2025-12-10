## sveltekit

The `sveltekit()` function returns an array of Vite plugins required for SvelteKit.

```js
import { sveltekit } from '@sveltejs/kit/vite';

const plugins = await sveltekit();
```

**Signature:**
```ts
function sveltekit(): Promise<import('vite').Plugin[]>;
```

Returns a Promise that resolves to an array of Vite Plugin objects.