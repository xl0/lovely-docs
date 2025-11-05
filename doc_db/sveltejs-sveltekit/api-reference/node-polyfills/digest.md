The `installPolyfills()` function from `@sveltejs/kit/node/polyfills` makes web APIs available as globals in Node.js environments. It polyfills:
- `crypto`
- `File`

Usage:
```js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';
installPolyfills();
```