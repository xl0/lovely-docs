## sequence

Chains multiple `handle` hooks. `transformPageChunk` applies in reverse order; `preload` and `filterSerializedResponseHeaders` apply in forward order with first one winning.

```js
import { sequence } from '@sveltejs/kit/hooks';

export const handle = sequence(first, second);
```