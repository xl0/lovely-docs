## installPolyfills

Installs polyfills for web APIs that are not available in Node.js environments.

```js
import { installPolyfills } from '@sveltejs/kit/node/polyfills';

installPolyfills();
```

Makes the following globals available:
- `crypto` - Web Crypto API
- `File` - File API for handling file objects